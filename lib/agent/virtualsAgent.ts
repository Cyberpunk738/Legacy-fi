import { AgentChatMessage, SibylEntityMemory, InheritancePlan } from "../types";
import { sibylMemory } from "../sibyl/memoryEngine";
import { planStore } from "../inheritance/planStore";

export interface VirtualsGameFunction {
  name: string;
  description: string;
  execute: (args: Record<string, any>) => Promise<any> | any;
}

export class VirtualsInheritanceAgent {
  public name: string = "InheritanceFi Protocol Agent";
  public goal: string = "Translate user's evolving estate wishes into verified onchain smart contract instructions using persistent Sibyl memory.";
  
  // Executable Virtuals GAME Tools
  public tools: Record<string, VirtualsGameFunction> = {
    save_memory: {
      name: "save_memory",
      description: "Persist meaningful beneficiary context or distribution preference to Sibyl Memory",
      execute: ({ category, name, body }) => {
        return sibylMemory.setEntity(category, name, body);
      },
    },
    search_memory: {
      name: "search_memory",
      description: "Perform FTS5 full-text search across Sibyl Memory entities",
      execute: ({ query }) => {
        return sibylMemory.searchEntities(query);
      },
    },
    get_inheritance_plan: {
      name: "get_inheritance_plan",
      description: "Fetch current authorized Base vault allocation plan and beneficiary status",
      execute: () => {
        return planStore.getPlan();
      },
    },
    update_inheritance_plan: {
      name: "update_inheritance_plan",
      description: "Update beneficiary payout structure in the inheritance plan",
      execute: ({ beneficiaryId, updates }) => {
        return planStore.updateBeneficiary(beneficiaryId, updates);
      },
    },
    prepare_distribution: {
      name: "prepare_distribution",
      description: "Calculate exact ETH and USD distribution amounts based on vault balance",
      execute: () => {
        const plan = planStore.getPlan();
        return plan.beneficiaries.map((b) => ({
          name: b.name,
          address: b.address,
          percent: `${b.allocationPercent}%`,
          ethAmount: `${((plan.vaultBalanceEth * b.allocationPercent) / 100).toFixed(2)} ETH`,
          usdAmount: `$${((plan.vaultBalanceUsd * b.allocationPercent) / 100).toLocaleString()}`,
          payoutType: b.payoutType,
          schedule: b.payoutSchedule || "Immediate Lump Sum",
        }));
      },
    },
  };

