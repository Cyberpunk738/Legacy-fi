"use client";

import React, { useState } from "react";
import { CheckCircle2, ArrowRight, RotateCcw, AlertTriangle, Sparkles, ChevronRight, X, Layers, Bot, Database, Landmark } from "lucide-react";
import { NavTab } from "./Navbar";

interface GuidedDemoStepperProps {
  isOpen: boolean;
  onClose: () => void;
  setActiveTab: (tab: NavTab) => void;
  onExecuteDemoStep: (stepNumber: number) => Promise<void> | void;
  currentStep: number;
  setCurrentStep: (step: number) => void;
}

export const DEMO_STEPS = [
  {
    step: 1,
    title: "Initial Vault Plan",
    tab: "dashboard" as NavTab,
    description: "Inspect the baseline estate vault with default allocations (Mother 40%, Brother 30%, Sister 30%).",
    actionLabel: "Step 1: Inspect Plan",
  },
  {
    step: 2,
    title: "User Context & Memory Persistence",
    tab: "agent" as NavTab,
    description: "Tell agent: 'My brother is still studying. Release his inheritance gradually.' Sibyl saves the context.",
    actionLabel: "Step 2: Save to Sibyl",
  },
  {
    step: 3,
    title: "Start Fresh Session (Recall Test)",
    tab: "agent" as NavTab,
    description: "Reset conversation history to start a clean session. Ask: 'What did I say about my brother?' Sibyl recalls.",
    actionLabel: "Step 3: Test Recall",
  },
  {
    step: 4,
    title: "Decision Shift (Load-Bearing Proof)",
    tab: "agent" as NavTab,
    description: "Ask: 'How should his 30% be handled?' The agent changes recommendation from lump-sum to 4-year staged release.",
    actionLabel: "Step 4: Verify Decision Shift",
  },
  {
    step: 5,
    title: "Plan Authorization",
    tab: "dashboard" as NavTab,
    description: "Review and authorize the updated multi-tranche distribution structure.",
    actionLabel: "Step 5: Authorize Plan",
  },
  {
    step: 6,
    title: "Simulate Demo Activation",
    tab: "vault" as NavTab,
    description: "Trigger the simulated demo inheritance activation event.",
    actionLabel: "Step 6: Trigger Activation",
  },
  {
    step: 7,
    title: "Base Sepolia Execution",
    tab: "vault" as NavTab,
    description: "Execute the authorized distribution on Base Sepolia and verify the transaction receipt.",
    actionLabel: "Step 7: Execute on Base",
  },
  {
    step: 8,
    title: "Memory Deletion Test",
    tab: "memory" as NavTab,
    description: "Delete Sibyl memory and re-query the agent. Show that the agent forgets and falls back to default lump sum.",
    actionLabel: "Step 8: Run Deletion Test",
  },
];

export function GuidedDemoStepper({
  isOpen,
  onClose,
  setActiveTab,
  onExecuteDemoStep,
  currentStep,
  setCurrentStep,
}: GuidedDemoStepperProps) {
  const [isRunning, setIsRunning] = useState(false);

  if (!isOpen) return null;

  const currentStepData = DEMO_STEPS[currentStep - 1] || DEMO_STEPS[0];

  const handleStepClick = async (stepNum: number) => {
    setIsRunning(true);
    setCurrentStep(stepNum);
    setActiveTab(DEMO_STEPS[stepNum - 1].tab);
    await onExecuteDemoStep(stepNum);
    setIsRunning(false);
  };

  const handleNext = async () => {
    if (currentStep < DEMO_STEPS.length) {
      const nextStep = currentStep + 1;
      await handleStepClick(nextStep);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 w-full max-w-[480px] bg-white rounded-2xl border border-[#e5e7eb] shadow-[0_12px_40px_rgba(0,0,0,0.12)] overflow-hidden transition-all animate-in fade-in slide-in-from-bottom-4">
      {/* Header */}
      <div className="bg-[#1d1d20] text-white px-5 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[#a565ff] animate-ping" />
          <span className="font-semibold text-sm tracking-tight">Hackathon Judge Walkthrough</span>
          <span className="text-[11px] font-mono bg-white/10 px-2 py-0.5 rounded-full text-slate-300">
            Step {currentStep} of 8
          </span>
        </div>
        <button
          onClick={onClose}
          className="text-white/60 hover:text-white p-1 rounded-md transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-[#f1f1f1] h-1.5 flex">
        {DEMO_STEPS.map((s) => (
          <div
            key={s.step}
            className={`flex-1 transition-all duration-300 ${
              s.step <= currentStep ? "bg-[#a565ff]" : "bg-transparent"
            }`}
          />
        ))}
      </div>

      {/* Step Body */}
      <div className="p-5">
        <div className="flex items-start justify-between gap-3 mb-2">
          <div>
            <span className="text-[11px] font-mono uppercase tracking-wider text-[#a565ff] font-semibold">
              Step {currentStepData.step} • {currentStepData.title}
            </span>
            <h4 className="text-[16px] font-semibold text-[#1d1d20] mt-0.5">
              {currentStepData.title}
            </h4>
          </div>
          <span className="text-xs font-medium px-2 py-1 rounded bg-[#f7f7f7] border border-[#e5e7eb] text-[#505050] capitalize">
            View: {currentStepData.tab}
          </span>
        </div>

        <p className="text-[13px] text-[#505050] leading-relaxed mb-4">
          {currentStepData.description}
        </p>

        {/* Action Controls */}
        <div className="flex items-center justify-between pt-3 border-t border-[#f1f1f1]">
          <button
            onClick={() => handleStepClick(1)}
            className="text-xs text-[#757575] hover:text-[#1d1d20] flex items-center gap-1 font-medium cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset to Step 1</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleStepClick(currentStep)}
              disabled={isRunning}
              className="btn-secondary text-xs px-3.5 py-1.5 cursor-pointer disabled:opacity-50"
            >
              {isRunning ? "Running..." : "Run Step"}
            </button>

            {currentStep < DEMO_STEPS.length ? (
              <button
                onClick={handleNext}
                disabled={isRunning}
                className="btn-primary-pulse text-xs px-4 py-1.5 cursor-pointer disabled:opacity-50"
              >
                <span>Next Step</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                onClick={onClose}
                className="btn-primary-pulse text-xs px-4 py-1.5 cursor-pointer"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Finish Demo</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
