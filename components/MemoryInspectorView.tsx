"use client";

import React, { useState, useEffect } from "react";
import { 
  Database, 
  Search, 
  Trash2, 
  RotateCcw, 
  Check, 
  Layers, 
  Clock, 
  ShieldAlert, 
  Sparkles, 
  Activity,
  FileCode,
  Archive,
  ArrowRight
} from "lucide-react";
import { SibylEntityMemory, SibylJournalEvent } from "@/lib/types";
import { sibylMemory } from "@/lib/sibyl/memoryEngine";
import { planStore } from "@/lib/inheritance/planStore";
import { NavTab } from "./Navbar";

interface MemoryInspectorViewProps {
  setActiveTab: (tab: NavTab) => void;
}

export function MemoryInspectorView({ setActiveTab }: MemoryInspectorViewProps) {
  const [entities, setEntities] = useState<SibylEntityMemory[]>([]);
  const [journalEvents, setJournalEvents] = useState<SibylJournalEvent[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [deletionSuccessNotice, setDeletionSuccessNotice] = useState<string | null>(null);

  const refresh = () => {
    if (searchQuery.trim()) {
      setEntities(sibylMemory.searchEntities(searchQuery));
    } else {
      setEntities(sibylMemory.getAllEntities());
    }
    setJournalEvents(sibylMemory.readEvents(25));
  };

  useEffect(() => {
    refresh();
    window.addEventListener("sibyl-memory-updated", refresh);
    window.addEventListener("sibyl-journal-updated", refresh);
    return () => {
      window.removeEventListener("sibyl-memory-updated", refresh);
      window.removeEventListener("sibyl-journal-updated", refresh);
    };
  }, [searchQuery]);

  const handleDeleteEntity = (id: string, name: string) => {
    sibylMemory.deleteEntityById(id);
    
    // Also reset brother payoutType to lump_sum if brother's preference was deleted
    if (name.toLowerCase() === "brother") {
      planStore.updateBeneficiary("brother", {
        payoutType: "lump_sum",
        payoutSchedule: "Immediate Lump Sum (Memory Deleted)",
        notes: "Fallback to default lump sum (context wiped).",
      });
    }

    setDeletionSuccessNotice(`Permanently deleted entity [${name}]. You can now query the agent in a fresh session to prove it forgets the preference!`);
    setTimeout(() => setDeletionSuccessNotice(null), 7000);
    refresh();
  };

  const handleClearDemoMemory = () => {
    sibylMemory.clearDemoMemory();
    planStore.updateBeneficiary("brother", {
      payoutType: "lump_sum",
      payoutSchedule: "Immediate Lump Sum",
      notes: "Standard allocation.",
    });
    setDeletionSuccessNotice("Cleared brother memory record. Agent will now default to standard lump-sum recommendation.");
    setTimeout(() => setDeletionSuccessNotice(null), 7000);
    refresh();
  };

  const hasBrotherMemory = entities.some((e) => e.name.toLowerCase() === "brother" && e.category === "preference");

  return (
    <div className="w-full max-w-[1200px] mx-auto px-6 py-10 space-y-10">
      {/* Header */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-[#e5e7eb]">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ebebff] border border-[#d1d9e4] text-[#5e5cff] text-xs font-medium">
            <Database className="w-3.5 h-3.5 text-[#a565ff]" />
            <span>Sibyl Labs Agentic Memory Infrastructure • 5 Tiers</span>
          </div>
          <h1 className="font-display-serif text-[38px] md:text-[42px] leading-[1.05] tracking-[-0.025em] text-[#1d1d20]">
            Sibyl Connectome & Memory Inspector
          </h1>
          <p className="text-[15px] leading-[1.6] text-[#505050]">
            Local-first, zero embeddings, SQLite FTS5 search. Direct inspection of all persisted entities and cold journal logs.
          </p>
        </div>

        {/* Memory Deletion Action (Core Hackathon Proof) */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleClearDemoMemory}
            className="btn-secondary text-xs px-3.5 py-2 cursor-pointer flex items-center gap-1.5 hover:border-red-300 hover:text-red-600"
            title="Reset brother preference to demonstrate memory deletion"
          >
            <RotateCcw className="w-3.5 h-3.5 text-red-500" />
            <span>Reset Demo Memory</span>
          </button>

          <button
            onClick={() => setActiveTab("dashboard")}
            className="btn-primary-pulse text-xs px-4 py-2 cursor-pointer"
          >
            <span>Return to Studio Assistant</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </section>

      {/* Success Notification Alert */}
      {deletionSuccessNotice && (
        <div className="bg-[#fff6df] border border-[#ebd7a5] text-[#1d1d20] p-4 rounded-lg text-xs font-medium flex items-center justify-between shadow-sm animate-in fade-in">
          <div className="flex items-center gap-2.5">
            <ShieldAlert className="w-4 h-4 text-[#a565ff] shrink-0" />
            <span>{deletionSuccessNotice}</span>
          </div>
          <button
            onClick={() => setActiveTab("dashboard")}
            className="text-[#5e5cff] underline font-semibold cursor-pointer shrink-0 ml-4"
          >
            Return to Studio →
          </button>
        </div>
      )}

      {/* 5-Tier Architecture Overview Strip */}
      <section className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs font-mono">
        <div className="bg-[#f7f7f7] border border-[#e5e7eb] rounded-lg p-3">
          <span className="text-[#a565ff] font-bold block">1. HOT (State)</span>
          <span className="text-[#757575] text-[11px]">set_state / get_state</span>
        </div>
        <div className="bg-[#ebebff] border border-[#d1d9e4] rounded-lg p-3">
          <span className="text-[#5e5cff] font-bold block">2. WARM (Entities)</span>
          <span className="text-[#505050] text-[11px]">{entities.length} active records</span>
        </div>
        <div className="bg-[#f7f7f7] border border-[#e5e7eb] rounded-lg p-3">
          <span className="text-[#2e7317] font-bold block">3. COLD (Journal)</span>
          <span className="text-[#757575] text-[11px]">{journalEvents.length} events logged</span>
        </div>
        <div className="bg-[#f7f7f7] border border-[#e5e7eb] rounded-lg p-3">
          <span className="text-[#505050] font-bold block">4. REFERENCE</span>
          <span className="text-[#757575] text-[11px]">Vault Rules & ABIs</span>
        </div>
        <div className="bg-[#f7f7f7] border border-[#e5e7eb] rounded-lg p-3">
          <span className="text-[#92939e] font-bold block">5. ARCHIVE</span>
          <span className="text-[#757575] text-[11px]">Recoverable records</span>
        </div>
      </section>

      {/* Main Entities Section */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-[20px] font-semibold text-[#1d1d20]">
              Tier 2: WARM Entities (Unique per Tenant)
            </h2>
            <p className="text-xs text-[#757575] mt-0.5">
              Enforced constraint: <code className="bg-[#f1f1f1] px-1 py-0.5 rounded font-mono">UNIQUE(tenant_id, category, name)</code>
            </p>
          </div>

          {/* Search Bar */}
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-[#92939e] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="FTS5 search across entities..."
              className="w-full bg-white border border-[#d1d9e4] rounded-[4px] pl-9 pr-3.5 py-1.5 text-xs text-[#1d1d20] placeholder-[#92939e] focus:outline-none focus:border-[#a565ff]"
            />
          </div>
        </div>

        {/* Entities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {entities.map((mem) => {
            const isBrotherPreference = mem.name.toLowerCase() === "brother" && mem.category === "preference";

            return (
              <div
                key={mem.id}
                className={`bg-white border rounded-lg p-5 relative transition-all shadow-[0_1px_3px_rgba(0,0,0,0.02)] flex flex-col justify-between ${
                  isBrotherPreference
                    ? "border-[#a565ff] ring-1 ring-[#a565ff]/40 bg-gradient-to-b from-white to-[#ebebff]/20"
                    : "border-[#e5e7eb]"
                }`}
              >
                <div>
                  <div className="flex items-start justify-between mb-3">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#f1f1f1] text-[#505050] text-[10px] font-mono uppercase tracking-wider font-semibold">
                      {mem.category}
                    </span>
                    <span className="text-[10px] font-mono text-[#92939e]">
                      {mem.id}
                    </span>
                  </div>

                  <h3 className="text-[17px] font-semibold text-[#1d1d20] mb-2 flex items-center gap-2">
                    <span>{mem.name}</span>
                    {isBrotherPreference && (
                      <span className="text-[10px] bg-[#a565ff] text-white px-2 py-0.5 rounded-full font-sans font-medium">
                        Load-Bearing Memory
                      </span>
                    )}
                  </h3>

                  {/* Body Details */}
                  <div className="bg-[#15110a] text-[#e8e0cf] rounded-md p-3 font-mono text-[11px] leading-relaxed overflow-x-auto my-3 border border-black/20">
                    <pre className="whitespace-pre-wrap">{JSON.stringify(mem.body, null, 2)}</pre>
                  </div>
                </div>

                {/* Footer with timestamps & Deletion Trigger */}
                <div className="pt-3 border-t border-[#f1f1f1] flex items-center justify-between text-[11px] text-[#757575]">
                  <span className="font-mono">
                    {new Date(mem.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>

                  <button
                    onClick={() => handleDeleteEntity(mem.id, mem.name)}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1.5 rounded transition-colors flex items-center gap-1 cursor-pointer font-medium"
                    title="Delete entity to test memory loss"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Cold Journal Chronological Stream */}
      <section className="space-y-4 pt-6 border-t border-[#e5e7eb]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-[#2e7317]" />
            <h2 className="text-[18px] font-semibold text-[#1d1d20]">
              Tier 3: COLD Journal Event Stream
            </h2>
          </div>
          <span className="text-xs text-[#757575] font-mono">
            Append-only audit trail
          </span>
        </div>

        <div className="bg-white border border-[#e5e7eb] rounded-lg divide-y divide-[#f1f1f1] overflow-hidden text-xs">
          {journalEvents.slice(0, 8).map((event) => (
            <div key={event.id} className="p-3.5 flex items-center justify-between gap-4 hover:bg-[#fafafa] transition-colors">
              <div className="flex items-center gap-3">
                <span className="font-mono text-[10px] text-[#757575] bg-[#f7f7f7] px-2 py-0.5 rounded border border-[#e5e7eb]">
                  {new Date(event.timestamp).toLocaleTimeString()}
                </span>
                <span className="font-medium text-[#1d1d20]">
                  {event.action}
                </span>
              </div>
              <span className="text-[10px] font-mono uppercase text-[#5e5cff] bg-[#ebebff] px-2 py-0.5 rounded-full">
                actor: {event.actor}
              </span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
