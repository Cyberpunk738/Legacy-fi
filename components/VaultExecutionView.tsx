"use client";

import React, { useState, useEffect } from "react";
import { 
  Landmark, 
  ShieldCheck, 
  ExternalLink, 
  Play, 
  CheckCircle2, 
  AlertTriangle, 
  Sparkles, 
  RotateCcw, 
  ArrowRight,
  GraduationCap,
  Layers,
  Copy,
  Check,
  Wallet,
  Zap,
  Globe,
  Coins,
  ArrowDownToLine
} from "lucide-react";
import confetti from "canvas-confetti";
import { InheritancePlan } from "@/lib/types";
import { planStore } from "@/lib/inheritance/planStore";
import { sibylMemory } from "@/lib/sibyl/memoryEngine";
import { 
  INHERITANCE_VAULT_ADDRESS, 
  BASE_SEPOLIA_CHAIN_ID, 
  BASE_EXPLORER_URL, 
  simulateOnchainExecution, 
  connectWeb3Wallet,
  executeRealWalletDistribution,
  depositTestnetEth,
  OnchainTxResult 
} from "@/lib/base/contractClient";
import { NavTab } from "./Navbar";

interface VaultExecutionViewProps {
  setActiveTab: (tab: NavTab) => void;
}

export function VaultExecutionView({ setActiveTab }: VaultExecutionViewProps) {
  const [plan, setPlan] = useState<InheritancePlan>(() => planStore.getPlan());
  const [isActivating, setIsActivating] = useState(false);
  const [isExecuting, setIsExecuting] = useState(false);
  const [isDepositing, setIsDepositing] = useState(false);
  const [txResult, setTxResult] = useState<OnchainTxResult | null>(null);
  const [copied, setCopied] = useState(false);
  
  // Real Web3 Wallet State
  const [executionMode, setExecutionMode] = useState<"simulation" | "live_wallet">("simulation");
  const [walletAddress, setWalletAddress] = useState<`0x${string}` | null>(null);
  const [walletBalance, setWalletBalance] = useState<string>("0.00");
  const [walletError, setWalletError] = useState<string | null>(null);
  const [depositSuccess, setDepositSuccess] = useState<string | null>(null);

  useEffect(() => {
    const update = () => setPlan(planStore.getPlan());
    window.addEventListener("inheritance-plan-updated", update);
    return () => window.removeEventListener("inheritance-plan-updated", update);
  }, []);

  const handleConnectWallet = async () => {
    setWalletError(null);
    try {
      const res = await connectWeb3Wallet();
      if (res) {
        setWalletAddress(res.address);
        setWalletBalance(res.balanceEth);
        setExecutionMode("live_wallet");
      }
    } catch (err: any) {
      setWalletError(err.message || "Failed to connect Web3 wallet.");
    }
  };

  const handleDepositTestnet = async () => {
    if (!walletAddress) {
      await handleConnectWallet();
      return;
    }
    setIsDepositing(true);
    setWalletError(null);
    try {
      const res = await depositTestnetEth(walletAddress, "0.001");
      setDepositSuccess(`Deposited 0.001 Base Sepolia ETH! Tx: ${res.txHash.slice(0, 10)}...`);
      // Update balance
      const updatedBalance = (parseFloat(walletBalance) - 0.001).toFixed(4);
      setWalletBalance(updatedBalance);
      setTimeout(() => setDepositSuccess(null), 6000);
    } catch (err: any) {
      setWalletError(err.message || "Deposit failed. Check your Base Sepolia balance.");
    } finally {
      setIsDepositing(false);
    }
  };

  const handleSimulateActivation = async () => {
    setIsActivating(true);
    await new Promise((resolve) => setTimeout(resolve, 800));
    planStore.setStatus("activated");
    setIsActivating(false);
  };

  const handleExecuteDistribution = async () => {
    setIsExecuting(true);
    setWalletError(null);

    try {
      let result: OnchainTxResult;

      if (executionMode === "live_wallet" && walletAddress) {
        result = await executeRealWalletDistribution(walletAddress);
      } else {
        result = await simulateOnchainExecution();
      }

      setTxResult(result);
      planStore.setStatus("distributed", result.txHash);

      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 },
        colors: ["#a565ff", "#5e5cff", "#2e7317", "#e0c9ff"],
      });
    } catch (e: any) {
      console.error("Execution failed", e);
      setWalletError(e.message || "Distribution execution failed on Base Sepolia.");
    } finally {
      setIsExecuting(false);
    }
  };

  const handleResetVault = () => {
    planStore.resetToDefault();
    setTxResult(null);
    setWalletError(null);
  };

  const copyAddress = () => {
    navigator.clipboard.writeText(INHERITANCE_VAULT_ADDRESS);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full max-w-[1200px] mx-auto px-6 py-10 space-y-10">
      {/* Header */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-[#e5e7eb]">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ebebff] border border-[#d1d9e4] text-[#5e5cff] text-xs font-medium">
            <Landmark className="w-3.5 h-3.5 text-[#5e5cff]" />
            <span>Base Sepolia Smart Contract Execution Layer • Chain ID 84532</span>
          </div>
          <h1 className="font-display-serif text-[38px] md:text-[42px] leading-[1.05] tracking-[-0.025em] text-[#1d1d20]">
            Inheritance Vault & Onchain Settlement
          </h1>
          <p className="text-[15px] leading-[1.6] text-[#505050]">
            Real Solidity smart contract (<code className="bg-[#f1f1f1] px-1 py-0.5 rounded font-mono text-xs">InheritanceVault.sol</code>) enforcing milestone release schedules and executing payouts on Base.
          </p>
        </div>

        {/* Execution Mode Selector */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <div className="flex items-center bg-[#f7f7f7] p-1 rounded-full border border-[#e5e7eb]">
            <button
              onClick={() => setExecutionMode("simulation")}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
                executionMode === "simulation"
                  ? "bg-white text-[#1d1d20] shadow-xs border border-[#e5e7eb]"
                  : "text-[#505050] hover:text-[#1d1d20]"
              }`}
            >
              <Zap className="w-3.5 h-3.5 text-[#a565ff]" />
              <span>Fast Simulation Mode</span>
            </button>

            <button
              onClick={handleConnectWallet}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
                executionMode === "live_wallet"
                  ? "bg-white text-[#1d1d20] shadow-xs border border-[#e5e7eb]"
                  : "text-[#505050] hover:text-[#1d1d20]"
              }`}
            >
              <Wallet className="w-3.5 h-3.5 text-[#2e7317]" />
              <span>{walletAddress ? `${walletAddress.slice(0, 6)}... (${walletBalance} ETH)` : "Connect Live Web3 Wallet"}</span>
            </button>
          </div>

          <button
            onClick={handleResetVault}
            className="btn-secondary text-xs px-3.5 py-1.5 cursor-pointer flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5 text-[#757575]" />
            <span>Reset</span>
          </button>
        </div>
      </section>

      {/* Wallet Alerts / Success notices */}
      {walletError && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-xs p-3.5 rounded-lg flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-red-500 shrink-0" />
            <span>{walletError}</span>
          </div>
          <a
            href="https://www.coinbase.com/faucets/base-ethereum-sepolia-faucet"
            target="_blank"
            rel="noreferrer"
            className="text-[#5e5cff] underline font-semibold ml-3 whitespace-nowrap"
          >
            Get Free Base Sepolia ETH Faucet →
          </a>
        </div>
      )}

      {depositSuccess && (
        <div className="bg-[#fff6df] border border-[#ebd7a5] text-[#1d1d20] text-xs p-3.5 rounded-lg flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#2e7317]" />
            <span>{depositSuccess}</span>
          </div>
        </div>
      )}

      {/* Contract & Vault Parameters Bar */}
      <section className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white border border-[#e5e7eb] rounded-lg p-5">
          <span className="text-xs font-mono text-[#757575] uppercase block mb-1">Contract Address</span>
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs font-medium text-[#1d1d20]">
              {INHERITANCE_VAULT_ADDRESS.slice(0, 10)}...{INHERITANCE_VAULT_ADDRESS.slice(-6)}
            </span>
            <button
              onClick={copyAddress}
              className="text-[#757575] hover:text-[#1d1d20] p-1 rounded cursor-pointer"
              title="Copy address"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-[#2e7317]" /> : <Copy className="w-3.5 h-3.5 text-[#757575]" />}
            </button>
          </div>
        </div>

        <div className="bg-white border border-[#e5e7eb] rounded-lg p-5">
          <span className="text-xs font-mono text-[#757575] uppercase block mb-1">Network</span>
          <span className="text-sm font-semibold text-[#1d1d20] flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#0052FF]"></span>
            Base Sepolia (84532)
          </span>
        </div>

        <div className="bg-white border border-[#e5e7eb] rounded-lg p-5">
          <span className="text-xs font-mono text-[#757575] uppercase block mb-1">Total Vault Balance</span>
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-[#1d1d20]">
              ${plan.vaultBalanceUsd.toLocaleString()} ({plan.vaultBalanceEth} ETH)
            </span>
            {walletAddress && (
              <button
                onClick={handleDepositTestnet}
                disabled={isDepositing}
                className="text-[11px] text-[#5e5cff] font-medium hover:underline cursor-pointer disabled:opacity-50"
              >
                {isDepositing ? "Depositing..." : "+ Deposit 0.001 ETH"}
              </button>
            )}
          </div>
        </div>

        <div className="bg-white border border-[#e5e7eb] rounded-lg p-5">
          <span className="text-xs font-mono text-[#757575] uppercase block mb-1">Execution Mode</span>
          <span className="inline-flex items-center gap-1 font-mono text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#f7f7f7] border border-[#e5e7eb] text-[#1d1d20]">
            {executionMode === "live_wallet" ? "🟢 Live Web3 Wallet" : "⚡ Fast Simulation"}
          </span>
        </div>
      </section>

      {/* Authorized Breakdown Table */}
      <section className="bg-white border border-[#e5e7eb] rounded-xl overflow-hidden shadow-sm">
        <div className="p-6 border-b border-[#f1f1f1] flex items-center justify-between">
          <div>
            <h2 className="text-[18px] font-semibold text-[#1d1d20]">
              Authorized Distribution Schedule
            </h2>
            <p className="text-xs text-[#757575] mt-0.5">
              Computed from Sibyl Memory directives and approved by the estate owner.
            </p>
          </div>
          <span className="badge-ledger-success text-xs font-medium">
            <CheckCircle2 className="w-3 h-3" />
            Verified 100% Allocation
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#f7f7f7] border-b border-[#e5e7eb] text-[#505050] font-mono uppercase tracking-wider">
              <tr>
                <th className="py-3 px-6">Beneficiary</th>
                <th className="py-3 px-4">Wallet Address</th>
                <th className="py-3 px-4">Allocation</th>
                <th className="py-3 px-4">ETH / USD Amount</th>
                <th className="py-3 px-4">Payout Mechanism</th>
                <th className="py-3 px-6">Execution Schedule</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f1f1f1]">
              {plan.beneficiaries.map((b) => {
                const ethAmount = ((plan.vaultBalanceEth * b.allocationPercent) / 100).toFixed(2);
                const usdAmount = ((plan.vaultBalanceUsd * b.allocationPercent) / 100).toLocaleString();
                const isGradual = b.payoutType === "gradual_release";

                return (
                  <tr key={b.id} className="hover:bg-[#fafafa] transition-colors">
                    <td className="py-4 px-6 font-semibold text-[#1d1d20]">
                      <div>{b.name}</div>
                      <div className="text-[11px] font-normal text-[#757575]">{b.relationship}</div>
                    </td>
                    <td className="py-4 px-4 font-mono text-[#505050]">
                      {b.address.slice(0, 8)}...{b.address.slice(-6)}
                    </td>
                    <td className="py-4 px-4 font-mono font-bold text-[#1d1d20] text-sm">
                      {b.allocationPercent}%
                    </td>
                    <td className="py-4 px-4">
                      <div className="font-semibold text-[#1d1d20]">${usdAmount}</div>
                      <div className="font-mono text-[11px] text-[#757575]">{ethAmount} ETH</div>
                    </td>
                    <td className="py-4 px-4">
                      {isGradual ? (
                        <span className="badge-lavender-tag flex items-center gap-1 font-medium w-fit">
                          <GraduationCap className="w-3.5 h-3.5 text-[#5e5cff]" />
                          Gradual Release
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 rounded-full bg-[#f1f1f1] text-[#505050] font-medium text-[11px]">
                          Immediate Lump Sum
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-6 text-[#505050]">
                      {isGradual ? (
                        <span className="text-[#5e5cff] font-medium">
                          25% annually (4-year educational milestone schedule)
                        </span>
                      ) : (
                        <span>100% transfer upon event execution</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* Activation & Settlement Card */}
      <section className="bg-[#fff6df] border border-[#ebd7a5] rounded-xl p-6 relative overflow-hidden space-y-4">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-[#a565ff] shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h3 className="font-semibold text-sm text-[#1d1d20]">
              Activation Protocol & Settlement Trigger
            </h3>
            <p className="text-xs text-[#505050] leading-relaxed">
              In production, activation is authorized by designated executors or legal proof. For this demonstration, triggering activation stages the contract for disbursement on Base Sepolia.
            </p>
          </div>
        </div>

        {/* Action Buttons depending on status */}
        <div className="pt-3 border-t border-[#ebd7a5]/60 flex flex-wrap items-center gap-4">
          {plan.status === "authorized" && (
            <button
              onClick={handleSimulateActivation}
              disabled={isActivating}
              className="btn-primary-pulse cursor-pointer disabled:opacity-50"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>{isActivating ? "Activating Vault..." : "Activate Inheritance Distribution"}</span>
            </button>
          )}

          {plan.status === "activated" && (
            <button
              onClick={handleExecuteDistribution}
              disabled={isExecuting}
              className="btn-primary-pulse cursor-pointer disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4" />
              <span>
                {isExecuting 
                  ? "Broadcasting Transaction to Base Sepolia..." 
                  : executionMode === "live_wallet" 
                    ? "Sign & Execute on Base Sepolia (Live Wallet)" 
                    : "Execute Distribution on Base Sepolia"}
              </span>
            </button>
          )}

          {plan.status === "distributed" && (
            <div className="flex items-center gap-2 text-xs font-semibold text-[#2e7317] bg-white px-3.5 py-1.5 rounded-full border border-[#2e7317]/20">
              <CheckCircle2 className="w-4 h-4 text-[#2e7317]" />
              <span>Distribution Successfully Finalized on Base Sepolia!</span>
            </div>
          )}
        </div>
      </section>

      {/* Transaction Receipt Card */}
      {txResult && (
        <section className="bg-[#15110a] text-[#e8e0cf] border border-black/30 rounded-xl p-6 font-mono text-xs space-y-4 shadow-lg animate-in fade-in">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div className="flex items-center gap-2 text-[#36d8ca] font-bold">
              <CheckCircle2 className="w-4 h-4" />
              <span>
                {txResult.isRealWalletTx ? "LIVE BASE SEPOLIA WALLET TRANSACTION MINED" : "BASE SEPOLIA TRANSACTION VERIFIED"}
              </span>
            </div>
            <span className="text-white/60 text-[11px]">Block #{txResult.blockNumber}</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <span className="text-white/40 block text-[10px] uppercase">Transaction Hash</span>
              <span className="text-[#a565ff] font-semibold break-all">{txResult.txHash}</span>
            </div>

            <div>
              <span className="text-white/40 block text-[10px] uppercase">Gas Used</span>
              <span>{txResult.gasUsed} gas</span>
            </div>
          </div>

          <div className="pt-2 border-t border-white/10 flex justify-between items-center">
            <span className="text-white/50 text-[11px]">Chain: Base Sepolia (Chain ID: 84532)</span>
            <a
              href={txResult.explorerUrl}
              target="_blank"
              rel="noreferrer"
              className="btn-primary-pulse text-xs px-3.5 py-1.5 flex items-center gap-1"
            >
              <span>Inspect on BaseScan</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </section>
      )}
    </div>
  );
}
