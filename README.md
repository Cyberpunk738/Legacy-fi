# 🏛️ InheritanceFi (LegacyFi)
> **Your inheritance plan that remembers not only what you own, but what you wanted.**

An autonomous estate planning and digital inheritance protocol built for the **SIBYL Labs Hackathon 2026**.

InheritanceFi pairs an AI assistant that remembers your family's personal life situations using **Sibyl Memory**, coordinates smart estate directives with **Virtuals Protocol**, and executes safe onchain payouts on the **Base** blockchain.

---

## 📋 Hackathon Rule Compliance & Submission Checklist

### 1. What It Does
InheritanceFi solves the rigidity of traditional wills and crypto dead-man switches. Instead of forcing immediate, irreversible lump-sum transfers, InheritanceFi uses persistent agentic memory to capture evolving family context (e.g. *"My brother is still in college"*) and automatically translates those wishes into smart milestone vesting schedules (e.g. 25% annual educational tranches over 4 college years) locked inside a verified Base Sepolia vault contract.

### 2. Where Memory is Load-Bearing (P0 Gate Litmus Test)
Sibyl Memory is on the critical execution path of InheritanceFi. The system behaves completely differently when memory is present versus when it is deleted:

| Step | User Action | System Behavior |
| :--- | :--- | :--- |
| **Write (Persist)** | *"My brother is studying. Release his 30% gradually."* | Written to Sibyl WARM entity `[preference:Brother]` in [`lib/sibyl/memoryEngine.ts`](file:///c:/Users/cyberdev/Desktop/legacyfi/lib/sibyl/memoryEngine.ts) via tool `save_memory`. |
| **Cold-Start Recall** | Start a fresh session with **0 prior chat messages**. User asks: *"What are my wishes?"* | Agent queries Sibyl FTS5 engine and recalls that brother Marcus is in college in [`lib/agent/virtualsAgent.ts`](file:///c:/Users/cyberdev/Desktop/legacyfi/lib/agent/virtualsAgent.ts). |
| **Decision Shift** | User asks: *"How should brother's 30% be handled?"* | **With Memory:** Recommends **4-year staged education release** (25%/yr).<br>**Without Memory (Deleted):** Defaults to **immediate lump sum**. |
| **The Deletion Test** | Delete `[preference:Brother]` in the Sibyl Inspector. | Agent forgets educational context and falls back to standard lump-sum payout, proving memory is load-bearing. |

#### 📂 Critical Path Code References:
* **Memory Engine (5 Tiers & SQLite FTS5 Search)**: [`lib/sibyl/memoryEngine.ts`](file:///c:/Users/cyberdev/Desktop/legacyfi/lib/sibyl/memoryEngine.ts)
* **Memory Server API & MCP Manifest**: [`app/api/sibyl/route.ts`](file:///c:/Users/cyberdev/Desktop/legacyfi/app/api/sibyl/route.ts)
* **Agent Decision Shift Logic**: [`lib/agent/virtualsAgent.ts`](file:///c:/Users/cyberdev/Desktop/legacyfi/lib/agent/virtualsAgent.ts#L151-L177)
* **Inheritance Plan State Machine**: [`lib/inheritance/planStore.ts`](file:///c:/Users/cyberdev/Desktop/legacyfi/lib/inheritance/planStore.ts)

### 3. Partner Stacks & Where Used
* 🔵 **Base Network (Ethereum L2) — Multiplier Partner**:
  * **Solidity Smart Contract**: [`contracts/src/InheritanceVault.sol`](file:///c:/Users/cyberdev/Desktop/legacyfi/contracts/src/InheritanceVault.sol) deployed on **Base Sepolia (Chain ID: `84532`)**.
  * **Viem Client & Wallet Integration**: [`lib/base/contractClient.ts`](file:///c:/Users/cyberdev/Desktop/legacyfi/lib/base/contractClient.ts) supports live MetaMask/Coinbase Wallet signing, onchain testnet ETH deposits, and verifiable block receipts on [BaseScan Sepolia](https://sepolia.basescan.org).
* 🤖 **Virtuals Protocol GAME — Multiplier Partner**:
  * **GAME Tool Registry**: `save_memory`, `search_memory`, `get_inheritance_plan`, `update_inheritance_plan`, `prepare_distribution` defined and executed in [`lib/agent/virtualsAgent.ts`](file:///c:/Users/cyberdev/Desktop/legacyfi/lib/agent/virtualsAgent.ts).
  * **Agent Chat API**: [`app/api/chat/route.ts`](file:///c:/Users/cyberdev/Desktop/legacyfi/app/api/chat/route.ts).

### 4. How Memory Made This Possible
Estate planning is not a one-time form; it is an evolving life document. Traditional software cannot capture qualitative, long-term human intentions across separate sessions over time. Sibyl Memory's local-first, zero-embedding FTS5 architecture provides deterministic, drift-free persistence across sessions. This allows an AI assistant to bridge human family intentions and immutable blockchain execution safely.

### 5. Prior Work Declaration
This repository was built entirely from scratch during the **SIBYL Labs Hackathon 2026** build window. All code, design tokens, smart contracts, and agent tools are original work by Legacy Labs under the MIT License.

---

## 🚀 Quick Start Guide (Run Locally)

### 1. Requirements
* [Node.js](https://nodejs.org/) version 18 or higher.

### 2. Install Dependencies
```bash
npm install
```

### 3. Start Development Server
```bash
npm run dev
```

Open your browser at:  
👉 **[http://localhost:3000](http://localhost:3000)**

---

## 🎯 Navigating the Application

1. **Overview (Landing Page)**: Editorial showcase explaining the core problem, live simulator before/after memory, feature pillars, and FAQ.
2. **Family Plan (Dashboard)**: Customize estate value, add beneficiaries, and choose from starter templates (Family Trust, Child Education Trust, or Blank Slate).
3. **Family Assistant (Agent Chat)**: Chat naturally with the AI advisor to set directives and test cross-session memory recall.
4. **Sibyl Memory (Inspector)**: Peek inside the 5 memory tiers (HOT, WARM, COLD, REFERENCE, ARCHIVE) with live FTS5 search and deletion controls.
5. **Vault & Payouts (Base Execution)**: Connect a real Web3 wallet, deposit testnet ETH, and execute smart contract payouts on Base Sepolia with verified BaseScan receipts.

---

## 📜 License
MIT License. See [LICENSE](file:///c:/Users/cyberdev/Desktop/legacyfi/LICENSE) for details.
#
