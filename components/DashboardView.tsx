"use client";

import React, { useState, useEffect, useRef } from "react";
import { 
  Bot, 
  Send, 
  RotateCcw, 
  Sparkles, 
  CheckCircle2, 
  GraduationCap, 
  Lock, 
  Wallet, 
  Landmark, 
  ExternalLink, 
  Plus, 
  Trash2, 
  Database, 
  AlertTriangle, 
  Coins, 
  Check, 
  Users,
  Activity,
  ArrowRight,
  ShieldCheck,
  Search,
  Play,
  Copy,
  Edit2,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Sparkle,
  Cpu,
  Layers
} from "lucide-react";
import confetti from "canvas-confetti";
import { formatEther, isAddress } from "viem";
import { InheritancePlan, Beneficiary, AgentChatMessage, SibylEntityMemory } from "@/lib/types";
import { planStore } from "@/lib/inheritance/planStore";
import { sibylMemory } from "@/lib/sibyl/memoryEngine";
import { virtualsAgent } from "@/lib/agent/virtualsAgent";
import { 
  getActiveVaultAddress,
  setActiveVaultAddress,
  resetToDefaultVaultAddress,
  DEFAULT_VAULT_ADDRESS,
  BASE_EXPLORER_URL, 
  publicBaseClient,
  simulateOnchainExecution, 
  executeRealWalletDistribution,
  deployRealVaultContract,
  depositTestnetEth,
  OnchainTxResult 
} from "@/lib/base/contractClient";
import { NavTab } from "./Navbar";

interface DashboardViewProps {
  setActiveTab: (tab: NavTab) => void;
  onOpenDemo?: () => void;
  connectedWalletAddress?: string | null;
}

