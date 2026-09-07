"use client";

import React, { useState, useEffect } from "react";
import { Database, Landmark, ExternalLink, Wallet, LogOut, Sparkles, Layers, Coins } from "lucide-react";
import { formatEther } from "viem";
import { publicBaseClient } from "@/lib/base/contractClient";

export type NavTab = "dashboard" | "memory";

interface NavbarProps {
  isLanding: boolean;
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  onNavigateHome: () => void;
  onOpenConnectModal: () => void;
  onLaunchDemo: () => void;
  connectedWalletAddress: string | null;
  onDisconnectWallet: () => void;
}

export function Navbar({
  isLanding,
  activeTab,
  setActiveTab,
  onNavigateHome,
  onOpenConnectModal,
  onLaunchDemo,
  connectedWalletAddress,
  onDisconnectWallet,
}: NavbarProps) {
  const [walletEthBalance, setWalletEthBalance] = useState<string>("0.00");

  useEffect(() => {
    if (!connectedWalletAddress || !connectedWalletAddress.startsWith("0x")) return;
    const fetchBalance = async () => {
      try {
        const bal = await publicBaseClient.getBalance({ address: connectedWalletAddress as `0x${string}` });
        setWalletEthBalance(parseFloat(formatEther(bal)).toFixed(4));
      } catch {
        setWalletEthBalance("0.00");
      }
    };
    fetchBalance();
    const interval = setInterval(fetchBalance, 10000);
    return () => clearInterval(interval);
  }, [connectedWalletAddress]);

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-[#e5e7eb] transition-all">
      <div className="max-w-[1300px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Left: Brand Lockup */}
        <div className="flex items-center gap-6">
          <div
            onClick={onNavigateHome}
            className="flex items-center gap-2.5 cursor-pointer group select-none"
          >
            <div className="w-8 h-8 rounded-lg bg-[#1d1d20] flex items-center justify-center text-white font-bold text-sm shadow-sm group-hover:scale-105 transition-transform">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L20.66 7V17L12 22L3.34 17V7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <circle cx="12" cy="12" r="3" fill="#a565ff" />
              </svg>
            </div>
            <div className="flex flex-col">
              <span className="font-semibold text-[17px] tracking-[-0.02em] text-[#1d1d20]">
                Inheritance<span className="text-[#a565ff]">Fi</span>
              </span>
              <span className="text-[10px] uppercase font-mono tracking-wider text-[#757575] -mt-1">
                by Legacy Labs
              </span>
            </div>
          </div>

          {/* Clean View Switcher (Only in App Mode) */}
          {!isLanding && (
            <div className="hidden sm:flex items-center bg-[#f7f7f7] p-1 rounded-full border border-[#e5e7eb] text-xs">
              <button
                onClick={() => setActiveTab("dashboard")}
                className={`px-3 py-1 rounded-full font-medium transition-all cursor-pointer ${
                  activeTab === "dashboard"
                    ? "bg-white text-[#1d1d20] shadow-xs border border-[#e5e7eb]"
                    : "text-[#505050] hover:text-[#1d1d20]"
                }`}
              >
                Studio
              </button>

              <button
                onClick={() => setActiveTab("memory")}
                className={`px-3 py-1 rounded-full font-medium transition-all cursor-pointer ${
                  activeTab === "memory"
                    ? "bg-white text-[#1d1d20] shadow-xs border border-[#e5e7eb]"
                    : "text-[#505050] hover:text-[#1d1d20]"
                }`}
              >
                Sibyl Inspector
              </button>
            </div>
          )}
        </div>

        {/* Right: Network status + Real Wallet + Actions */}
        <div className="flex items-center gap-3">
          {/* Base Sepolia badge */}
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#f7f7f7] border border-[#e5e7eb] text-xs font-mono text-[#505050]">
            <span className="w-2 h-2 rounded-full bg-[#0052FF] animate-pulse"></span>
            <span>Base Sepolia (84532)</span>
          </div>

          {isLanding ? (
            /* Landing View CTA */
            <div className="flex items-center gap-2">
              <button
                onClick={onOpenConnectModal}
                className="btn-primary-pulse text-xs px-4 py-2 cursor-pointer select-none"
              >
                <Wallet className="w-3.5 h-3.5" />
                <span>Launch App</span>
              </button>
            </div>
          ) : (
            /* In-App View Real Wallet Details */
            <div className="flex items-center gap-2">
              {/* Real Onchain Balance Pill */}
              <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#f7f7f7] border border-[#e5e7eb] text-xs font-mono">
                <Coins className="w-3 h-3 text-[#5e5cff]" />
                <span className="font-semibold text-[#1d1d20]">{walletEthBalance} ETH</span>
              </div>

              {/* Connected Address Chip */}
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-[#e5e7eb] text-xs font-mono text-[#1d1d20] shadow-xs">
                <span className="w-2 h-2 rounded-full bg-[#2e7317]"></span>
                <span>
                  {connectedWalletAddress
                    ? `${connectedWalletAddress.slice(0, 6)}...${connectedWalletAddress.slice(-4)}`
                    : "0x71C8...8A12"}
                </span>
              </div>

              {/* Faucet Link */}
              <a
                href="https://www.coinbase.com/faucets/base-ethereum-sepolia-faucet"
                target="_blank"
                rel="noreferrer"
                className="hidden lg:inline-flex items-center gap-1 text-[11px] font-semibold text-[#5e5cff] hover:underline px-2"
                title="Get free Base Sepolia testnet tokens"
              >
                <span>Faucet</span>
                <ExternalLink className="w-3 h-3" />
              </a>

              {/* Exit to Landing Page */}
              <button
                onClick={onDisconnectWallet}
                className="p-1.5 rounded-lg border border-[#e5e7eb] hover:bg-[#f7f7f7] text-[#757575] hover:text-[#1d1d20] transition-colors cursor-pointer"
                title="Exit to Overview / Disconnect"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
