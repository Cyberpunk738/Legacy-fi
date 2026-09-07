"use client";

import React, { useState, useEffect } from "react";
import { AnnouncementBar } from "@/components/AnnouncementBar";
import { Navbar, NavTab } from "@/components/Navbar";
import { LandingPageView } from "@/components/LandingPageView";
import { DashboardView } from "@/components/DashboardView";
import { MemoryInspectorView } from "@/components/MemoryInspectorView";
import { GuidedDemoStepper } from "@/components/GuidedDemoStepper";
import { ConnectWalletModal } from "@/components/ConnectWalletModal";
import { planStore } from "@/lib/inheritance/planStore";
import { sibylMemory } from "@/lib/sibyl/memoryEngine";

export default function Home() {
  const [currentView, setCurrentView] = useState<"landing" | "app">("landing");
  const [activeTab, setActiveTab] = useState<NavTab>("dashboard");
  const [isDemoOpen, setIsDemoOpen] = useState(false);
  const [isConnectModalOpen, setIsConnectModalOpen] = useState(false);
  const [connectedWalletAddress, setConnectedWalletAddress] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(1);

  // Check URL on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (params.get("view") === "app") {
        setCurrentView("app");
      }
    }
  }, []);

  const handleOpenConnectModal = () => {
    setIsConnectModalOpen(true);
  };

  const handleWalletConnected = (address: string, isDemo: boolean) => {
    setConnectedWalletAddress(address);
    setCurrentView("app");
    setActiveTab("dashboard");
    if (typeof window !== "undefined") {
      window.history.pushState(null, "", "/?view=app");
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleDisconnectWallet = () => {
    setConnectedWalletAddress(null);
    setCurrentView("landing");
    if (typeof window !== "undefined") {
      window.history.pushState(null, "", "/");
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleNavigateHome = () => {
    setCurrentView("landing");
    if (typeof window !== "undefined") {
      window.history.pushState(null, "", "/");
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleNavTabChange = (tab: NavTab) => {
    setActiveTab(tab);
    setCurrentView("app");
  };

  const handleExecuteDemoStep = async (stepNumber: number) => {
    setCurrentView("app");
    if (!connectedWalletAddress) {
      setConnectedWalletAddress("0x71C8F79B37E4C74B2925b364860B615372338A12");
    }

    if (stepNumber >= 1 && stepNumber <= 7) {
      setActiveTab("dashboard");
      if (stepNumber === 2) {
        sibylMemory.setEntity("preference", "Brother", {
          allocation: "30%",
          relationship: "Brother",
          lifeStage: "Currently enrolled in college/studies",
          payoutPreference: "gradual_release",
          releaseSchedule: "25% annually across 4 years (Milestone/Education vesting)",
          directive: "Do not release in lump sum; incentivize educational milestone completion",
        });
        planStore.updateBeneficiary("brother", {
          payoutType: "gradual_release",
          payoutSchedule: "25% annually across 4 years upon verified enrollment",
          notes: "Remembered directive: Gradual release for education support.",
        });
      } else if (stepNumber === 5) {
        planStore.setStatus("authorized");
      } else if (stepNumber === 6) {
        planStore.setStatus("activated");
      }
    } else if (stepNumber === 8) {
      setActiveTab("memory");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-[#1d1d20] selection:bg-[#ebebff] selection:text-[#5e5cff] relative hero-radial-wash">
      {/* Top Announcement Strip */}
      <AnnouncementBar onOpenDemo={() => setIsDemoOpen(true)} />

      {/* Context-aware Navigation */}
      <Navbar
        isLanding={currentView === "landing"}
        activeTab={activeTab}
        setActiveTab={handleNavTabChange}
        onNavigateHome={handleNavigateHome}
        onOpenConnectModal={handleOpenConnectModal}
        onLaunchDemo={() => setIsDemoOpen(true)}
        connectedWalletAddress={connectedWalletAddress}
        onDisconnectWallet={handleDisconnectWallet}
      />

      {/* Main Content Body */}
      <main className="flex-1 pb-16">
        {currentView === "landing" ? (
          <LandingPageView
            onOpenConnectModal={handleOpenConnectModal}
            onOpenDemo={() => setIsDemoOpen(true)}
          />
        ) : (
          <>
            {activeTab === "dashboard" && (
              <DashboardView
                setActiveTab={setActiveTab}
                onOpenDemo={() => setIsDemoOpen(true)}
                connectedWalletAddress={connectedWalletAddress}
              />
            )}
            {activeTab === "memory" && <MemoryInspectorView setActiveTab={setActiveTab} />}
          </>
        )}
      </main>

      {/* Connect Wallet & Gateway Modal */}
      <ConnectWalletModal
        isOpen={isConnectModalOpen}
        onClose={() => setIsConnectModalOpen(false)}
        onConnected={handleWalletConnected}
      />

      {/* Interactive 8-Step Stepper */}
      <GuidedDemoStepper
        isOpen={isDemoOpen}
        onClose={() => setIsDemoOpen(false)}
        setActiveTab={handleNavTabChange}
        onExecuteDemoStep={handleExecuteDemoStep}
        currentStep={currentStep}
        setCurrentStep={setCurrentStep}
      />

      {/* World-Class Footer */}
      <footer className="border-t border-[#e5e7eb] bg-[#f7f7f7] text-[#505050] text-xs py-12 px-6 mt-auto">
        <div className="max-w-[1300px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="space-y-3 md:col-span-2">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-[#1d1d20] flex items-center justify-center text-white font-bold text-xs">
                IF
              </div>
              <span className="font-semibold text-base text-[#1d1d20]">
                Inheritance<span className="text-[#a565ff]">Fi</span>
              </span>
            </div>
            <p className="text-xs text-[#757575] max-w-sm leading-relaxed">
              Your inheritance plan that remembers not only what you own, but what you wanted. Built for the SIBYL Labs Hackathon 2026.
            </p>
          </div>

          <div className="space-y-2">
            <span className="font-mono text-[11px] uppercase tracking-wider text-[#1d1d20] font-semibold block">
              Protocol Stack
            </span>
            <ul className="space-y-1.5 text-xs text-[#757575]">
              <li><a href="https://docs.sibyllabs.org" target="_blank" rel="noreferrer" className="hover:text-[#a565ff]">Sibyl Memory (FTS5)</a></li>
              <li><a href="https://virtuals.io" target="_blank" rel="noreferrer" className="hover:text-[#a565ff]">Virtuals Protocol GAME</a></li>
              <li><a href="https://base.org" target="_blank" rel="noreferrer" className="hover:text-[#a565ff]">Base Sepolia (84532)</a></li>
            </ul>
          </div>

          <div className="space-y-2">
            <span className="font-mono text-[11px] uppercase tracking-wider text-[#1d1d20] font-semibold block">
              App Navigation
            </span>
            <ul className="space-y-1.5 text-xs text-[#757575]">
              <li><button onClick={handleNavigateHome} className="hover:text-[#a565ff] cursor-pointer">Overview</button></li>
              <li><button onClick={handleOpenConnectModal} className="hover:text-[#a565ff] cursor-pointer">Studio Workspace</button></li>
              <li><button onClick={() => { setCurrentView("app"); setActiveTab("memory"); }} className="hover:text-[#a565ff] cursor-pointer">Sibyl Inspector</button></li>
            </ul>
          </div>
        </div>

        <div className="max-w-[1300px] mx-auto pt-6 border-t border-[#e5e7eb] flex flex-col sm:flex-row items-center justify-between gap-4 text-[#757575] text-[11px]">
          <span>© 2026 Legacy Labs. MIT Licensed. Built on Base.</span>
          <span>SIBYL Labs Hackathon 2026 Submission</span>
        </div>
      </footer>
    </div>
  );
}