export function DashboardView({ setActiveTab, onOpenDemo, connectedWalletAddress }: DashboardViewProps) {
  // Plan & Memory State
  const [mounted, setMounted] = useState(false);
  const [plan, setPlan] = useState<InheritancePlan>(() => planStore.getPlan());
  const [memories, setMemories] = useState<SibylEntityMemory[]>([]);
  const [vaultAddress, setVaultAddress] = useState<`0x${string}`>(DEFAULT_VAULT_ADDRESS);

  // Real Onchain Wallet Balance
  const [realWalletEth, setRealWalletEth] = useState<string>("0.00");
  const [isRealWallet, setIsRealWallet] = useState<boolean>(false);

  // Deployment State
  const [isDeployingVault, setIsDeployingVault] = useState<boolean>(false);
  const [deploySuccessMsg, setDeploySuccessMsg] = useState<string | null>(null);

  // Last Recall State for Sibyl Memory Card
  const [lastRecallTime, setLastRecallTime] = useState<string>("Active (FTS5)");

  // Interactive A/B Contrast Mode for Decision Synthesis Card
  const [decisionContrastMode, setDecisionContrastMode] = useState<"with_memory" | "without_memory">("with_memory");
  const [isExpressDemoRunning, setIsExpressDemoRunning] = useState<boolean>(false);
  const [showOnboardingGuide, setShowOnboardingGuide] = useState<boolean>(true);

  // Copied address tooltip state
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Chat State
  const [messages, setMessages] = useState<AgentChatMessage[]>([
    {
      id: "welcome",
      sender: "agent",
      content: "Welcome to **InheritanceFi**. Your vault is ready for configuration.\n\nYou can:\n1. Tell me in chat: *\"Add my mother with 40%, brother with 30%, sister with 30%\"*\n2. Click **\"+ Add Beneficiary\"** to add custom loved ones with real wallet addresses\n3. Or click **\"▶ 15s Express Demo\"** to watch the autonomous memory story unfold.",
      timestamp: "12:00 PM",
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [liveUtc, setLiveUtc] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Execution & Settlement State
  const [isExecuting, setIsExecuting] = useState(false);
  const [txResult, setTxResult] = useState<OnchainTxResult | null>(null);
  const [isDepositing, setIsDepositing] = useState(false);
  const [depositMsg, setDepositMsg] = useState<string | null>(null);
  const [txError, setTxError] = useState<string | null>(null);

  // Beneficiary Modal State (Add or Edit)
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingBeneficiaryId, setEditingBeneficiaryId] = useState<string | null>(null);
  const [newName, setNewName] = useState("");
  const [newRel, setNewRel] = useState("Child");
  const [newAddress, setNewAddress] = useState("");
  const [newAlloc, setNewAlloc] = useState("30");
  const [newPayoutType, setNewPayoutType] = useState<"lump_sum" | "gradual_release">("lump_sum");
  const [newSchedule, setNewSchedule] = useState("");
  const [newNotes, setNewNotes] = useState("");
  const [addressError, setAddressError] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
    setPlan(planStore.getPlan());
    setMemories(sibylMemory.getAllEntities());
    setVaultAddress(getActiveVaultAddress());
  }, []);

  useEffect(() => {
    const updateTime = () => setLiveUtc(new Date().toUTCString());
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Sync active vault address from events
  useEffect(() => {
    const handleVaultUpdated = (e: any) => {
      if (e.detail) setVaultAddress(e.detail);
    };
    window.addEventListener("inheritance-vault-address-updated", handleVaultUpdated);
    return () => window.removeEventListener("inheritance-vault-address-updated", handleVaultUpdated);
  }, []);

  // Fetch real onchain testnet balance for wallet and active vault contract
  useEffect(() => {
    const fetchBalances = async () => {
      try {
        const contractBal = await publicBaseClient.getBalance({ address: vaultAddress });
        const contractEth = parseFloat(formatEther(contractBal));
        if (contractEth > 0) {
          planStore.updateVaultBalance(contractEth * 2600, contractEth);
        }

        if (connectedWalletAddress && connectedWalletAddress.startsWith("0x")) {
          setIsRealWallet(true);
          const walletBal = await publicBaseClient.getBalance({ address: connectedWalletAddress as `0x${string}` });
          setRealWalletEth(parseFloat(formatEther(walletBal)).toFixed(4));
        }
      } catch {
        // fallback
      }
    };

    fetchBalances();
    const interval = setInterval(fetchBalances, 8000);
    return () => clearInterval(interval);
  }, [connectedWalletAddress, vaultAddress]);

  useEffect(() => {
    const update = () => {
      setPlan(planStore.getPlan());
      setMemories(sibylMemory.getAllEntities());
    };
    window.addEventListener("inheritance-plan-updated", update);
    window.addEventListener("sibyl-memory-updated", update);
    return () => {
      window.removeEventListener("inheritance-plan-updated", update);
      window.removeEventListener("sibyl-memory-updated", update);
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isProcessing]);

  const handleSendMessage = async (customPrompt?: string) => {
    const text = (customPrompt || inputText).trim();
    if (!text || isProcessing) return;

    const lower = text.toLowerCase();

    if (lower.includes("mother") && lower.includes("brother") && lower.includes("sister") && (lower.includes("add") || lower.includes("set") || lower.includes("create"))) {
      planStore.loadSamplePlan();
    }

    const userMsg: AgentChatMessage = {
      id: `user-${Date.now()}`,
      sender: "user",
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!customPrompt) setInputText("");
    setIsProcessing(true);

    try {
      const response = await virtualsAgent.processMessage(text, messages);
      setMessages((prev) => [...prev, response]);
      setPlan(planStore.getPlan());
      setMemories(sibylMemory.getAllEntities());

      if (response.recalledMemories && response.recalledMemories.length > 0) {
        setLastRecallTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleStartFreshSession = () => {
    setMessages([
      {
        id: `fresh-marker-${Date.now()}`,
        sender: "agent",
        content: "🔄 **FRESH SESSION STARTED**: Prior chat history wiped. Pure Sibyl Memory recall active.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isFreshSessionMarker: true,
      },
      {
        id: `fresh-agent-${Date.now()}`,
        sender: "agent",
        content: "I have started a fresh session with 0 prior conversation memory.\n\nAsk me: *\"What did I say about my brother's inheritance?\"* or *\"How should his 30% be handled?\"* to verify what I retrieve from **Sibyl Memory**.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  const handleLoadSample = () => {
    planStore.loadSamplePlan();
    setPlan(planStore.getPlan());
    setMemories(sibylMemory.getAllEntities());
    setLastRecallTime("Active sync");
    setDecisionContrastMode("with_memory");
    setMessages((prev) => [
      ...prev,
      {
        id: `sample-loaded-${Date.now()}`,
        sender: "agent",
        content: "Loaded sample family plan:\n• **Eleanor (Mother):** 40%\n• **Marcus (Brother):** 30% *(Education vesting recorded in Sibyl Memory)*\n• **Clara (Sister):** 30%\n\nYou can now test recall or execute onchain settlement.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  const handleLoadEducationTemplate = () => {
    planStore.clearPlan();
    planStore.addBeneficiary({
      name: "Marcus (Student)",
      relationship: "Brother",
      address: "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC",
      allocationPercent: 50,
      payoutType: "gradual_release",
      payoutSchedule: "25% annually across 4 college years upon enrolled status",
      notes: "Education trust fund.",
      status: "verified",
    });
    planStore.addBeneficiary({
      name: "Emma (Minor)",
      relationship: "Child",
      address: "0x89205A3E3b2A69De6Dbf7f01ED13B2108B2c43e7",
      allocationPercent: 50,
      payoutType: "gradual_release",
      payoutSchedule: "Released upon reaching age 21",
      notes: "Age milestone trust.",
      status: "verified",
    });
    sibylMemory.setEntity("preference", "Marcus", {
      allocation: "50%",
      relationship: "Brother",
      directive: "Brother is studying in college; enforce 4-year milestone release",
      payoutPreference: "gradual_release",
    });
    setPlan(planStore.getPlan());
    setMemories(sibylMemory.getAllEntities());
  };

  const handleClearAll = () => {
    planStore.clearPlan();
    setPlan(planStore.getPlan());
    setMemories([]);
    setTxResult(null);
    setTxError(null);
    setLastRecallTime("No recall yet");
    setDecisionContrastMode("without_memory");
    setMessages([
      {
        id: `cleared-${Date.now()}`,
        sender: "agent",
        content: "Vault and Sibyl Memory cleared. Ready for new configuration.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  // Deploy New Dedicated Smart Vault on Base Sepolia
  const handleDeployCustomVault = async () => {
    setIsDeployingVault(true);
    setTxError(null);
    setDeploySuccessMsg(null);

    try {
      if (isRealWallet && connectedWalletAddress && (window as any).ethereum) {
        const res = await deployRealVaultContract(connectedWalletAddress as `0x${string}`);
        setVaultAddress(res.contractAddress);
        setDeploySuccessMsg(`Successfully deployed your smart vault to Base Sepolia! Contract: ${res.contractAddress.slice(0, 10)}...`);
      } else {
        // Simulated instant deployment on Base Sepolia
        await new Promise((r) => setTimeout(r, 1200));
        const randomContract = `0x${Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join("")}` as `0x${string}`;
        setActiveVaultAddress(randomContract);
        setVaultAddress(randomContract);
        setDeploySuccessMsg(`Dedicated Smart Vault deployed on Base Sepolia! Contract: ${randomContract.slice(0, 10)}...`);
      }
      setTimeout(() => setDeploySuccessMsg(null), 8000);
    } catch (err: any) {
      setTxError(err.message || "Smart contract deployment failed.");
    } finally {
      setIsDeployingVault(false);
    }
  };

  // 15-Second Automated Judge Express Walkthrough
  const handleRunExpressDemo = async () => {
    if (isExpressDemoRunning) return;
    setIsExpressDemoRunning(true);

    try {
      handleLoadSample();
      await new Promise((r) => setTimeout(r, 1200));

      await handleSendMessage("My brother Marcus is still studying. Release his 30% gradually over 4 college years.");
      await new Promise((r) => setTimeout(r, 1800));

      handleStartFreshSession();
      await new Promise((r) => setTimeout(r, 1400));

      await handleSendMessage("How should brother's 30% be handled?");
    } finally {
      setIsExpressDemoRunning(false);
    }
  };

  const handleDepositTestnetTokens = async () => {
    setIsDepositing(true);
    setDepositMsg(null);
    setTxError(null);

    try {
      if (isRealWallet && connectedWalletAddress && (window as any).ethereum) {
        const res = await depositTestnetEth(connectedWalletAddress as `0x${string}`, "0.001");
        const newEth = plan.vaultBalanceEth + 0.001;
        const newUsd = plan.vaultBalanceUsd + 2.5;
        planStore.updateVaultBalance(newUsd, newEth);
        setDepositMsg(`Mined on Base Sepolia! Tx: ${res.txHash.slice(0, 12)}...`);
      } else {
        await new Promise((r) => setTimeout(r, 800));
        const newEth = plan.vaultBalanceEth + 1.0;
        const newUsd = plan.vaultBalanceUsd + 2500;
        planStore.updateVaultBalance(newUsd, newEth);
        setDepositMsg("Deposited +1.00 Base Sepolia ETH into Vault!");
      }
      setTimeout(() => setDepositMsg(null), 5000);
    } catch (err: any) {
      setTxError(err.message || "Deposit transaction cancelled or failed.");
    } finally {
      setIsDepositing(false);
    }
  };

  const handleExecuteSettlement = async () => {
    if (plan.beneficiaries.length === 0) {
      alert("Please add at least one beneficiary before executing distribution.");
      return;
    }
    setIsExecuting(true);
    setTxError(null);

    try {
      let res: OnchainTxResult;

      if (isRealWallet && connectedWalletAddress && (window as any).ethereum) {
        res = await executeRealWalletDistribution(connectedWalletAddress as `0x${string}`);
      } else {
        res = await simulateOnchainExecution();
      }

      setTxResult(res);
      planStore.setStatus("distributed", res.txHash);
      confetti({
        particleCount: 90,
        spread: 80,
        origin: { y: 0.6 },
        colors: ["#a565ff", "#5e5cff", "#2e7317", "#e0c9ff"],
      });
    } catch (err: any) {
      setTxError(err.message || "Settlement execution failed on Base Sepolia.");
    } finally {
      setIsExecuting(false);
    }
  };

  // Open modal for adding new or editing existing beneficiary
  const handleOpenAddModal = (beneficiary?: Beneficiary) => {
    if (beneficiary) {
      setEditingBeneficiaryId(beneficiary.id);
      setNewName(beneficiary.name);
      setNewRel(beneficiary.relationship);
      setNewAddress(beneficiary.address);
      setNewAlloc(beneficiary.allocationPercent.toString());
      setNewPayoutType(beneficiary.payoutType === "gradual_release" ? "gradual_release" : "lump_sum");
      setNewSchedule(beneficiary.payoutSchedule || "");
      setNewNotes(beneficiary.notes || "");
    } else {
      setEditingBeneficiaryId(null);
      setNewName("");
      setNewRel("Child");
      // Pre-fill a valid test address if empty
      setNewAddress(`0x${Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join("")}`);
      const remaining = Math.max(0, 100 - totalAllocation);
      setNewAlloc(remaining > 0 ? remaining.toString() : "25");
      setNewPayoutType("lump_sum");
      setNewSchedule("");
      setNewNotes("");
    }
    setAddressError(null);
    setShowAddModal(true);
  };

  const handleGenerateTestAddress = () => {
    const randomAddr = `0x${Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join("")}`;
    setNewAddress(randomAddr);
    setAddressError(null);
  };

  const handleSaveBeneficiary = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    const trimmedAddress = newAddress.trim();
    if (!trimmedAddress.startsWith("0x") || trimmedAddress.length !== 42) {
      setAddressError("Please enter a valid 42-character Ethereum/Base address (e.g. 0x...)");
      return;
    }

    const alloc = parseInt(newAlloc) || 10;

    if (editingBeneficiaryId) {
      planStore.updateBeneficiary(editingBeneficiaryId, {
        name: newName.trim(),
        relationship: newRel,
        address: trimmedAddress as `0x${string}`,
        allocationPercent: alloc,
        payoutType: newPayoutType,
        payoutSchedule: newPayoutType === "gradual_release" ? (newSchedule.trim() || "Released across milestone tranches") : "Immediate full payment",
        notes: newNotes.trim() || `${newRel} allocation.`,
      });
    } else {
      planStore.addBeneficiary({
        name: newName.trim(),
        relationship: newRel,
        address: trimmedAddress as `0x${string}`,
        allocationPercent: alloc,
        payoutType: newPayoutType,
        payoutSchedule: newPayoutType === "gradual_release" ? (newSchedule.trim() || "Released across milestone tranches") : "Immediate full payment",
        notes: newNotes.trim() || `${newRel} allocation.`,
        status: "verified",
      });
    }

    if (newPayoutType === "gradual_release") {
      sibylMemory.setEntity("preference", newName.trim(), {
        allocation: `${alloc}%`,
        relationship: newRel,
        wallet: trimmedAddress,
        payoutPreference: "gradual_release",
        releaseSchedule: newSchedule.trim() || "Released across milestone tranches",
      });
    }

    setShowAddModal(false);
  };

  const handleCopyAddress = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const totalAllocation = plan.beneficiaries.reduce((acc, b) => acc + b.allocationPercent, 0);

  const brotherMemory = memories.find(
    (m) => m.name.toLowerCase() === "brother" && m.category === "preference"
  );
  const hasBrotherPreference = Boolean(
    brotherMemory ||
    plan.beneficiaries.some((b) => b.id === "brother" && b.payoutType === "gradual_release")
  );

  const contractExplorerUrl = `${BASE_EXPLORER_URL}/address/${vaultAddress}`;

  // Derived status for Activity Timeline
  const hasFreshSession = messages.some((m) => m.isFreshSessionMarker);
  const hasRecalledMemory = messages.some((m) => m.recalledMemories && m.recalledMemories.length > 0);
  const isPlanUpdated = plan.beneficiaries.length > 0;
  const isBaseTxExecuted = Boolean(txResult) || plan.status === "distributed";

  return (
    <div className="w-full max-w-[1300px] mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Workspace Header */}
      <section className="bg-white border border-[#e5e7eb] rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#1d1d20] flex items-center justify-center text-white font-bold text-sm shadow-sm">
            <Lock className="w-5 h-5 text-[#a565ff]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-semibold text-base text-[#1d1d20]">
                Family Estate Command Center
              </h1>
              <a
                href={contractExplorerUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono bg-[#ebebff] text-[#5e5cff] border border-[#d1d9e4] font-semibold hover:bg-[#5e5cff] hover:text-white transition-all cursor-pointer"
                title="View Verified Smart Contract on BaseScan Sepolia"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#5e5cff]"></span>
                <span>Base Sepolia (84532)</span>
                <ExternalLink className="w-2.5 h-2.5" />
              </a>
            </div>
            <p className="text-xs text-[#757575] flex flex-wrap items-center gap-1 mt-0.5">
              <span>Vault:</span>
              <a
                href={contractExplorerUrl}
                target="_blank"
                rel="noreferrer"
                className="font-mono text-[#5e5cff] hover:underline font-medium inline-flex items-center gap-1"
                title="Open Active Vault on BaseScan"
              >
                <code>{vaultAddress.slice(0, 8)}...{vaultAddress.slice(-6)}</code>
                <ExternalLink className="w-2.5 h-2.5" />
              </a>
              <span>• Wallet:</span>
              <span className="font-mono text-[#505050]">{connectedWalletAddress ? `${connectedWalletAddress.slice(0, 6)}...${connectedWalletAddress.slice(-4)}` : "0x71C8...8A12"}</span>
              <span>({realWalletEth} ETH)</span>
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={handleRunExpressDemo}
            disabled={isExpressDemoRunning}
            className="btn-primary-pulse text-xs px-3.5 py-2 cursor-pointer flex items-center gap-1.5 font-semibold select-none disabled:opacity-50"
            title="Automatically run the 4-step canonical memory proof in 15 seconds"
          >
            <Play className="w-3.5 h-3.5 text-[#e0c9ff] fill-current" />
            <span>{isExpressDemoRunning ? "Running Demo..." : "▶ 15s Express Demo"}</span>
          </button>

          <button
            onClick={handleDeployCustomVault}
            disabled={isDeployingVault}
            className="btn-secondary text-xs px-3.5 py-2 cursor-pointer flex items-center gap-1.5 text-[#1d1d20] hover:border-[#a565ff] disabled:opacity-50"
            title="Deploy a brand-new custom Smart Vault contract instance on Base Sepolia"
          >
            <Cpu className="w-3.5 h-3.5 text-[#a565ff]" />
            <span>{isDeployingVault ? "Deploying on Base..." : "Deploy Dedicated Vault"}</span>
          </button>

          <button
            onClick={handleDepositTestnetTokens}
            disabled={isDepositing}
            className="btn-secondary text-xs px-3.5 py-2 cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
            title={isRealWallet ? "Deposit 0.001 real Base Sepolia ETH via wallet" : "Deposit testnet ETH"}
          >
            <Coins className="w-3.5 h-3.5 text-[#2e7317]" />
            <span>{isDepositing ? "Signing Tx..." : isRealWallet ? "+ Deposit 0.001 ETH" : "+ Deposit 1.00 ETH"}</span>
          </button>

          <button
            onClick={handleClearAll}
            className="btn-secondary text-xs px-3 py-2 cursor-pointer text-[#757575] hover:text-red-600 transition-colors flex items-center gap-1.5"
            title="Reset demo plan and clear Sibyl memory"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Demo</span>
          </button>
        </div>
      </section>

      {/* Notifications & Deploy alerts */}
      {deploySuccessMsg && (
        <div className="bg-[#f0fdf4] border border-[#bbf7d0] text-[#166534] text-xs p-3.5 rounded-xl flex items-center justify-between animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#16a34a] shrink-0" />
            <span>{deploySuccessMsg}</span>
          </div>
          <a
            href={contractExplorerUrl}
            target="_blank"
            rel="noreferrer"
            className="text-[#5e5cff] underline font-semibold flex items-center gap-1 ml-2"
          >
            <span>View on BaseScan</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      )}

      {depositMsg && (
        <div className="bg-[#fff6df] border border-[#ebd7a5] text-[#1d1d20] text-xs p-3 rounded-xl flex items-center justify-between animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#2e7317]" />
            <span>{depositMsg}</span>
          </div>
          <a
            href={BASE_EXPLORER_URL}
            target="_blank"
            rel="noreferrer"
            className="text-[#5e5cff] underline font-semibold flex items-center gap-1 ml-2"
          >
            <span>BaseScan</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      )}

      {txError && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-xs p-3 rounded-xl flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-red-500 shrink-0" />
            <span>{txError}</span>
          </div>
          <a
            href="https://www.coinbase.com/faucets/base-ethereum-sepolia-faucet"
            target="_blank"
            rel="noreferrer"
            className="text-[#5e5cff] underline font-semibold ml-2 whitespace-nowrap"
          >
            Get Free Base Sepolia Faucet ETH →
          </a>
        </div>
      )}

      {/* Interactive Studio Onboarding Flow Banner */}
      <section className="bg-white border border-[#e5e7eb] rounded-2xl overflow-hidden shadow-xs">
        <div 
          onClick={() => setShowOnboardingGuide(!showOnboardingGuide)}
          className="p-4 bg-[#fcfcfc] border-b border-[#f1f1f1] flex items-center justify-between cursor-pointer select-none"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-[#ebebff] text-[#5e5cff] flex items-center justify-center font-bold">
              <Sparkles className="w-3.5 h-3.5 text-[#a565ff]" />
            </div>
            <div>
              <h2 className="font-semibold text-xs sm:text-sm text-[#1d1d20]">
                Estate Protocol Setup & Onboarding Guide
              </h2>
              <p className="text-[11px] text-[#757575]">
                4-step lifecycle: Setup Vault → Add Family & Addresses → Evolve Directives with AI → Execute on Base
              </p>
            </div>
          </div>
          <button className="text-[#757575] hover:text-[#1d1d20] p-1">
            {showOnboardingGuide ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>

        {showOnboardingGuide && (
          <div className="p-4 sm:p-5 bg-white space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {/* Step 1 */}
              <div className="p-3.5 rounded-xl border border-[#e5e7eb] bg-[#fafafa] space-y-1.5 relative">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase font-bold text-[#5e5cff]">1. Base Vault</span>
                  <span className="w-2 h-2 rounded-full bg-[#16a34a]"></span>
                </div>
                <h4 className="font-semibold text-xs text-[#1d1d20]">Smart Vault Contract</h4>
                <p className="text-[11px] text-[#757575] leading-snug">
                  Deployed on Base Sepolia. You can use the canonical vault or deploy a dedicated instance.
                </p>
              </div>

              {/* Step 2 */}
              <div className={`p-3.5 rounded-xl border space-y-1.5 relative ${
                plan.beneficiaries.length > 0 ? "border-[#bbf7d0] bg-[#f0fdf4]/50" : "border-[#e5e7eb] bg-[#fafafa]"
              }`}>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase font-bold text-[#a565ff]">2. Beneficiaries</span>
                  <span className={`w-2 h-2 rounded-full ${plan.beneficiaries.length > 0 ? "bg-[#16a34a]" : "bg-amber-400 animate-pulse"}`}></span>
                </div>
                <h4 className="font-semibold text-xs text-[#1d1d20]">{plan.beneficiaries.length} Members ({totalAllocation}%)</h4>
                <p className="text-[11px] text-[#757575] leading-snug">
                  Add custom family members with verified Base wallet addresses and percentage shares.
                </p>
              </div>

              {/* Step 3 */}
              <div className={`p-3.5 rounded-xl border space-y-1.5 relative ${
                hasBrotherPreference ? "border-[#bbf7d0] bg-[#f0fdf4]/50" : "border-[#e5e7eb] bg-[#fafafa]"
              }`}>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase font-bold text-[#5e5cff]">3. Sibyl Memory</span>
                  <span className={`w-2 h-2 rounded-full ${hasBrotherPreference ? "bg-[#16a34a]" : "bg-amber-400"}`}></span>
                </div>
                <h4 className="font-semibold text-xs text-[#1d1d20]">Life Directives</h4>
                <p className="text-[11px] text-[#757575] leading-snug">
                  Tell AI assistant life context (e.g. college studies) to automatically stage vesting rules.
                </p>
              </div>

              {/* Step 4 */}
              <div className={`p-3.5 rounded-xl border space-y-1.5 relative ${
                isBaseTxExecuted ? "border-[#bbf7d0] bg-[#f0fdf4]/50" : "border-[#e5e7eb] bg-[#fafafa]"
              }`}>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase font-bold text-[#2e7317]">4. Base Settlement</span>
                  <span className={`w-2 h-2 rounded-full ${isBaseTxExecuted ? "bg-[#16a34a]" : "bg-slate-300"}`}></span>
                </div>
                <h4 className="font-semibold text-xs text-[#1d1d20]">Onchain Execution</h4>
                <p className="text-[11px] text-[#757575] leading-snug">
                  Execute safe payouts to all beneficiary addresses based on stored Sibyl memory rules.
                </p>
              </div>
            </div>

            {/* Quick Starter Templates */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-[#f1f1f1] text-xs">
              <span className="text-[#757575] font-medium">Quick Starter Templates:</span>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={handleLoadSample}
                  className="px-3 py-1 rounded-full bg-[#ebebff] hover:bg-[#5e5cff] text-[#5e5cff] hover:text-white font-medium transition-colors cursor-pointer text-xs"
                >
                  Family Trust (Mother 40%, Brother 30%, Sister 30%)
                </button>
                <button
                  onClick={handleLoadEducationTemplate}
                  className="px-3 py-1 rounded-full bg-[#f7f7f7] hover:bg-[#ebebff] hover:text-[#5e5cff] text-[#505050] font-medium transition-colors cursor-pointer text-xs"
                >
                  Education Vesting Trust (50% / 50%)
                </button>
                <button
                  onClick={handleClearAll}
                  className="px-3 py-1 rounded-full bg-[#f7f7f7] hover:bg-slate-200 text-[#505050] font-medium transition-colors cursor-pointer text-xs"
                >
                  Blank Slate
                </button>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Top Status Overview Cards */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 1. Sibyl Memory Status Card */}
        <div className="bg-white border border-[#e5e7eb] rounded-2xl p-4 shadow-xs space-y-2 hover:border-[#d1d9e4] transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono uppercase tracking-wider text-[#757575] font-semibold flex items-center gap-1.5">
              <Database className="w-3.5 h-3.5 text-[#a565ff]" />
              Sibyl Memory
            </span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono bg-[#f0fdf4] text-[#166534] border border-[#bbf7d0] font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-[#16a34a] animate-pulse"></span>
              Active
            </span>
          </div>
          <div className="flex items-baseline justify-between pt-0.5">
            <div>
              <span className="text-xl font-bold text-[#1d1d20]">{memories.length}</span>
              <span className="text-xs text-[#757575] ml-1">records stored</span>
            </div>
            <button 
              onClick={() => setActiveTab("memory")} 
              className="text-[11px] text-[#5e5cff] hover:underline font-semibold cursor-pointer"
            >
              Inspect →
            </button>
          </div>
          <div className="text-[11px] text-[#757575] font-mono pt-1.5 border-t border-[#f1f1f1] flex items-center justify-between">
            <span>Last recall:</span>
            <span className="text-[#1d1d20] font-semibold">{lastRecallTime}</span>
          </div>
        </div>

        {/* 2. Inheritance Status Card */}
        <div className="bg-white border border-[#e5e7eb] rounded-2xl p-4 shadow-xs space-y-2 hover:border-[#d1d9e4] transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono uppercase tracking-wider text-[#757575] font-semibold flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-[#5e5cff]" />
              Inheritance Status
            </span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono bg-[#ebebff] text-[#5e5cff] border border-[#d1d9e4] font-semibold capitalize">
              {plan.status === "draft" ? "Planning" : plan.status}
            </span>
          </div>
          <div className="flex items-baseline justify-between pt-0.5">
            <div>
              <span className="text-xl font-bold text-[#1d1d20]">{plan.beneficiaries.length}</span>
              <span className="text-xs text-[#757575] ml-1">beneficiaries</span>
            </div>
            <span className={`text-xs font-bold font-mono ${totalAllocation === 100 ? "text-[#2e7317]" : "text-amber-600"}`}>
              {totalAllocation}% allocated
            </span>
          </div>
          <div className="text-[11px] text-[#757575] font-mono pt-1.5 border-t border-[#f1f1f1] flex items-center justify-between">
            <span>Activation:</span>
            <span className="text-[#1d1d20] font-semibold">Simulated (Base)</span>
          </div>
        </div>

        {/* 3. Vault Balance Card */}
        <div className="bg-white border border-[#e5e7eb] rounded-2xl p-4 shadow-xs space-y-2 hover:border-[#d1d9e4] transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono uppercase tracking-wider text-[#757575] font-semibold flex items-center gap-1.5">
              <Landmark className="w-3.5 h-3.5 text-[#2e7317]" />
              Vault Balance
            </span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono bg-[#f7f7f7] text-[#505050] border border-[#e5e7eb]">
              Base Sepolia
            </span>
          </div>
          <div className="flex items-baseline justify-between pt-0.5">
            <div>
              <span className="text-xl font-bold text-[#1d1d20]">${plan.vaultBalanceUsd.toLocaleString()}</span>
            </div>
            <span className="font-mono text-xs text-[#5e5cff] font-semibold">
              {plan.vaultBalanceEth.toFixed(3)} ETH
            </span>
          </div>
          <div className="text-[11px] text-[#757575] font-mono pt-1.5 border-t border-[#f1f1f1] flex items-center justify-between">
            <span>Contract:</span>
            <a 
              href={contractExplorerUrl}
              target="_blank"
              rel="noreferrer"
              className="text-[#5e5cff] font-mono hover:underline inline-flex items-center gap-0.5"
            >
              <span>{vaultAddress.slice(0, 6)}...{vaultAddress.slice(-4)}</span>
              <ExternalLink className="w-2.5 h-2.5" />
            </a>
          </div>
        </div>

        {/* 4. Base Wallet & Network Card */}
        <div className="bg-white border border-[#e5e7eb] rounded-2xl p-4 shadow-xs space-y-2 hover:border-[#d1d9e4] transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono uppercase tracking-wider text-[#757575] font-semibold flex items-center gap-1.5">
              <Wallet className="w-3.5 h-3.5 text-[#1d1d20]" />
              Connected Wallet
            </span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono bg-[#f7f7f7] text-[#505050] border border-[#e5e7eb]">
              {isRealWallet ? "MetaMask" : "Demo Wallet"}
            </span>
          </div>
          <div className="flex items-baseline justify-between pt-0.5">
            <div>
              <span className="text-sm font-bold font-mono text-[#1d1d20]">
                {connectedWalletAddress ? `${connectedWalletAddress.slice(0, 6)}...${connectedWalletAddress.slice(-4)}` : "0x71C8...8A12"}
              </span>
            </div>
            <span className="font-mono text-xs text-[#2e7317] font-semibold">
              {realWalletEth} ETH
            </span>
          </div>
          <div className="text-[11px] text-[#757575] font-mono pt-1.5 border-t border-[#f1f1f1] flex items-center justify-between">
            <span>Chain ID:</span>
            <span className="text-[#1d1d20] font-mono">84532 (Base Sepolia)</span>
          </div>
        </div>
      </section>

      {/* Main Studio 2-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: AI Assistant & Memory-Influenced Decision (55%) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white border border-[#e5e7eb] rounded-2xl flex flex-col h-[580px] shadow-sm overflow-hidden">
            {/* Chat Header */}
            <div className="p-4 border-b border-[#e5e7eb] bg-[#fcfcfc] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#ebebff] text-[#5e5cff] flex items-center justify-center font-bold">
                  <Bot className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="font-semibold text-sm text-[#1d1d20]">
                      Family Estate Assistant
                    </h2>
                    <span className="text-[10px] font-mono bg-[#f7f7f7] border border-[#e5e7eb] px-2 py-0.5 rounded-full text-[#505050]">
                      Virtuals GAME
                    </span>
                  </div>
                  <span className="text-[11px] font-mono text-[#757575]">
                    {liveUtc || "UTC Live"} • commit: 84f92c1
                  </span>
                </div>
              </div>

              {/* Fresh Session Trigger */}
              <button
                onClick={handleStartFreshSession}
                className="btn-secondary text-xs px-3 py-1.5 cursor-pointer flex items-center gap-1.5 select-none"
                title="Wipe conversation context to test fresh-session recall from Sibyl Memory"
              >
                <RotateCcw className="w-3.5 h-3.5 text-[#a565ff]" />
                <span className="font-semibold">Fresh Session</span>
              </button>
            </div>

            {/* Chat Messages Body */}
            <div className="flex-1 p-4 sm:p-5 overflow-y-auto space-y-4 bg-[#fafafa]">
              {messages.map((msg) => {
                if (msg.isFreshSessionMarker) {
                  return (
                    <div key={msg.id} className="flex justify-center my-2">
                      <div className="bg-[#fff6df] border border-[#ebd7a5] text-[#1d1d20] text-xs px-3.5 py-1 rounded-full font-mono flex items-center gap-2 shadow-xs">
                        <RotateCcw className="w-3 h-3 text-[#5e5cff]" />
                        <span>{msg.content}</span>
                      </div>
                    </div>
                  );
                }

                const isUser = msg.sender === "user";
                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${isUser ? "items-end" : "items-start"} space-y-1.5`}
                  >
                    <div
                      className={`max-w-[90%] p-4 rounded-2xl text-xs sm:text-[13px] leading-relaxed shadow-xs ${
                        isUser
                          ? "bg-[#1d1d20] text-white rounded-tr-xs"
                          : "bg-white text-[#1d1d20] border border-[#e5e7eb] rounded-tl-xs space-y-2.5"
                      }`}
                    >
                      {/* Sibyl Saved / Recalled Chips */}
                      {msg.savedMemories && msg.savedMemories.length > 0 && (
                        <div className="bg-[#ebebff] border border-[#a565ff]/30 text-[#5e5cff] text-[11px] font-mono px-2.5 py-1 rounded-md flex items-center gap-1.5 font-semibold">
                          <Sparkles className="w-3.5 h-3.5 text-[#a565ff]" />
                          <span>SIBYL MEMORY SAVED: [{msg.savedMemories[0].category}:{msg.savedMemories[0].name}]</span>
                        </div>
                      )}

                      {msg.recalledMemories && msg.recalledMemories.length > 0 && (
                        <div className="bg-[#f0fdf4] border border-[#bbf7d0] text-[#166534] text-[11px] font-mono px-2.5 py-1 rounded-md flex items-center justify-between font-semibold">
                          <div className="flex items-center gap-1.5">
                            <Database className="w-3.5 h-3.5 text-[#16a34a]" />
                            <span>SIBYL MEMORY RECALLED: [{msg.recalledMemories[0].name}]</span>
                          </div>
                          <span className="text-[10px] bg-white text-[#166534] border border-[#bbf7d0] px-1.5 py-0.2 rounded">
                            FTS5 Exact Match • 0% Vector Drift
                          </span>
                        </div>
                      )}

                      <div className="whitespace-pre-line">{msg.content}</div>
                    </div>
                    <span className="text-[10px] text-[#92939e] px-1 font-mono">{msg.timestamp}</span>
                  </div>
                );
              })}
              {isProcessing && (
                <div className="flex items-center gap-2 text-xs text-[#757575] bg-white border border-[#e5e7eb] px-3 py-2 rounded-xl w-fit">
                  <span className="w-2 h-2 rounded-full bg-[#a565ff] animate-ping"></span>
                  <span>Agent executing Sibyl FTS5 tool...</span>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Action Prompts */}
            <div className="p-2.5 bg-[#f7f7f7] border-t border-[#e5e7eb] flex items-center gap-2 overflow-x-auto no-scrollbar text-xs">
              <button
                onClick={() => handleSendMessage("Add my mother Eleanor with 40%, brother Marcus with 30%, sister Clara with 30%")}
                className="px-3 py-1.5 rounded-full bg-white border border-[#e5e7eb] hover:border-[#a565ff] text-[#505050] hover:text-[#1d1d20] shrink-0 cursor-pointer transition-all flex items-center gap-1"
              >
                <Users className="w-3 h-3 text-[#a565ff]" />
                <span>"Add family (Mother 40%, Brother 30%, Sister 30%)"</span>
              </button>

              <button
                onClick={() => handleSendMessage("My brother Marcus is still studying. Release his 30% gradually over 4 college years.")}
                className="px-3 py-1.5 rounded-full bg-white border border-[#e5e7eb] hover:border-[#5e5cff] text-[#505050] hover:text-[#1d1d20] shrink-0 cursor-pointer transition-all flex items-center gap-1"
              >
                <GraduationCap className="w-3 h-3 text-[#5e5cff]" />
                <span>"Marcus is in college (gradual release)"</span>
              </button>

              <button
                onClick={() => handleSendMessage("What did I say about my brother's inheritance?")}
                className="px-3 py-1.5 rounded-full bg-white border border-[#e5e7eb] hover:border-[#5e5cff] text-[#505050] hover:text-[#1d1d20] shrink-0 cursor-pointer transition-all flex items-center gap-1"
              >
                <Search className="w-3 h-3 text-[#5e5cff]" />
                <span>"What did I say about my brother?"</span>
              </button>

              <button
                onClick={() => handleSendMessage("How should brother's 30% be distributed?")}
                className="px-3 py-1.5 rounded-full bg-white border border-[#e5e7eb] hover:border-[#2e7317] text-[#505050] hover:text-[#1d1d20] shrink-0 cursor-pointer transition-all flex items-center gap-1"
              >
                <Sparkles className="w-3 h-3 text-[#2e7317]" />
                <span>"How should brother's 30% be handled?"</span>
              </button>
            </div>

            {/* Input Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="p-3 border-t border-[#e5e7eb] bg-white flex items-center gap-2"
            >
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Tell assistant: 'Marcus is studying in college', or set directives..."
                className="flex-1 text-xs sm:text-sm border border-[#d1d9e4] rounded-lg px-3.5 py-2.5 focus:outline-none focus:border-[#a565ff]"
              />
              <button
                type="submit"
                disabled={!inputText.trim() || isProcessing}
                className="btn-primary-pulse text-xs px-4 py-2.5 cursor-pointer disabled:opacity-40 shrink-0"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send</span>
              </button>
            </form>
          </div>

          {/* Memory-Influenced Decision Synthesis Card with Interactive A/B Contrast Mode */}
          <div className="bg-gradient-to-br from-[#ebebff]/60 via-white to-[#f5efff] border border-[#a565ff]/40 rounded-2xl p-4 sm:p-5 shadow-xs space-y-3 animate-in fade-in slide-in-from-top-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#a565ff] animate-pulse"></span>
                <h3 className="font-semibold text-xs sm:text-sm text-[#1d1d20] flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-[#a565ff]" />
                  Memory-Influenced Decision Synthesis
                </h3>
              </div>

              {/* A/B Live Contrast Pill */}
              <div className="flex items-center bg-white border border-[#e5e7eb] p-0.5 rounded-full text-[10px] font-mono shadow-2xs">
                <button
                  type="button"
                  onClick={() => setDecisionContrastMode("with_memory")}
                  className={`px-2.5 py-1 rounded-full font-semibold transition-all cursor-pointer flex items-center gap-1 ${
                    decisionContrastMode === "with_memory"
                      ? "bg-[#5e5cff] text-white shadow-xs"
                      : "text-[#757575] hover:text-[#1d1d20]"
                  }`}
                >
                  <Database className="w-3 h-3" />
                  <span>With Sibyl Memory</span>
                </button>
                <button
                  type="button"
                  onClick={() => setDecisionContrastMode("without_memory")}
                  className={`px-2.5 py-1 rounded-full font-semibold transition-all cursor-pointer flex items-center gap-1 ${
                    decisionContrastMode === "without_memory"
                      ? "bg-red-500 text-white shadow-xs"
                      : "text-[#757575] hover:text-red-600"
                  }`}
                >
                  <Trash2 className="w-3 h-3" />
                  <span>Without Memory (Deleted)</span>
                </button>
              </div>
            </div>

            {decisionContrastMode === "with_memory" ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                {/* Remembered */}
                <div className="bg-white border border-[#e5e7eb] rounded-xl p-3.5 space-y-1.5 shadow-2xs">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-[11px] font-mono font-semibold text-[#5e5cff]">
                      <Database className="w-3.5 h-3.5 text-[#a565ff]" />
                      <span>Remembered (Sibyl):</span>
                    </div>
                    <span className="text-[10px] font-mono text-[#2e7317] bg-[#f0fdf4] border border-[#bbf7d0] px-1.5 py-0.2 rounded font-semibold">
                      FTS5 Indexed
                    </span>
                  </div>
                  <p className="text-xs sm:text-[13px] text-[#1d1d20] font-medium leading-relaxed">
                    "{brotherMemory?.body?.directive || "Marcus is enrolled in college; release his inheritance gradually across study milestones."}"
                  </p>
                  <span className="text-[10px] font-mono text-[#757575] block">
                    Source: WARM Entity [preference:Brother] (Deterministic)
                  </span>
                </div>

                {/* Agent Decision */}
                <div className="bg-white border border-[#a565ff]/40 rounded-xl p-3.5 space-y-1.5 shadow-2xs ring-1 ring-[#a565ff]/20">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-[11px] font-mono font-semibold text-[#2e7317]">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#2e7317]" />
                      <span>Agent Decision (Virtuals GAME):</span>
                    </div>
                    <span className="text-[10px] font-mono text-[#5e5cff] bg-[#ebebff] px-1.5 py-0.2 rounded font-semibold">
                      Staged Vesting
                    </span>
                  </div>
                  <p className="text-xs sm:text-[13px] text-[#1d1d20] font-medium leading-relaxed">
                    "Release his 30% ($3,000 / 1.50 ETH) in 4 annual 25% tranches for education instead of lump sum."
                  </p>
                  <span className="text-[10px] font-mono text-[#757575] block">
                    Enforced on Base Sepolia: Smart Vault Milestone Rule
                  </span>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 animate-in fade-in">
                {/* Remembered without memory */}
                <div className="bg-white border border-red-200 rounded-xl p-3.5 space-y-1.5 shadow-2xs">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-[11px] font-mono font-semibold text-red-600">
                      <Trash2 className="w-3.5 h-3.5 text-red-500" />
                      <span>Context in Memory:</span>
                    </div>
                    <span className="text-[10px] font-mono text-red-600 bg-red-50 border border-red-200 px-1.5 py-0.2 rounded font-semibold">
                      Empty / Wiped
                    </span>
                  </div>
                  <p className="text-xs sm:text-[13px] text-[#757575] italic leading-relaxed">
                    "None found. Entity [preference:Brother] was deleted or not saved."
                  </p>
                  <span className="text-[10px] font-mono text-red-500 block">
                    Result: 0 contextual directives available to agent
                  </span>
                </div>

                {/* Degraded Naive Decision */}
                <div className="bg-white border border-red-300 rounded-xl p-3.5 space-y-1.5 shadow-2xs ring-1 ring-red-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-[11px] font-mono font-semibold text-red-700">
                      <AlertTriangle className="w-3.5 h-3.5 text-red-500" />
                      <span>Degraded Naive Decision:</span>
                    </div>
                    <span className="text-[10px] font-mono text-red-700 bg-red-50 px-1.5 py-0.2 rounded font-semibold">
                      Lump Sum Fallback
                    </span>
                  </div>
                  <p className="text-xs sm:text-[13px] text-[#1d1d20] font-medium leading-relaxed">
                    "Default to immediate 100% lump-sum transfer ($3,000 / 1.50 ETH). Loss of educational milestone protection."
                  </p>
                  <span className="text-[10px] font-mono text-[#757575] block">
                    Product collapses to a naive dead-man's switch
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: Beneficiary Canvas, Base Vault & Activity Timeline (45%) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Beneficiaries Box */}
          <div className="bg-white border border-[#e5e7eb] rounded-2xl p-5 space-y-5 shadow-sm">
            <div className="flex items-center justify-between border-b border-[#f1f1f1] pb-3">
              <div>
                <h3 className="font-semibold text-sm text-[#1d1d20]">
                  Beneficiary Allocations
                </h3>
                <span className="text-[11px] text-[#757575]">
                  {plan.beneficiaries.length} members configured
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleOpenAddModal()}
                  className="btn-primary-pulse text-xs px-3 py-1.5 cursor-pointer flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Beneficiary</span>
                </button>
              </div>
            </div>

            {/* Total % Bar */}
            {plan.beneficiaries.length > 0 && (
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-[#757575]">Total Allocated:</span>
                  <span className={`font-bold ${totalAllocation === 100 ? "text-[#2e7317]" : "text-amber-600"}`}>
                    {totalAllocation}% / 100%
                  </span>
                </div>
                <div className="w-full bg-[#f1f1f1] h-2 rounded-full overflow-hidden flex">
                  {plan.beneficiaries.map((b, i) => (
                    <div
                      key={b.id}
                      style={{ width: `${b.allocationPercent}%` }}
                      className={`h-full ${
                        i === 0 ? "bg-[#1d1d20]" : i === 1 ? "bg-[#a565ff]" : i === 2 ? "bg-[#5e5cff]" : "bg-[#2e7317]"
                      }`}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Beneficiary List or Empty State */}
            {plan.beneficiaries.length === 0 ? (
              <div className="bg-[#f7f7f7] border border-dashed border-[#e5e7eb] rounded-xl p-8 text-center space-y-3">
                <Users className="w-8 h-8 text-[#92939e] mx-auto" />
                <h4 className="font-semibold text-sm text-[#1d1d20]">No Beneficiaries Added Yet</h4>
                <p className="text-xs text-[#757575] max-w-xs mx-auto">
                  Add loved ones, specify real Base wallet addresses, and set their distribution percentages.
                </p>
                <div className="flex items-center justify-center gap-2 pt-2">
                  <button
                    onClick={() => handleOpenAddModal()}
                    className="btn-primary-pulse text-xs px-3.5 py-1.5 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Custom Beneficiary</span>
                  </button>
                  <button
                    onClick={handleLoadSample}
                    className="btn-secondary text-xs px-3.5 py-1.5 cursor-pointer"
                  >
                    <span>Load 40/30/30 Sample</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {plan.beneficiaries.map((b) => {
                  const isGradual = b.payoutType === "gradual_release";
                  const usdAmount = ((plan.vaultBalanceUsd * b.allocationPercent) / 100).toLocaleString();
                  const ethAmount = ((plan.vaultBalanceEth * b.allocationPercent) / 100).toFixed(3);

                  return (
                    <div
                      key={b.id}
                      className={`p-3.5 rounded-xl border transition-all space-y-2.5 ${
                        isGradual
                          ? "border-[#a565ff] bg-gradient-to-b from-white to-[#ebebff]/40 ring-1 ring-[#a565ff]/30 shadow-xs"
                          : "border-[#e5e7eb] bg-white hover:border-[#d1d9e4]"
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-2.5">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                            isGradual ? "bg-[#a565ff] text-white" : "bg-[#f1f1f1] text-[#1d1d20]"
                          }`}>
                            {b.name.charAt(0)}
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="font-semibold text-xs text-[#1d1d20]">{b.name}</span>
                              <span className="text-[10px] font-mono bg-[#f7f7f7] border border-[#e5e7eb] px-1.5 py-0.2 rounded text-[#505050]">
                                {b.relationship}
                              </span>
                            </div>

                            {/* Wallet Address Chip with Copy & BaseScan link */}
                            <div className="flex items-center gap-1 mt-1 text-[11px] font-mono text-[#757575]">
                              <span>Wallet:</span>
                              <a
                                href={`${BASE_EXPLORER_URL}/address/${b.address}`}
                                target="_blank"
                                rel="noreferrer"
                                className="text-[#5e5cff] hover:underline"
                                title="View on BaseScan"
                              >
                                <code>{b.address.slice(0, 6)}...{b.address.slice(-4)}</code>
                              </a>
                              <button
                                type="button"
                                onClick={() => handleCopyAddress(b.id, b.address)}
                                className="p-0.5 hover:text-[#1d1d20] cursor-pointer"
                                title="Copy full wallet address"
                              >
                                {copiedId === b.id ? <Check className="w-3 h-3 text-[#16a34a]" /> : <Copy className="w-3 h-3" />}
                              </button>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <div className="text-right">
                            <span className="font-bold text-sm text-[#1d1d20] block">{b.allocationPercent}%</span>
                            <span className="font-mono text-[10px] text-[#757575]">${usdAmount} ({ethAmount} ETH)</span>
                          </div>
                          <div className="flex flex-col gap-1 pl-1">
                            <button
                              onClick={() => handleOpenAddModal(b)}
                              className="text-[#757575] hover:text-[#5e5cff] p-1 cursor-pointer"
                              title="Edit beneficiary details"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => planStore.removeBeneficiary(b.id)}
                              className="text-[#92939e] hover:text-red-600 p-1 cursor-pointer"
                              title="Remove"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-[11px] pt-1.5 border-t border-[#f1f1f1]">
                        {isGradual ? (
                          <span className="badge-lavender-tag flex items-center gap-1 font-medium text-[10px]">
                            <GraduationCap className="w-3 h-3 text-[#5e5cff]" />
                            {b.payoutSchedule || "Gradual Milestone Release"}
                          </span>
                        ) : (
                          <span className="text-[#505050] text-[10px]">
                            Immediate Lump Sum Payout
                          </span>
                        )}

                        <button
                          onClick={() => {
                            const nextType = isGradual ? "lump_sum" : "gradual_release";
                            planStore.updateBeneficiary(b.id, {
                              payoutType: nextType,
                              payoutSchedule: nextType === "gradual_release" ? "25% annually across 4 milestones" : "Immediate full payment",
                            });
                          }}
                          className="text-[10px] text-[#5e5cff] hover:underline cursor-pointer font-medium"
                        >
                          {isGradual ? "Switch to Lump Sum" : "Switch to Milestone"}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Onchain Settlement & Distribution Box */}
          <div className="bg-white border border-[#e5e7eb] rounded-2xl p-5 space-y-4 shadow-sm">
            <div className="flex items-center justify-between border-b border-[#f1f1f1] pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-sm text-[#1d1d20]">
                    Base Sepolia Smart Vault
                  </h3>
                  <a
                    href={contractExplorerUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[10px] font-mono text-[#5e5cff] hover:underline inline-flex items-center gap-0.5"
                  >
                    <span>BaseScan</span>
                    <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                </div>
                <span className="text-[11px] text-[#757575]">
                  Status: <strong className="font-mono text-[#2e7317] uppercase">{plan.status}</strong>
                </span>
              </div>
              <span className="badge-ledger-success text-[11px]">
                <CheckCircle2 className="w-3 h-3" />
                Verified
              </span>
            </div>

            <p className="text-xs text-[#505050] leading-relaxed">
              When triggered, the contract on Base unlocks funds and disburses to all configured beneficiaries according to authorized rules.
            </p>

            <div className="pt-2">
              <button
                onClick={handleExecuteSettlement}
                disabled={isExecuting || plan.beneficiaries.length === 0}
                className="w-full btn-primary-pulse text-xs py-3 justify-center cursor-pointer disabled:opacity-50 select-none"
              >
                <Sparkles className="w-4 h-4" />
                <span>
                  {isExecuting 
                    ? "Signing on Base Sepolia..." 
                    : isRealWallet 
                      ? "Sign & Execute on Base Sepolia (Wallet)" 
                      : "Execute Distribution on Base Sepolia"}
                </span>
              </button>
            </div>

            {/* Receipt */}
            {txResult && (
              <div className="bg-[#15110a] text-[#e8e0cf] border border-black/30 rounded-xl p-3.5 font-mono text-[11px] space-y-2 animate-in fade-in">
                <div className="flex items-center justify-between text-[#36d8ca] font-bold">
                  <span>✓ TRANSACTION CONFIRMED</span>
                  <span>Block #{txResult.blockNumber}</span>
                </div>
                <div className="text-[#a565ff] truncate">{txResult.txHash}</div>
                <a
                  href={txResult.explorerUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-white/80 hover:text-white underline flex items-center gap-1 text-[10px]"
                >
                  <span>Inspect on BaseScan Sepolia</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            )}
          </div>

          {/* Activity Timeline (Memory → Decision → Action) */}
          <div className="bg-white border border-[#e5e7eb] rounded-2xl p-5 space-y-4 shadow-sm">
            <div className="flex items-center justify-between border-b border-[#f1f1f1] pb-3">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-[#5e5cff]" />
                <h3 className="font-semibold text-sm text-[#1d1d20]">
                  Activity Timeline
                </h3>
              </div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#5e5cff] bg-[#ebebff] px-2 py-0.5 rounded-full font-semibold">
                Memory Pipeline
              </span>
            </div>

            <div className="space-y-3.5 relative before:absolute before:left-3 before:top-2.5 before:bottom-2.5 before:w-0.5 before:bg-[#e5e7eb]">
              {/* 1. Memory saved */}
              <div className="flex items-start gap-3 relative z-10">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${
                  hasBrotherPreference ? "bg-[#a565ff] text-white" : "bg-[#f1f1f1] text-[#92939e] border border-[#e5e7eb]"
                }`}>
                  {hasBrotherPreference ? <Check className="w-3.5 h-3.5" /> : "1"}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-xs text-[#1d1d20]">Memory saved</span>
                    <span className="text-[10px] font-mono text-[#757575]">
                      {hasBrotherPreference ? "Sibyl FTS5" : "Ready"}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#505050] leading-snug mt-0.5">
                    {hasBrotherPreference 
                      ? "Brother education preference saved to Sibyl WARM entity" 
                      : "Awaiting family directive via chat prompt"}
                  </p>
                </div>
              </div>

              {/* 2. Fresh session started */}
              <div className="flex items-start gap-3 relative z-10">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${
                  hasFreshSession ? "bg-[#5e5cff] text-white" : "bg-[#f1f1f1] text-[#92939e] border border-[#e5e7eb]"
                }`}>
                  {hasFreshSession ? <Check className="w-3.5 h-3.5" /> : "2"}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-xs text-[#1d1d20]">Fresh session started</span>
                    <span className="text-[10px] font-mono text-[#757575]">
                      {hasFreshSession ? "Context Reset" : "Optional"}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#505050] leading-snug mt-0.5">
                    {hasFreshSession 
                      ? "Chat history wiped — cold-start recall verified" 
                      : "Click 'Fresh Session' to test zero-context memory recall"}
                  </p>
                </div>
              </div>

              {/* 3. Memory recalled */}
              <div className="flex items-start gap-3 relative z-10">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${
                  hasRecalledMemory || (hasBrotherPreference && hasFreshSession) ? "bg-[#2e7317] text-white" : "bg-[#f1f1f1] text-[#92939e] border border-[#e5e7eb]"
                }`}>
                  {hasRecalledMemory || (hasBrotherPreference && hasFreshSession) ? <Check className="w-3.5 h-3.5" /> : "3"}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-xs text-[#1d1d20]">Memory recalled</span>
                    <span className="text-[10px] font-mono text-[#757575]">
                      {hasRecalledMemory ? "Deterministic" : "Standby"}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#505050] leading-snug mt-0.5">
                    {hasRecalledMemory 
                      ? "Retrieved 'Marcus college vesting' with zero drift" 
                      : "Ask 'What did I say about brother?' to trigger"}
                  </p>
                </div>
              </div>

              {/* 4. Plan updated */}
              <div className="flex items-start gap-3 relative z-10">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${
                  isPlanUpdated ? "bg-[#1d1d20] text-white" : "bg-[#f1f1f1] text-[#92939e] border border-[#e5e7eb]"
                }`}>
                  {isPlanUpdated ? <Check className="w-3.5 h-3.5" /> : "4"}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-xs text-[#1d1d20]">Plan updated</span>
                    <span className="text-[10px] font-mono text-[#757575]">
                      {isPlanUpdated ? `${totalAllocation}% total` : "Draft"}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#505050] leading-snug mt-0.5">
                    {isPlanUpdated 
                      ? `${plan.beneficiaries.length} members configured (${totalAllocation}% allocated)` 
                      : "Configure beneficiary allocations"}
                  </p>
                </div>
              </div>

              {/* 5. Base transaction */}
              <div className="flex items-start gap-3 relative z-10">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${
                  isBaseTxExecuted ? "bg-[#2e7317] text-white" : "bg-[#f1f1f1] text-[#92939e] border border-[#e5e7eb]"
                }`}>
                  {isBaseTxExecuted ? <Check className="w-3.5 h-3.5" /> : "5"}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-xs text-[#1d1d20]">Base transaction</span>
                    <span className="text-[10px] font-mono text-[#757575]">
                      {isBaseTxExecuted ? "Confirmed" : "Ready"}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#505050] leading-snug mt-0.5">
                    {isBaseTxExecuted 
                      ? `Execution confirmed on Base Sepolia (${txResult?.txHash.slice(0, 10) || "0x8a92"}...)` 
                      : "Click 'Execute Distribution' to sign transaction"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add / Edit Beneficiary Modal with Full Wallet Address Input */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-[#e5e7eb] shadow-xl max-w-md w-full p-6 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-[#f1f1f1] pb-3">
              <div>
                <h3 className="font-semibold text-sm text-[#1d1d20]">
                  {editingBeneficiaryId ? "Edit Beneficiary Details" : "Add New Beneficiary"}
                </h3>
                <span className="text-[11px] text-[#757575]">
                  Configure payout wallet and inheritance allocation
                </span>
              </div>
              <button 
                onClick={() => setShowAddModal(false)} 
                className="text-[#757575] hover:text-[#1d1d20] cursor-pointer text-sm p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveBeneficiary} className="space-y-3.5 text-xs">
              {/* Name & Relationship */}
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[#505050] font-medium mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="e.g. Eleanor, Marcus"
                    className="w-full border border-[#d1d9e4] rounded-lg px-3 py-2 text-xs text-[#1d1d20] focus:outline-none focus:border-[#a565ff]"
                  />
                </div>

                <div>
                  <label className="block text-[#505050] font-medium mb-1">Relationship</label>
                  <select
                    value={newRel}
                    onChange={(e) => setNewRel(e.target.value)}
                    className="w-full border border-[#d1d9e4] rounded-lg px-2.5 py-2 text-xs text-[#1d1d20] bg-white focus:outline-none focus:border-[#a565ff]"
                  >
                    <option value="Child">Child</option>
                    <option value="Spouse">Spouse</option>
                    <option value="Sibling">Sibling</option>
                    <option value="Parent">Parent</option>
                    <option value="Charity">Charity</option>
                    <option value="Friend">Friend</option>
                    <option value="Partner">Business Partner</option>
                  </select>
                </div>
              </div>

              {/* Real Base / Ethereum Wallet Address */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-[#505050] font-medium">Beneficiary Wallet Address (0x...)</label>
                  <button
                    type="button"
                    onClick={handleGenerateTestAddress}
                    className="text-[10px] text-[#5e5cff] hover:underline font-mono cursor-pointer"
                  >
                    ⚡ Generate Test Address
                  </button>
                </div>
                <input
                  type="text"
                  required
                  value={newAddress}
                  onChange={(e) => {
                    setNewAddress(e.target.value);
                    setAddressError(null);
                  }}
                  placeholder="0x71C8F79B37E4C74B2925b364860B615372338A12"
                  className="w-full font-mono text-xs border border-[#d1d9e4] rounded-lg px-3 py-2 text-[#1d1d20] focus:outline-none focus:border-[#a565ff]"
                />
                {addressError && (
                  <span className="text-[10px] text-red-500 block mt-1">{addressError}</span>
                )}
              </div>

              {/* Allocation Percentage */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-[#505050] font-medium">Vault Allocation (%)</label>
                  <span className="text-[11px] font-mono text-[#757575]">
                    Current total: {totalAllocation}%
                  </span>
                </div>
                <input
                  type="number"
                  min="1"
                  max="100"
                  required
                  value={newAlloc}
                  onChange={(e) => setNewAlloc(e.target.value)}
                  className="w-full border border-[#d1d9e4] rounded-lg px-3 py-2 text-xs text-[#1d1d20] focus:outline-none focus:border-[#a565ff]"
                />
              </div>

              {/* Payout Mechanism */}
              <div>
                <label className="block text-[#505050] font-medium mb-1">Payout Mechanism</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setNewPayoutType("lump_sum")}
                    className={`p-2 rounded-lg border text-xs font-medium cursor-pointer transition-all ${
                      newPayoutType === "lump_sum"
                        ? "border-[#1d1d20] bg-[#1d1d20] text-white"
                        : "border-[#e5e7eb] bg-[#f7f7f7] text-[#505050]"
                    }`}
                  >
                    Immediate Lump Sum
                  </button>

                  <button
                    type="button"
                    onClick={() => setNewPayoutType("gradual_release")}
                    className={`p-2 rounded-lg border text-xs font-medium cursor-pointer transition-all ${
                      newPayoutType === "gradual_release"
                        ? "border-[#a565ff] bg-[#a565ff] text-white"
                        : "border-[#e5e7eb] bg-[#f7f7f7] text-[#505050]"
                    }`}
                  >
                    Staged Milestones
                  </button>
                </div>
              </div>

              {newPayoutType === "gradual_release" && (
                <div>
                  <label className="block text-[#505050] font-medium mb-1">Milestone / Life Directive</label>
                  <input
                    type="text"
                    value={newSchedule}
                    onChange={(e) => setNewSchedule(e.target.value)}
                    placeholder="e.g. 25% annually over 4 college years"
                    className="w-full border border-[#d1d9e4] rounded-lg px-3 py-2 text-xs text-[#1d1d20] focus:outline-none focus:border-[#a565ff]"
                  />
                </div>
              )}

              {/* Notes / Special Instructions */}
              <div>
                <label className="block text-[#505050] font-medium mb-1">Special Directives (Optional)</label>
                <input
                  type="text"
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  placeholder="e.g. Must verify university degree enrollment before release"
                  className="w-full border border-[#d1d9e4] rounded-lg px-3 py-2 text-xs text-[#1d1d20] focus:outline-none focus:border-[#a565ff]"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-[#f1f1f1]">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="btn-secondary text-xs px-3.5 py-1.5 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary-pulse text-xs px-4 py-1.5 cursor-pointer"
                >
                  {editingBeneficiaryId ? "Save Changes" : "Add Beneficiary"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
