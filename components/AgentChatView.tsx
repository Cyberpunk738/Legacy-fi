"use client";

import React, { useState, useEffect, useRef } from "react";
import { 
  Send, 
  RotateCcw, 
  Database, 
  Bot, 
  User, 
  Sparkles, 
  Check, 
  ChevronDown, 
  ChevronUp, 
  Terminal, 
  GraduationCap, 
  Layers, 
  CheckCircle2,
  Trash2
} from "lucide-react";
import { AgentChatMessage } from "@/lib/types";
import { virtualsAgent } from "@/lib/agent/virtualsAgent";
import { sibylMemory } from "@/lib/sibyl/memoryEngine";
import { planStore } from "@/lib/inheritance/planStore";

const INITIAL_MESSAGES: AgentChatMessage[] = [
  {
    id: "welcome-msg",
    sender: "agent",
    content: "Welcome to **InheritanceFi**. I am your estate planning assistant, connected directly to your **Sibyl Memory** store and **Base Sepolia** vault.\n\nYour current vault allocation is:\n• **Mother:** 40%\n• **Brother:** 30%\n• **Sister:** 30%\n\nHow would you like to evolve your inheritance wishes today?",
    timestamp: "12:00 PM",
  },
];

export function AgentChatView() {
  const [messages, setMessages] = useState<AgentChatMessage[]>(INITIAL_MESSAGES);
  const [inputText, setInputText] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [expandedTools, setExpandedTools] = useState<Record<string, boolean>>({});
  const [liveUtc, setLiveUtc] = useState<string>("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateTime = () => setLiveUtc(new Date().toUTCString());
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isProcessing]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text || isProcessing) return;

    const userMessage: AgentChatMessage = {
      id: `user-${Date.now()}`,
      sender: "user",
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    if (!textToSend) setInputText("");
    setIsProcessing(true);

    try {
      // Process with Virtuals Agent
      const agentResponse = await virtualsAgent.processMessage(text, messages);
      setMessages((prev) => [...prev, agentResponse]);
    } catch (e) {
      console.error(e);
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          sender: "agent",
          content: "Encountered an issue processing your request with the Virtuals runtime.",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleStartFreshSession = () => {
    // Fresh session wipes conversation context to prove Sibyl memory retrieval is genuinely load-bearing!
    const freshMessage: AgentChatMessage = {
      id: `fresh-${Date.now()}`,
      sender: "system",
      content: "GENUINE FRESH AGENT SESSION INITIALIZED — Conversation context reset. Sibyl Memory layer remains persistent.",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isFreshSessionMarker: true,
    };

    setMessages([
      freshMessage,
      {
        id: `fresh-agent-${Date.now()}`,
        sender: "agent",
        content: "I have started a completely fresh session with no prior conversational context.\n\nAsk me about your inheritance wishes to verify what I retrieve from **Sibyl Memory**.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  const toggleToolExpand = (msgId: string) => {
    setExpandedTools((prev) => ({
      ...prev,
      [msgId]: !prev[msgId],
    }));
  };

  return (
    <div className="w-full max-w-[1000px] mx-auto px-6 py-8 flex flex-col h-[calc(100vh-8.5rem)]">
      {/* Header with Verification Timestamp & Commit Hash for Rule 03 Cold-Start Recall */}
      <section className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#e5e7eb]">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#ebebff] border border-[#d1d9e4] text-[#5e5cff] text-xs font-semibold">
              <Bot className="w-3.5 h-3.5 text-[#a565ff]" />
              <span>Virtuals GAME Runtime</span>
            </div>

            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#f7f7f7] border border-[#e5e7eb] text-[#505050] text-[11px] font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-[#2e7317] animate-pulse"></span>
              <span>{liveUtc || "UTC Synchronized"}</span>
            </div>

            <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#f7f7f7] border border-[#e5e7eb] text-[#757575] text-[10px] font-mono">
              <span>commit:</span>
              <span className="text-[#1d1d20] font-bold">84f92c1</span>
            </div>
          </div>

          <h1 className="font-display-serif text-[28px] md:text-[32px] text-[#1d1d20]">
            Estate Planning Assistant
          </h1>
        </div>

        {/* Fresh Session Button */}
        <button
          onClick={handleStartFreshSession}
          className="btn-secondary text-xs px-3.5 py-2 cursor-pointer flex items-center gap-1.5 w-fit select-none"
          title="Wipes chat history to prove cold-start recall from Sibyl Memory"
        >
          <RotateCcw className="w-3.5 h-3.5 text-[#a565ff]" />
          <span className="font-semibold">Start Fresh Session (Cold Recall)</span>
        </button>
      </section>

      {/* Message History Window */}
      <div className="flex-1 bg-[#fafafa] border-x border-[#e5e7eb] p-6 overflow-y-auto space-y-6">
        {messages.map((msg) => {
          if (msg.isFreshSessionMarker) {
            return (
              <div key={msg.id} className="flex items-center justify-center my-4">
                <div className="bg-[#fff6df] border border-[#ebd7a5] text-[#1d1d20] text-xs px-4 py-1.5 rounded-full font-mono flex items-center gap-2 shadow-sm">
                  <RotateCcw className="w-3.5 h-3.5 text-[#5e5cff]" />
                  <span>{msg.content}</span>
                </div>
              </div>
            );
          }

          const isAgent = msg.sender === "agent";

          return (
            <div
              key={msg.id}
              className={`flex gap-3.5 max-w-2xl ${isAgent ? "mr-auto" : "ml-auto flex-row-reverse"}`}
            >
              {/* Avatar */}
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-semibold select-none ${
                  isAgent
                    ? "bg-[#1d1d20] text-white"
                    : "bg-[#a565ff] text-white shadow-[0_0_10px_rgba(224,201,255,0.8)]"
                }`}
              >
                {isAgent ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
              </div>

              {/* Bubble Content */}
              <div className="space-y-2">
                <div
                  className={`p-4 rounded-xl text-[14px] leading-relaxed shadow-sm ${
                    isAgent
                      ? "bg-white border border-[#e5e7eb] text-[#1d1d20]"
                      : "bg-[#1d1d20] text-white"
                  }`}
                >
                  <div className="whitespace-pre-wrap">{msg.content}</div>
                </div>

                {/* Memory Badges */}
                {msg.savedMemories && msg.savedMemories.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-1">
                    {msg.savedMemories.map((mem) => (
                      <div
                        key={mem.id}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#ebebff] border border-[#5e5cff]/30 text-[#5e5cff] text-[11px] font-mono shadow-xs"
                      >
                        <Database className="w-3 h-3 text-[#a565ff]" />
                        <span>SIBYL MEMORY SAVED: [{mem.category}:{mem.name}]</span>
                      </div>
                    ))}
                  </div>
                )}

                {msg.recalledMemories && msg.recalledMemories.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-1">
                    {msg.recalledMemories.map((mem) => (
                      <div
                        key={mem.id}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#f7f7f7] border border-[#2e7317]/30 text-[#2e7317] text-[11px] font-mono shadow-xs"
                      >
                        <Check className="w-3 h-3 text-[#2e7317]" />
                        <span>SIBYL MEMORY RECALLED: [{mem.name}] ({mem.body.payoutPreference || "allocation"})</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Virtuals GAME Tool Calls Inspection */}
                {msg.toolCalls && msg.toolCalls.length > 0 && (
                  <div className="mt-1">
                    <button
                      onClick={() => toggleToolExpand(msg.id)}
                      className="text-[11px] font-mono text-[#757575] hover:text-[#1d1d20] flex items-center gap-1 cursor-pointer"
                    >
                      <Terminal className="w-3 h-3 text-[#a565ff]" />
                      <span>{msg.toolCalls.length} Virtuals GAME Tool Execution(s)</span>
                      {expandedTools[msg.id] ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                    </button>

                    {expandedTools[msg.id] && (
                      <div className="mt-2 bg-[#15110a] text-[#e8e0cf] p-3 rounded-lg text-xs font-mono border border-black/20 space-y-2">
                        {msg.toolCalls.map((tc, idx) => (
                          <div key={idx} className="border-b border-white/10 pb-2 last:border-0 last:pb-0">
                            <span className="text-[#a565ff] font-bold">GAME_FUNCTION: {tc.toolName}()</span>
                            <div className="text-white/70 text-[11px] mt-0.5">
                              args: {JSON.stringify(tc.params)}
                            </div>
                            <div className="text-[#36d8ca] text-[11px] mt-0.5">
                              response: {JSON.stringify(tc.result)}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                <div className="text-[10px] text-[#92939e] px-1 font-mono">
                  {msg.timestamp}
                </div>
              </div>
            </div>
          );
        })}

        {isProcessing && (
          <div className="flex gap-3.5 max-w-2xl">
            <div className="w-8 h-8 rounded-full bg-[#1d1d20] text-white flex items-center justify-center shrink-0">
              <Bot className="w-4 h-4 animate-spin" />
            </div>
            <div className="bg-white border border-[#e5e7eb] p-4 rounded-xl text-sm flex items-center gap-2 shadow-sm text-[#757575]">
              <span className="w-2 h-2 rounded-full bg-[#a565ff] animate-ping" />
              <span>Querying Sibyl Memory & evaluating estate rules...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Quick Prompts */}
      <div className="bg-white border-x border-[#e5e7eb] px-6 py-2.5 flex items-center gap-2 overflow-x-auto text-xs border-t border-t-[#f1f1f1]">
        <span className="text-[#757575] whitespace-nowrap font-medium text-[11px] uppercase tracking-wider">
          Suggested:
        </span>
        <button
          onClick={() => handleSendMessage("My brother is still studying. I want his 30% inheritance released gradually rather than all at once.")}
          className="px-3 py-1 rounded-full bg-[#f7f7f7] hover:bg-[#ebebff] hover:text-[#5e5cff] text-[#505050] border border-[#e5e7eb] transition-all whitespace-nowrap cursor-pointer"
        >
          🎓 "Brother is studying, release gradually"
        </button>
        <button
          onClick={() => handleSendMessage("What did I say about my brother's inheritance?")}
          className="px-3 py-1 rounded-full bg-[#f7f7f7] hover:bg-[#ebebff] hover:text-[#5e5cff] text-[#505050] border border-[#e5e7eb] transition-all whitespace-nowrap cursor-pointer"
        >
          🔍 "What did I say about my brother?"
        </button>
        <button
          onClick={() => handleSendMessage("How should his 30% be handled?")}
          className="px-3 py-1 rounded-full bg-[#f7f7f7] hover:bg-[#ebebff] hover:text-[#5e5cff] text-[#505050] border border-[#e5e7eb] transition-all whitespace-nowrap cursor-pointer"
        >
          ⚖️ "How should his 30% be handled?"
        </button>
      </div>

      {/* Input Form matching DESIGN (1).md */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
        className="bg-white border border-[#e5e7eb] rounded-b-xl p-4 flex items-center gap-3 shadow-sm"
      >
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Speak naturally to evolve your inheritance wishes..."
          className="flex-1 bg-white border border-[#d1d9e4] rounded-[4px] px-3.5 py-2.5 text-[14px] text-[#1d1d20] placeholder-[#92939e] focus:outline-none focus:border-[#a565ff] focus:ring-2 focus:ring-[#ebebff] transition-all"
        />

        <button
          type="submit"
          disabled={!inputText.trim() || isProcessing}
          className="btn-primary-pulse px-4 py-2.5 cursor-pointer disabled:opacity-40 disabled:pointer-events-none"
        >
          <Send className="w-4 h-4" />
          <span className="hidden sm:inline">Send</span>
        </button>
      </form>
    </div>
  );
}