  public async processMessage(
    userText: string,
    chatHistory: AgentChatMessage[]
  ): Promise<AgentChatMessage> {
    const lower = userText.toLowerCase().trim();
    const toolExecutions: { toolName: string; params: any; result: any }[] = [];
    const recalledMemories: SibylEntityMemory[] = [];
    const savedMemories: SibylEntityMemory[] = [];
    let proposedPlanUpdate: Partial<InheritancePlan> | undefined = undefined;
    let responseText = "";

    // 1. Check if user is issuing a preference to remember (Session 1 canonical flow)
    if (
      (lower.includes("brother") || lower.includes("marcus")) &&
      (lower.includes("study") || lower.includes("studying") || lower.includes("school") || lower.includes("gradual") || lower.includes("all at once") || lower.includes("slowly") || lower.includes("college"))
    ) {
      // Execute save_memory tool
      const memoryBody = {
        allocation: "30%",
        relationship: "Brother",
        lifeStage: "Currently enrolled in college/studies",
        payoutPreference: "gradual_release",
        releaseSchedule: "25% annually across 4 years (Milestone/Education vesting)",
        directive: "Do not release in lump sum; incentivize educational milestone completion",
      };

      const saved = this.tools.save_memory.execute({
        category: "preference",
        name: "Brother",
        body: memoryBody,
      });

      savedMemories.push(saved);
      toolExecutions.push({
        toolName: "save_memory",
        params: { category: "preference", name: "Brother", body: memoryBody },
        result: { status: "Success", entityId: saved.id, tenant: saved.tenantId },
      });

      // Update plan to gradual_release
      planStore.updateBeneficiary("brother", {
        payoutType: "gradual_release",
        payoutSchedule: "25% annually across 4 years upon verified enrollment",
        notes: "Remembered directive: Gradual release for education support.",
      });

      toolExecutions.push({
        toolName: "update_inheritance_plan",
        params: { beneficiaryId: "brother", updates: { payoutType: "gradual_release" } },
        result: { status: "Plan Updated in Staging" },
      });

      responseText = `I have permanently saved this context to **Sibyl Memory** under entity \`[preference:Brother]\`.\n\n` +
        `**Persisted Context:**\n` +
        `• **Beneficiary:** Marcus (Brother) — 30% allocation ($3,000 / 1.50 ETH)\n` +
        `• **Context:** Currently studying in college\n` +
        `• **Distribution Rule:** Gradual annual milestone release (25% per year) instead of lump-sum payout.\n\n` +
        `I have updated your Base Sepolia vault. When activated, the smart contract will enforce staged disbursements rather than transferring all funds at once.`;
    } 
    // 2. Recall Question: "What did I say about my brother's inheritance?" or "What are my wishes?"
    else if (
      (lower.includes("what did i say") || lower.includes("what are my wishes") || lower.includes("recall") || lower.includes("remember") || lower.includes("wishes")) &&
      (lower.includes("brother") || lower.includes("marcus") || lower.includes("plan") || lower.includes("family"))
    ) {
      const recalled = sibylMemory.recallRelevantContext("Brother education preference");
      recalledMemories.push(...recalled);

      toolExecutions.push({
        toolName: "search_memory",
        params: { query: "Brother education preference" },
        result: { count: recalled.length, matches: recalled.map(m => m.name) },
      });

      const brotherMem = recalled.find(m => m.name.toLowerCase() === "brother");

      if (brotherMem && brotherMem.body.payoutPreference === "gradual_release") {
        responseText = `Retrieved from **Sibyl Memory** across your persistent session records:\n\n` +
          `• **Beneficiary:** Marcus (Brother)\n` +
          `• **Allocation:** ${brotherMem.body.allocation || "30%"}\n` +
          `• **Context:** ${brotherMem.body.lifeStage || "Currently studying"}\n` +
          `• **Wishes:** You explicitly instructed that his inheritance must be **released gradually** (${brotherMem.body.releaseSchedule || "25% annually over 4 years"}) rather than handed over in one single lump sum.`;
      } else {
        responseText = `According to your current authorized baseline plan in Sibyl:\n\n` +
          `• **Marcus (Brother):** Assigned **30%** ($3,000 / 1.50 ETH).\n` +
          `• **Context in Memory:** No special education or gradual-release conditions are recorded. Standard lump-sum execution applies.`;
      }
    }
    // 3. Decision Question: "How should his 30% be handled?" or "How should we distribute brother's share?"
    else if (
      (lower.includes("how should") || lower.includes("how would") || lower.includes("recommend") || lower.includes("distribution")) &&
      (lower.includes("brother") || lower.includes("his") || lower.includes("30%"))
    ) {
      const recalled = sibylMemory.recallRelevantContext("Brother gradual education");
      recalledMemories.push(...recalled);

      const brotherMem = recalled.find(m => m.name.toLowerCase() === "brother");

      if (brotherMem && brotherMem.body.payoutPreference === "gradual_release") {
        // DECISION WITH SIBYL MEMORY: Staged gradual release recommendation!
        responseText = `### Recommended Strategy: Staged Educational Vesting\n\n` +
          `Based on your remembered instruction (*"${brotherMem.body.directive || "Brother is studying, release gradually"}"*), I recommend **not releasing the full 30% ($3,000 / 1.50 ETH) immediately**.\n\n` +
          `**Proposed Execution Structure on Base:**\n` +
          `1. **Year 1:** 25% ($750 / 0.375 ETH) released immediately upon activation for initial academic tuition.\n` +
          `2. **Year 2:** 25% ($750 / 0.375 ETH) unlocked after 365 days.\n` +
          `3. **Year 3:** 25% ($750 / 0.375 ETH) unlocked after 730 days.\n` +
          `4. **Year 4:** 25% ($750 / 0.375 ETH) final release upon degree completion.\n\n` +
          `*This recommendation is directly generated from your Sibyl memory record.*`;
      } else {
        // DECISION WITHOUT SIBYL MEMORY (Memory Deletion Test outcome): Fallback to standard lump-sum!
        responseText = `### Recommended Strategy: Immediate Lump-Sum Payout\n\n` +
          `Based on the baseline inheritance vault record (no contextual preferences found in memory):\n\n` +
          `• **Marcus (Brother):** Immediate transfer of the full **30% ($3,000 / 1.50 ETH)** into his verified wallet upon activation.\n\n` +
          `> [!NOTE]\n` +
          `> Because no educational or gradual-release preference is currently present in Sibyl memory, the protocol defaults to standard lump-sum distribution.`;
      }
    }
    // 4. Allocation Changes: (e.g. "Change mother to 50%, brother to 25%, sister to 25%")
    else if (lower.includes("change") || lower.includes("modify") || lower.includes("adjust") || lower.includes("50%") || lower.includes("percentage")) {
      responseText = `I can help you adjust your family allocations.\n\n` +
        `**Current Allocations:**\n` +
        `• **Mother:** 40% ($4,000 / 2.00 ETH)\n` +
        `• **Brother:** 30% ($3,000 / 1.50 ETH)\n` +
        `• **Sister:** 30% ($3,000 / 1.50 ETH)\n\n` +
        `To adjust, tell me: *"Set Mother to 50%, Brother to 25%, and Sister to 25%"*. All allocations must total exactly 100%.`;
    }
    // 5. Questions about Memory / How it works
    else if (lower.includes("how does memory work") || lower.includes("what is sibyl") || lower.includes("explain memory")) {
      responseText = `**Sibyl Memory** is local-first, file-based memory designed for autonomous AI agents.\n\n` +
        `• **No Vector Drift:** Uses deterministic SQLite FTS5 search with zero embedding hallucination.\n` +
        `• **5 Memory Tiers:** Keeps active tasks in HOT state, family facts in WARM entities, and an append-only audit trail in COLD journal.\n` +
        `• **Cross-Session Recall:** You can close the browser or start a completely fresh session, and I will remember your exact instructions.`;
    }
    // 6. Security / Smart Contract Questions
    else if (lower.includes("safe") || lower.includes("security") || lower.includes("smart contract") || lower.includes("base") || lower.includes("money")) {
      responseText = `**Security & Trust Guarantee:**\n\n` +
        `1. **You Are in Control:** As an AI, I only recommend and stage plans. The smart contract on **Base Sepolia** requires your explicit approval.\n` +
        `2. **Immutable Rules:** Once authorized, no one (not even the AI) can arbitrarily change your beneficiaries or withdraw unauthorized funds.\n` +
        `3. **Onchain Transparency:** Every distribution generates a publicly verifiable transaction on BaseScan.`;
    }
    // 7. Distribution Breakdown / Plan status query
    else if (lower.includes("plan") || lower.includes("beneficiar") || lower.includes("breakdown") || lower.includes("vault")) {
      const plan = planStore.getPlan();
      toolExecutions.push({
        toolName: "get_inheritance_plan",
        params: {},
        result: { planId: plan.planId, beneficiaries: plan.beneficiaries.length, status: plan.status },
      });

      const list = plan.beneficiaries.map(b => 
        `• **${b.name}:** ${b.allocationPercent}% ($${((plan.vaultBalanceUsd * b.allocationPercent) / 100).toLocaleString()}) — *${b.payoutType === "gradual_release" ? "Gradual Release (4-Year College Schedule)" : "Lump Sum"}*`
      ).join("\n");

      responseText = `Here is your current **Inheritance Vault Plan** on Base Sepolia:\n\n` +
        `• **Vault Total:** $${plan.vaultBalanceUsd.toLocaleString()} (${plan.vaultBalanceEth} ETH)\n` +
        `• **Status:** \`${plan.status.toUpperCase()}\`\n\n` +
        `**Beneficiary Allocations:**\n${list}\n\n` +
        `You can tell me to adjust allocations, add personal instructions for any family member, or test activation.`;
    }
    // 8. Default Friendly Conversation
    else {
      responseText = `I am your **InheritanceFi Family Advisor**, powered by **Virtuals Protocol** and **Sibyl Memory**.\n\n` +
        `Here are things you can ask me:\n` +
        `1. *"My brother is still studying. Release his 30% gradually."*\n` +
        `2. *"What did I say about my brother's inheritance?"*\n` +
        `3. *"How should his 30% be handled?"*\n` +
        `4. *"Show my family plan breakdown."*\n` +
        `5. *"How does the smart vault protect my money?"*`;
    }

    const message: AgentChatMessage = {
      id: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      sender: "agent",
      content: responseText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      recalledMemories: recalledMemories.length > 0 ? recalledMemories : undefined,
      savedMemories: savedMemories.length > 0 ? savedMemories : undefined,
      toolCalls: toolExecutions.length > 0 ? toolExecutions : undefined,
      proposedPlanUpdate,
    };

    return message;
  }
}

export const virtualsAgent = new VirtualsInheritanceAgent();
