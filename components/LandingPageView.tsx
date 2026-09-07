"use client";

import React, { useState } from "react";
import { 
  ArrowRight, 
  ShieldCheck, 
  Sparkles, 
  Database, 
  Bot, 
  Landmark, 
  Lock, 
  Heart, 
  GraduationCap, 
  CheckCircle2, 
  Play, 
  HelpCircle, 
  ChevronDown, 
  ChevronUp, 
  Layers, 
  Sliders, 
  Coins, 
  ExternalLink,
  MessageSquare,
  Wallet
} from "lucide-react";
import { NavTab } from "./Navbar";

interface LandingPageViewProps {
  onOpenConnectModal: () => void;
  onOpenDemo: () => void;
}

export function LandingPageView({ onOpenConnectModal, onOpenDemo }: LandingPageViewProps) {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [simulatorMode, setSimulatorMode] = useState<"without_memory" | "with_memory">("with_memory");

  const faqs = [
    {
      q: "What is InheritanceFi in simple words?",
      a: "InheritanceFi is an autonomous digital inheritance protocol. Instead of writing a rigid paper will that just divides numbers, you speak with an AI assistant that remembers your family's personal life situations (like a child in college or a relative needing medical care) and sets up a secure blockchain vault to deliver funds exactly according to your wishes.",
    },
    {
      q: "Why is Sibyl Memory needed? Can't ChatGPT do this?",
      a: "Standard chatbots forget everything once your conversation ends. Sibyl Memory is a permanent, local-first memory engine that remembers your directives across years and sessions. When your estate plan is evaluated, the AI recalls your exact family context and adjusts payout schedules accordingly.",
    },
    {
      q: "Can the AI assistant steal or touch my funds?",
      a: "Never. The AI only interprets your natural language wishes and prepares distribution rules. The assets are locked inside a verified Solidity smart contract on the Base blockchain. Payouts can only be executed according to the strict rules you explicitly approve.",
    },
    {
      q: "How does the milestone payout work for someone in college?",
      a: "If you tell the assistant that your brother or child is studying, the system automatically converts their share into milestone educational tranches (e.g. 25% annually over 4 college years) instead of handing them an overwhelming lump sum on day one.",
    },
    {
      q: "What blockchain network does InheritanceFi run on?",
      a: "InheritanceFi is built on Base Sepolia (Chain ID: 84532), offering sub-cent transaction fees, instant finality, and Ethereum-grade security.",
    },
  ];

  return (
    <div className="w-full flex flex-col space-y-24">
      {/* 1. HERO SECTION */}
      <section className="relative pt-12 pb-8 overflow-hidden">
        <div className="max-w-[1200px] mx-auto px-6 text-center space-y-8">
          {/* Eyebrow badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#ebebff] border border-[#d1d9e4] text-[#5e5cff] text-xs font-semibold shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-[#a565ff]" />
            <span>Autonomous Estate Infrastructure • Powered by Sibyl & Base</span>
          </div>

          {/* Display Headline */}
          <div className="max-w-4xl mx-auto space-y-4">
            <h1 className="font-display-serif text-[44px] sm:text-[54px] md:text-[62px] leading-[1.03] tracking-[-0.025em] text-[#1d1d20]">
              Your inheritance plan that remembers what you wanted.
            </h1>
            <p className="text-[17px] sm:text-[19px] leading-[1.6] text-[#505050] max-w-2xl mx-auto font-normal">
              Traditional estate plans write down numbers and forget the human context. InheritanceFi pairs an AI assistant that remembers your family's life situations with a secure blockchain vault that protects your legacy.
            </p>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <button
              onClick={onOpenConnectModal}
              className="btn-primary-pulse text-base px-8 py-3.5 cursor-pointer shadow-lg select-none"
            >
              <Wallet className="w-4 h-4" />
              <span>Connect Wallet & Launch Vault</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={onOpenDemo}
              className="btn-secondary text-base px-6 py-3.5 cursor-pointer select-none flex items-center gap-2"
            >
              <Play className="w-4 h-4 fill-current text-[#757575]" />
              <span>Watch 3-Minute Story</span>
            </button>
          </div>

          {/* Floating Product Screenshot / Mock Chrome Card */}
          <div className="pt-8 max-w-4xl mx-auto">
            <div className="bg-white border border-[#e5e7eb] rounded-2xl p-6 sm:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.06),0_0_0_1px_rgba(0,0,0,0.04)] text-left relative overflow-hidden">
              {/* Mock Window Chrome */}
              <div className="flex items-center justify-between border-b border-[#f1f1f1] pb-4 mb-6">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#e5e7eb]" />
                  <div className="w-3 h-3 rounded-full bg-[#e5e7eb]" />
                  <div className="w-3 h-3 rounded-full bg-[#e5e7eb]" />
                  <span className="text-xs font-mono text-[#757575] ml-2">inheritancefi.vault / family-trust-01</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-mono text-[#2e7317] bg-[#f7f7f7] px-2.5 py-0.5 rounded-full border border-[#2e7317]/20">
                  <span className="w-2 h-2 rounded-full bg-[#2e7317] animate-pulse"></span>
                  <span>Base Sepolia Verified</span>
                </div>
              </div>

              {/* Mock Split Grid */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                {/* Left: Chat dialogue with remembered memory */}
                <div className="md:col-span-7 space-y-3 bg-[#f7f7f7] rounded-xl p-4 border border-[#e5e7eb]">
                  <div className="flex items-center justify-between text-xs text-[#757575] font-mono">
                    <span>Family Estate Assistant</span>
                    <span className="text-[#a565ff] font-semibold">Sibyl Memory Active</span>
                  </div>

                  <div className="bg-white p-3 rounded-lg border border-[#e5e7eb] text-xs space-y-1">
                    <span className="text-[#757575] text-[11px] font-mono">You:</span>
                    <p className="text-[#1d1d20] font-medium">"My brother is still studying. Release his 30% inheritance gradually."</p>
                  </div>

                  <div className="bg-white p-3 rounded-lg border border-[#a565ff]/30 ring-1 ring-[#a565ff]/20 text-xs space-y-1.5">
                    <div className="flex items-center gap-1.5 text-[11px] font-mono text-[#5e5cff] font-semibold">
                      <Sparkles className="w-3 h-3 text-[#a565ff]" />
                      <span>SIBYL MEMORY PERSISTED: [preference:Brother]</span>
                    </div>
                    <p className="text-[#505050]">
                      Understood. I have recorded that Marcus is studying. His 30% ($3,000 / 1.50 ETH) is now staged for a 4-year annual milestone payout on Base Sepolia.
                    </p>
                  </div>
                </div>

                {/* Right: Vault Allocation Cards */}
                <div className="md:col-span-5 space-y-3 flex flex-col justify-between">
                  <div className="space-y-2">
                    <span className="text-xs font-mono uppercase tracking-wider text-[#757575]">Live Vault Allocation</span>
                    
                    <div className="bg-white border border-[#e5e7eb] rounded-lg p-3 flex justify-between items-center text-xs">
                      <div>
                        <span className="font-semibold text-[#1d1d20] block">Eleanor (Mother)</span>
                        <span className="text-[#757575] text-[11px]">Immediate Lump Sum</span>
                      </div>
                      <span className="font-mono font-bold text-sm text-[#1d1d20]">40%</span>
                    </div>

                    <div className="bg-[#ebebff]/60 border border-[#a565ff]/40 rounded-lg p-3 flex justify-between items-center text-xs">
                      <div>
                        <span className="font-semibold text-[#1d1d20] block">Marcus (Brother)</span>
                        <span className="text-[#5e5cff] text-[11px] font-medium">4-Year College Vesting</span>
                      </div>
                      <span className="font-mono font-bold text-sm text-[#5e5cff]">30%</span>
                    </div>

                    <div className="bg-white border border-[#e5e7eb] rounded-lg p-3 flex justify-between items-center text-xs">
                      <div>
                        <span className="font-semibold text-[#1d1d20] block">Clara (Sister)</span>
                        <span className="text-[#757575] text-[11px]">Immediate Lump Sum</span>
                      </div>
                      <span className="font-mono font-bold text-sm text-[#1d1d20]">30%</span>
                    </div>
                  </div>

                  <button
                    onClick={onOpenConnectModal}
                    className="w-full btn-primary-pulse text-xs py-2 justify-center"
                  >
                    <span>Connect & Manage Vault</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. SOCIAL PROOF / ARCHITECTURE PILLARS STRIP */}
      <section className="border-y border-[#e5e7eb] bg-[#f7f7f7] py-8">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="text-center text-xs font-mono uppercase tracking-widest text-[#757575] mb-6">
            Architected on verified next-generation protocols
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
            <div className="space-y-1">
              <span className="text-sm font-semibold text-[#1d1d20] block">Sibyl Memory Infrastructure</span>
              <span className="text-xs text-[#505050]">Local-first, zero embeddings, SQLite FTS5 persistence</span>
            </div>
            <div className="space-y-1">
              <span className="text-sm font-semibold text-[#1d1d20] block">Virtuals Protocol GAME</span>
              <span className="text-xs text-[#505050]">Autonomous agent & executable smart contract tools</span>
            </div>
            <div className="space-y-1">
              <span className="text-sm font-semibold text-[#1d1d20] block">Base Network (Ethereum L2)</span>
              <span className="text-xs text-[#505050]">Immutable Solidity smart contract execution (84532)</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. THE PROBLEM VS. THE SOLUTION */}
      <section id="how-it-works" className="max-w-[1200px] mx-auto px-6 space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs font-mono uppercase tracking-widest text-[#a565ff] font-semibold">
            Why Traditional Estate Planning Fails
          </span>
          <h2 className="font-display-serif text-[36px] sm:text-[42px] leading-[1.1] text-[#1d1d20]">
            Wills write down numbers. They don't understand your family.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Old Traditional Wills */}
          <div className="bg-[#f7f7f7] border border-[#e5e7eb] rounded-2xl p-8 space-y-6">
            <div className="flex items-center gap-2 text-red-600 font-semibold text-sm font-mono">
              <span>✕ The Old Way: Paper Wills & Dead-Man Switches</span>
            </div>

            <ul className="space-y-4 text-sm text-[#505050]">
              <li className="flex items-start gap-3">
                <span className="text-red-500 font-bold text-base">•</span>
                <div>
                  <strong className="text-[#1d1d20] block">Rigid One-Time Lump Sum:</strong>
                  Hands an entire inheritance to an 18-year-old on day one with zero milestone protection.
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-red-500 font-bold text-base">•</span>
                <div>
                  <strong className="text-[#1d1d20] block">Zero Contextual Memory:</strong>
                  Forms and standard smart contracts cannot remember why you wanted gradual educational releases.
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-red-500 font-bold text-base">•</span>
                <div>
                  <strong className="text-[#1d1d20] block">Costly & Friction-Heavy to Update:</strong>
                  Requires thousands of dollars in lawyer visits for simple life adjustments.
                </div>
              </li>
            </ul>
          </div>

          {/* The InheritanceFi Way */}
          <div className="bg-white border border-[#a565ff]/30 ring-1 ring-[#a565ff]/20 rounded-2xl p-8 space-y-6 shadow-sm">
            <div className="flex items-center gap-2 text-[#2e7317] font-semibold text-sm font-mono">
              <CheckCircle2 className="w-4 h-4 text-[#2e7317]" />
              <span>✓ The InheritanceFi Way: Intelligent Memory Protocol</span>
            </div>

            <ul className="space-y-4 text-sm text-[#505050]">
              <li className="flex items-start gap-3">
                <span className="text-[#2e7317] font-bold text-base">✓</span>
                <div>
                  <strong className="text-[#1d1d20] block">Remembers Evolving Life Context:</strong>
                  Sibyl Memory permanently remembers your brother is studying or daughter is buying a home.
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[#2e7317] font-bold text-base">✓</span>
                <div>
                  <strong className="text-[#1d1d20] block">Evolve Wishes by Natural Chat:</strong>
                  Speak in plain English anytime to update your family directives with zero legal fees.
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[#2e7317] font-bold text-base">✓</span>
                <div>
                  <strong className="text-[#1d1d20] block">Guaranteed Smart Contract Vesting:</strong>
                  Solidity contracts on Base automatically enforce annual college tranches and milestones.
                </div>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* 4. LIVE INTERACTIVE MEMORY DIFFERENCE SIMULATOR */}
      <section id="simulator" className="max-w-[1200px] mx-auto px-6">
        <div className="bg-[#1d1d20] text-white rounded-3xl p-8 sm:p-12 space-y-8 relative overflow-hidden">
          {/* Subtle background glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#a565ff]/10 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 relative z-10">
            <div className="space-y-2 max-w-xl">
              <span className="text-xs font-mono text-[#a565ff] uppercase tracking-widest font-semibold">
                Live Simulator
              </span>
              <h2 className="font-display-serif text-[32px] sm:text-[38px] leading-[1.1] text-white">
                See what changes when memory is turned on.
              </h2>
              <p className="text-sm text-white/70">
                Toggle between standard estate rules and Sibyl memory to see how the agent adapts its payout strategy for Marcus (Brother).
              </p>
            </div>

            {/* Toggle Buttons */}
            <div className="flex items-center bg-white/10 p-1 rounded-full border border-white/10 shrink-0">
              <button
                onClick={() => setSimulatorMode("without_memory")}
                className={`px-4 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                  simulatorMode === "without_memory"
                    ? "bg-white text-[#1d1d20] shadow-sm"
                    : "text-white/70 hover:text-white"
                }`}
              >
                Without Memory (Default)
              </button>

              <button
                onClick={() => setSimulatorMode("with_memory")}
                className={`px-4 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                  simulatorMode === "with_memory"
                    ? "bg-[#a565ff] text-white shadow-[0_0_15px_rgba(165,101,255,0.6)]"
                    : "text-white/70 hover:text-white"
                }`}
              >
                With Sibyl Memory (Active)
              </button>
            </div>
          </div>

          {/* Simulator Content Card */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10 pt-2">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-3">
              <span className="text-xs font-mono text-white/50 uppercase block">Input Context</span>
              <div className="text-sm font-mono text-white/90 bg-black/40 p-3 rounded-lg border border-white/10">
                {simulatorMode === "with_memory" 
                  ? "Directive: \"Marcus is studying in college. Release his 30% gradually.\""
                  : "Directive: [No contextual memory present in database]"}
              </div>
              <div className="text-xs text-white/60">
                {simulatorMode === "with_memory"
                  ? "✓ Sibyl WARM entity [preference:Brother] retrieved."
                  : "✕ Memory layer deleted / empty. Protocol falls back to static baseline."}
              </div>
            </div>

            <div className={`rounded-2xl p-6 space-y-3 border transition-all ${
              simulatorMode === "with_memory" 
                ? "bg-[#a565ff]/10 border-[#a565ff]/40" 
                : "bg-white/5 border-white/10"
            }`}>
              <span className="text-xs font-mono text-[#36d8ca] uppercase block font-semibold">
                Outcome on Base Smart Contract
              </span>
              <div className="text-base font-bold text-white">
                {simulatorMode === "with_memory"
                  ? "🎓 4-Year Staged Educational Vesting (25% Annual Tranches)"
                  : "💵 Immediate 100% Lump Sum Payout ($3,000 / 1.50 ETH)"}
              </div>
              <p className="text-xs text-white/70 leading-relaxed">
                {simulatorMode === "with_memory"
                  ? "Because of remembered memory, Marcus receives $750/yr across 4 college years for tuition rather than getting all funds at once."
                  : "Without memory, the smart contract does not know Marcus is in school and sends the entire lump sum immediately."}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. PRODUCT FEATURES (4 PILLARS) */}
      <section id="memory-engine" className="max-w-[1200px] mx-auto px-6 space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs font-mono uppercase tracking-widest text-[#a565ff] font-semibold">
            Product Capabilities
          </span>
          <h2 className="font-display-serif text-[36px] sm:text-[42px] leading-[1.1] text-[#1d1d20]">
            Everything you need to secure your legacy.
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white border border-[#e5e7eb] rounded-2xl p-6 space-y-3 shadow-xs hover:border-[#d1d9e4] transition-all">
            <div className="w-10 h-10 rounded-xl bg-[#ebebff] text-[#5e5cff] flex items-center justify-center">
              <Database className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-[17px] text-[#1d1d20]">
              Sibyl 5-Tier Memory
            </h3>
            <p className="text-xs text-[#505050] leading-relaxed">
              SQLite FTS5 full-text search with zero embeddings. Holds family facts in active WARM storage and audit trails in COLD journal.
            </p>
          </div>

          <div className="bg-white border border-[#e5e7eb] rounded-2xl p-6 space-y-3 shadow-xs hover:border-[#d1d9e4] transition-all">
            <div className="w-10 h-10 rounded-xl bg-[#f7f7f7] text-[#1d1d20] flex items-center justify-center">
              <Bot className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-[17px] text-[#1d1d20]">
              Virtuals GAME Agent
            </h3>
            <p className="text-xs text-[#505050] leading-relaxed">
              Natural conversational interface equipped with executable tools to calculate distributions and stage smart contract updates.
            </p>
          </div>

          <div className="bg-white border border-[#e5e7eb] rounded-2xl p-6 space-y-3 shadow-xs hover:border-[#d1d9e4] transition-all">
            <div className="w-10 h-10 rounded-xl bg-[#f7f7f7] text-[#2e7317] flex items-center justify-center">
              <Landmark className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-[17px] text-[#1d1d20]">
              Base Sepolia Vault
            </h3>
            <p className="text-xs text-[#505050] leading-relaxed">
              Bank-grade Solidity contract enforcing approved rules, milestone releases, and direct wallet payouts on Base (84532).
            </p>
          </div>

          <div className="bg-white border border-[#e5e7eb] rounded-2xl p-6 space-y-3 shadow-xs hover:border-[#d1d9e4] transition-all">
            <div className="w-10 h-10 rounded-xl bg-[#ebebff] text-[#a565ff] flex items-center justify-center">
              <GraduationCap className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-[17px] text-[#1d1d20]">
              Milestone Vesting
            </h3>
            <p className="text-xs text-[#505050] leading-relaxed">
              Define custom release schedules for education, reaching age milestones (18/21/25), or milestone life events.
            </p>
          </div>
        </div>
      </section>

      {/* 6. FAQ ACCORDION */}
      <section id="faq" className="max-w-[800px] mx-auto px-6 space-y-8">
        <div className="text-center space-y-2">
          <h2 className="font-display-serif text-[32px] sm:text-[38px] text-[#1d1d20]">
            Frequently Asked Questions
          </h2>
          <p className="text-xs text-[#757575]">
            Everything you need to know about InheritanceFi and our technology.
          </p>
        </div>

        <div className="divide-y divide-[#e5e7eb] border-y border-[#e5e7eb]">
          {faqs.map((faq, index) => (
            <div key={index} className="py-4">
              <button
                onClick={() => setActiveFaq(activeFaq === index ? null : index)}
                className="w-full flex items-center justify-between text-left font-semibold text-sm text-[#1d1d20] hover:text-[#a565ff] transition-colors cursor-pointer py-1"
              >
                <span>{faq.q}</span>
                {activeFaq === index ? (
                  <ChevronUp className="w-4 h-4 text-[#757575] shrink-0 ml-4" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-[#757575] shrink-0 ml-4" />
                )}
              </button>
              {activeFaq === index && (
                <p className="text-xs text-[#505050] leading-relaxed pt-2 pb-1 animate-in fade-in">
                  {faq.a}
                </p>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* 7. PILOT & DESIGN PARTNER AUDIENCE (RULE 05 PMF BONUS) */}
      <section className="max-w-[1200px] mx-auto px-6 space-y-6">
        <div className="bg-[#f7f7f7] border border-[#e5e7eb] rounded-3xl p-8 sm:p-10 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-[#e5e7eb]">
            <div className="space-y-1">
              <span className="text-xs font-mono uppercase tracking-wider text-[#a565ff] font-bold">
                Early Access Cohort & Design Partner Pilot
              </span>
              <h3 className="font-display-serif text-[26px] sm:text-[30px] text-[#1d1d20]">
                Validated for Web3 Native Families & Digital Asset Holders
              </h3>
              <p className="text-xs text-[#505050] max-w-xl">
                We are piloting with 25 Web3 founders and families managing multi-asset crypto portfolios to solve the $4.2B annual lost crypto problem through persistent AI memory.
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <div className="bg-white border border-[#2e7317]/30 px-3 py-1.5 rounded-full flex items-center gap-2 text-xs font-mono text-[#2e7317]">
                <span className="w-2 h-2 rounded-full bg-[#2e7317] animate-pulse"></span>
                <span>Cohort 1: 18 / 25 Pilots Filled</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
            <div className="bg-white p-5 rounded-xl border border-[#e5e7eb] space-y-2">
              <span className="font-semibold text-sm text-[#1d1d20] block">Target Audience</span>
              <p className="text-[#505050] leading-relaxed">
                Crypto-native parents and digital asset holders who need contextual milestone releases for dependents without traditional attorney fees.
              </p>
            </div>

            <div className="bg-white p-5 rounded-xl border border-[#e5e7eb] space-y-2">
              <span className="font-semibold text-sm text-[#1d1d20] block">Validated Pain Point</span>
              <p className="text-[#505050] leading-relaxed">
                Existing dead-man switches force rigid 100% lump-sum payouts that overwhelm young heirs or fail when life situations evolve.
              </p>
            </div>

            <div className="bg-white p-5 rounded-xl border border-[#e5e7eb] space-y-2">
              <span className="font-semibold text-sm text-[#1d1d20] block">Pilot Verification</span>
              <p className="text-[#505050] leading-relaxed">
                Tested on Base Sepolia testnet with live Solidity execution and persistent SQLite FTS5 Sibyl memory tiers.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 8. BOTTOM CTA HERO */}
      <section className="max-w-[1200px] mx-auto px-6">
        <div className="bg-gradient-to-b from-[#f7f7f7] to-[#ebebff]/50 border border-[#e5e7eb] rounded-3xl p-10 sm:p-14 text-center space-y-6">
          <h2 className="font-display-serif text-[36px] sm:text-[46px] leading-[1.08] text-[#1d1d20] max-w-2xl mx-auto">
            Ready to secure your family's future with intelligent memory?
          </h2>
          <p className="text-sm text-[#505050] max-w-lg mx-auto">
            Create your custom plan, chat with your estate advisor, and lock your vault on Base in minutes.
          </p>
          <div className="pt-2">
            <button
              onClick={onOpenConnectModal}
              className="btn-primary-pulse text-base px-8 py-3.5 cursor-pointer shadow-lg select-none"
            >
              <Wallet className="w-4 h-4" />
              <span>Connect Wallet & Get Started</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
