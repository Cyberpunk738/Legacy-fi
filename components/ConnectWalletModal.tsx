"use client";

import React, { useState } from "react";
import { Wallet, Sparkles, Zap, ArrowRight, CheckCircle2, AlertTriangle, ExternalLink, ShieldCheck } from "lucide-react";
import { connectWeb3Wallet } from "@/lib/base/contractClient";

interface ConnectWalletModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConnected: (address: string, isDemo: boolean) => void;
}

export function ConnectWalletModal({ isOpen, onClose, onConnected }: ConnectWalletModalProps) {
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleConnectLive = async () => {
    setIsConnecting(true);
    setError(null);
    try {
      const res = await connectWeb3Wallet();
      if (res) {
        onConnected(res.address, false);
        onClose();
      } else {
        setError("No accounts returned from wallet.");
      }
    } catch (err: any) {
      setError(err.message || "Failed to connect wallet. Make sure MetaMask or Coinbase Wallet is installed.");
    } finally {
      setIsConnecting(false);
    }
  };

  const handleLaunchDemoWallet = () => {
    onConnected("0x71C8F79B37E4C74B2925b364860B615372338A12", true);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl border border-[#e5e7eb] shadow-2xl max-w-md w-full p-6 sm:p-8 space-y-6 animate-in fade-in zoom-in-95 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-[#757575] hover:text-[#1d1d20] p-1.5 rounded-lg hover:bg-[#f7f7f7] cursor-pointer"
        >
          ✕
        </button>

        {/* Header */}
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#ebebff] border border-[#d1d9e4] text-[#5e5cff] text-xs font-semibold">
            <ShieldCheck className="w-3.5 h-3.5 text-[#a565ff]" />
            <span>Base Sepolia Web3 Gateway</span>
          </div>
          <h2 className="font-display-serif text-[24px] sm:text-[28px] text-[#1d1d20] leading-tight">
            Connect to InheritanceFi
          </h2>
          <p className="text-xs text-[#505050]">
            Connect your wallet to manage your estate vault, configure family allocations, and set AI memory directives.
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-xs p-3 rounded-lg flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span>{error}</span>
              <div className="pt-1">
                <a
                  href="https://www.coinbase.com/faucets/base-ethereum-sepolia-faucet"
                  target="_blank"
                  rel="noreferrer"
                  className="text-[#5e5cff] underline font-semibold flex items-center gap-1"
                >
                  <span>Need free Base Sepolia testnet ETH? Faucet here</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>
        )}

        {/* Connection Options */}
        <div className="space-y-3">
          {/* Option 1: Live MetaMask / Coinbase Wallet */}
          <button
            onClick={handleConnectLive}
            disabled={isConnecting}
            className="w-full p-4 rounded-xl border-2 border-[#1d1d20] bg-[#1d1d20] text-white hover:bg-[#2d2d32] transition-all flex items-center justify-between cursor-pointer group shadow-sm disabled:opacity-50"
          >
            <div className="flex items-center gap-3 text-left">
              <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center">
                <Wallet className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="font-semibold text-sm block">Connect Web3 Wallet</span>
                <span className="text-[11px] text-white/70">MetaMask, Coinbase, Rainbow on Base</span>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-white/70 group-hover:translate-x-1 transition-transform" />
          </button>

          {/* Option 2: Instant Demo Access */}
          <button
            onClick={handleLaunchDemoWallet}
            className="w-full p-4 rounded-xl border border-[#a565ff]/40 bg-[#ebebff]/30 hover:bg-[#ebebff]/60 transition-all flex items-center justify-between cursor-pointer group text-left"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#a565ff] text-white flex items-center justify-center shadow-xs">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <span className="font-semibold text-sm text-[#1d1d20] block">Instant Demo Access</span>
                <span className="text-[11px] text-[#505050]">Explore with pre-funded 5.00 ETH ($10,000) vault</span>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-[#a565ff] group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Footer Note */}
        <div className="pt-2 border-t border-[#f1f1f1] flex items-center justify-between text-[11px] text-[#757575]">
          <span>Network: Base Sepolia (84532)</span>
          <span className="text-[#2e7317] font-semibold">Zero gas for demo explore</span>
        </div>
      </div>
    </div>
  );
}
