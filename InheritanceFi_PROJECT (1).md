# InheritanceFi — Project Plan

## 1. Project Overview

**InheritanceFi** is a hackathon MVP for the SIBYL Labs Hackathon.

It is a memory-powered digital inheritance assistant that helps a user define and evolve their inheritance wishes, remembers those wishes across sessions using **Sibyl Memory**, and uses **Base** to represent the onchain execution layer.

**Core idea:**

> Your inheritance plan should remember not only what you own, but what you wanted.

The project is a **10-day hackathon prototype**, not a production inheritance/legal system.

---

## 2. Hackathon Objective

The most important requirement is:

> **Sibyl Memory must be load-bearing.**

The demo must clearly prove:

1. We persist meaningful user context.
2. A fresh session retrieves that context.
3. The retrieved memory changes the agent's decision, recommendation, or action.

The project should also use:

- **Base** for real onchain execution.
- **Virtuals Protocol** for the agent/runtime layer.

Both partner stacks must perform real work if we want the hackathon multiplier.

---

## 3. Product Concept

A user creates an inheritance plan containing beneficiaries and allocations.

Instead of relying only on a static form, the user can talk naturally with an inheritance agent.

Example:

> "Give my mother 40%, my brother 30%, and my sister 30%. My brother is still in school, so I don't want him receiving his inheritance all at once."

The agent:

- understands the instruction,
- stores important context in Sibyl,
- updates the user's inheritance plan,
- recalls the information in future sessions,
- uses it when generating recommendations,
- and eventually prepares/executes the authorized plan through a Base smart contract.

---

# 4. Core Demo Story

The entire product should be understandable through one simple story.

### Session 1 — Create a plan

User creates:

- Mother — 40%
- Brother — 30%
- Sister — 30%

Then tells the agent:

> "My brother is still studying. Release his inheritance gradually."

Sibyl persists the relevant memory.

### Fresh Session — Recall

Start a genuinely fresh agent session.

Ask:

> "What are my wishes for my brother's inheritance?"

The agent retrieves the Sibyl memory and answers using the previous context.

### Decision changes

Ask:

> "How should his 30% be handled?"

The agent recommends gradual/staged release because of the remembered instruction.

### Execution

Use a clearly labeled **Demo Activation** flow.

The agent prepares the authorized inheritance distribution.

Base testnet smart contract executes the distribution.

---

# 5. What Makes Sibyl Load-Bearing

Do NOT use Sibyl only to save conversation logs.

Persist information that materially changes the inheritance outcome.

### Example memories

```text
Beneficiary:
Brother

Allocation:
30%

Context:
Brother is currently studying.

User preference:
Brother's inheritance should be released gradually.

User instruction:
Education should be prioritized.
```

### Fresh-session test

Without the memory:

> Agent only knows Brother = 30%.

With the memory:

> Agent knows Brother = 30% + education context + gradual-release preference.

Therefore the recommended distribution changes.

This is the central proof of the project.

---

# 6. Memory Deletion Test

The submission asks:

> What breaks when memory is deleted?

Our product should have a clear answer.

### With memory

The agent recalls:

- beneficiary context,
- previous wishes,
- changes to allocations,
- distribution preferences.

It produces a personalized inheritance plan.

### Without memory

The agent forgets the user's evolving wishes and context.

It falls back to the basic/static inheritance allocation and cannot apply the user's later instructions.

### Demo option

If practical, provide a small developer/demo control:

**Clear demo memory**

Then repeat the same fresh-session question and show that the agent no longer knows the brother's education preference.

This should be used only for the hackathon demonstration.

---

# 7. Product Scope — MVP ONLY

## Must Have

### User

- Create inheritance plan.
- Add beneficiaries.
- Set percentage allocations.
- View total allocation.
- Chat with inheritance agent.
- Update wishes through natural language.
- View current plan.
- Start a fresh session.
- See memories used by the agent.
- Trigger a clearly labeled demo inheritance activation.
- Execute/view a Base testnet transaction.

### Agent

- Understand inheritance instructions.
- Save important context to Sibyl.
- Retrieve relevant Sibyl memories.
- Use retrieved memory when making recommendations.
- Update the user's plan.
- Prepare a distribution action.
- Explain why a decision was made.

### Sibyl

Must actually be used for:

- persistence,
- recall,
- search/retrieval,
- context that changes decisions.

### Base

Must actually be used for:

- inheritance vault/contract,
- testnet funds or simulated assets,
- distribution transaction.

### Virtuals

Must actually be used for the agent/runtime functionality we claim in the submission.

Keep the integration minimal and functional. Do not build an unnecessary multi-agent system.

---

# 8. Explicitly NOT in the MVP

Do NOT build these unless they become trivial and clearly useful:

- Real-world death detection.
- Government death certificate APIs.
- Insurance integrations.
- Legal will replacement.
- Production identity verification.
- Real estate inheritance.
- Multi-chain support.
- DAO.
- Token launch.
- Yield farming.
- Complex DeFi strategies.
- Social network.
- Mobile app.
- Multiple autonomous agents.
- Custom AI model training.
- Complex RAG infrastructure.
- Full production compliance system.
- Real-money mainnet inheritance.
- Complex executor/guardian networks.

### Death / activation rule

For the hackathon, use:

> **Demo Activation / Simulated Inheritance Event**

Do NOT claim that AI can reliably determine whether a person is dead.

In a production version, activation would require proper external/legal/authorized verification.

---

# 9. Architecture

```text
                    INHERITANCEFI
                         |
        +----------------+----------------+
        |                                 |
     Frontend                           Agent
     Next.js                         Virtuals
        |                                 |
        |                         +-------+-------+
        |                         |               |
        |                      Sibyl           Tools
        |                      Memory            |
        |                         |       +-------+-------+
        |                         |       |       |       |
        |                         |      Plan   Verify  Execute
        |                         |                       |
        +-------------------------+-----------------------+
                                                        |
                                                      Base
                                                        |
                                             Inheritance Vault
                                                        |
                                                Beneficiaries
```

---

# 10. Technology Stack

## Frontend

- Next.js
- TypeScript
- Tailwind CSS
- shadcn/ui or similarly lightweight component system

## Agent

- Virtuals Protocol
- One inheritance agent
- Minimal workers/functions needed for the MVP

Do not create multiple agents unless the official Virtuals requirements make it necessary.

## Memory

- Sibyl Memory
- Use the official Sibyl integration/SDK supported by the chosen agent implementation.

## Blockchain

- Solidity
- Base Sepolia for the hackathon demo
- viem
- wagmi if wallet interaction is required

## Development

- Claude Code / Antigravity
- GitHub
- Sibyl connected to the coding agent where useful

---

# 11. Agent Responsibilities

The agent should have a small set of clear capabilities.

### Memory functions

```text
save_memory
search_memory
recall_relevant_context
```

### Inheritance functions

```text
get_inheritance_plan
update_inheritance_plan
prepare_distribution
```

### Demo execution

```text
simulate_activation
execute_distribution
```

Do not expose arbitrary blockchain functions to the LLM.

The agent should only call safe, explicitly defined functions.

---

# 12. Important Safety Boundary

The AI should NOT be the final authority over money.

### AI does:

- understand user wishes,
- remember context,
- explain plans,
- prepare recommendations,
- coordinate actions.

### Smart contract does:

- enforce the authorized allocation,
- enforce predefined rules,
- execute the actual transfer.

The AI must never invent a new beneficiary or arbitrarily change the user's authorized distribution.

Before activation, the user explicitly approves the plan.

After activation, the contract follows the authorized rules.

---

# 13. Smart Contract MVP

Create a simple `InheritanceVault`.

Conceptual data:

```text
owner
beneficiaries
allocations
authorizedPlan
activationStatus
```

Core actions:

```text
createPlan()
updatePlan()
activateInheritance()
executeDistribution()
```

Keep the contract simple.

The goal is to demonstrate the concept, not build a production inheritance protocol.

Use Base Sepolia.

---

# 14. Frontend Pages

Keep the app small.

## Dashboard

Shows:

- total vault value
- beneficiaries
- allocation percentages
- plan status
- next/demo activation status

## Agent

Chat interface.

Shows:

- user messages
- agent responses
- memory saved/recalled indicators

## Memory

Optional but strongly recommended.

Show:

```text
MEMORY RECALLED

Brother
30% allocation

Education
Brother is currently studying

Distribution preference
Release gradually
```

This makes the Sibyl value obvious to judges.

## Vault / Execution

Shows:

- authorized distribution
- beneficiaries
- amounts
- demo activation
- Base transaction
- transaction status

---

# 15. UI Principle

The interface should feel like a polished fintech/wealth product.

Avoid making it look like a generic AI chatbot.

The inheritance plan should be the primary object.

The agent should feel like an assistant operating inside the legacy vault.

Prioritize:

- clean typography,
- clear financial hierarchy,
- simple cards,
- obvious statuses,
- subtle animations,
- excellent empty/loading/error states.

Do not spend days on decorative animations.

---

# 16. Demo Flow

Target demo duration: **3–5 minutes.**

### Step 1

Open dashboard.

Show:

```text
Legacy Vault
$10,000

Mother       40%
Brother      30%
Sister       30%
```

### Step 2

Tell agent:

> "My brother is still studying. I want his inheritance released gradually."

Show:

```text
Sibyl Memory Saved
```

### Step 3

Start a genuinely fresh session.

Ask:

> "What did I say about my brother?"

Agent recalls it.

Show:

```text
Sibyl Memory Recalled
```

### Step 4

Ask:

> "How should his inheritance be handled?"

Agent changes its recommendation because of the remembered context.

### Step 5

Show the current authorized plan.

### Step 6

Click:

> **Simulate Inheritance Activation**

Clearly label this as a hackathon demo.

### Step 7

Execute distribution through Base Sepolia.

Show transaction confirmation.

### Step 8

Optional:

Clear/delete the relevant memory.

Start another fresh session.

Ask the same question.

Show that the agent no longer knows the education/gradual-release preference.

This is the strongest proof that memory is load-bearing.

---

# 17. Submission Preparation

The submission form should be designed for from the beginning.

## Memory walkthrough

Eventually answer in exactly three parts:

```text
Persist:
[What meaningful context do we save?]

Recall (fresh session):
[How does the fresh session retrieve it?]

Changes the agent's decision by:
[Exactly what changes because of memory?]
```

Our strongest example:

```text
Persist:
The user's beneficiary allocations and evolving wishes,
including that their brother is studying and should receive
his inheritance gradually.

Recall (fresh session):
A new agent session retrieves the brother's allocation,
education context, and gradual-release preference from Sibyl.

Changes the agent's decision by:
The agent recommends staged distribution instead of
treating the brother's 30% as an immediate lump-sum payment.
```

## What breaks when memory is deleted?

Core answer:

```text
Without memory, the agent forgets the user's evolving
inheritance wishes and beneficiary context. The product
falls back to the static allocation and can no longer
apply the user's later instructions to its recommendation.
```

Do not finalize submission text until the actual implementation matches it.

---

# 18. Memory Primitives

Only claim primitives that we actually use.

Potential primitives:

- recall
- entities
- semantic search
- temporal/time-travel
- summarization
- reflection
- consolidation

Do NOT select every primitive just because the form offers it.

During implementation, keep a record of exactly which Sibyl capabilities are used.

---

# 19. Development Milestones

## Phase 1 — Foundation

- [ ] Create repository.
- [ ] Initialize Next.js app.
- [ ] Set up TypeScript/Tailwind.
- [ ] Create dashboard shell.
- [ ] Create agent UI.
- [ ] Set up environment variables.
- [ ] Set up Git workflow.

## Phase 2 — Sibyl

- [ ] Install/configure Sibyl.
- [ ] Connect Sibyl to the application agent.
- [ ] Implement memory persistence.
- [ ] Implement memory retrieval.
- [ ] Test fresh-session recall.
- [ ] Test memory deletion.
- [ ] Confirm memory changes the inheritance recommendation.

## Phase 3 — Inheritance Plan

- [ ] Create beneficiary model.
- [ ] Create allocation model.
- [ ] Create plan creation flow.
- [ ] Allow natural-language plan changes.
- [ ] Require explicit user approval before committing changes.

## Phase 4 — Virtuals

- [ ] Integrate official Virtuals agent/runtime path.
- [ ] Create one inheritance agent.
- [ ] Add only required functions/tools.
- [ ] Verify agent can perform real work.
- [ ] Test agent → Sibyl.
- [ ] Test agent → inheritance tools.

## Phase 5 — Base

- [ ] Write minimal InheritanceVault contract.
- [ ] Deploy to Base Sepolia.
- [ ] Connect frontend.
- [ ] Implement deposit/demo balance.
- [ ] Implement activation.
- [ ] Implement distribution.
- [ ] Display transaction hash/status.

## Phase 6 — Demo

- [ ] Build fresh-session memory demo.
- [ ] Build memory deletion demo if practical.
- [ ] Build demo activation.
- [ ] Make memory usage visible.
- [ ] Make Base transaction visible.
- [ ] Verify Virtuals is doing real work.
- [ ] Record a clean 3–5 minute demo.

## Phase 7 — Submission

- [ ] Repository is public/accessible as required.
- [ ] README explains architecture.
- [ ] Demo video complete.
- [ ] Memory walkthrough complete.
- [ ] "What breaks when memory is deleted?" complete.
- [ ] Memory primitives accurately selected.
- [ ] Base integration clearly explained.
- [ ] Virtuals integration clearly explained.
- [ ] Final testing complete.
- [ ] Submit before deadline.

---

# 20. Definition of Done

The project is DONE when a judge can see this sequence without developer explanation:

```text
User gives inheritance preference
        ↓
Sibyl saves it
        ↓
Fresh session starts
        ↓
Sibyl retrieves it
        ↓
Agent changes its recommendation
        ↓
User approves plan
        ↓
Demo inheritance activation
        ↓
Base executes authorized distribution
```

If this works reliably, the core hackathon project is complete.

Everything else is optional.

---

# 21. Anti-Overengineering Rules

These rules override feature requests that do not directly improve the core demo.

### Rule 1

If a feature does not strengthen:

**Memory → Decision → Action**

do not build it.

### Rule 2

Prefer one working flow over five incomplete flows.

### Rule 3

Use one agent unless another agent is absolutely necessary.

### Rule 4

Use testnet/demo assets.

### Rule 5

Do not build real death detection.

### Rule 6

Do not build production legal infrastructure.

### Rule 7

Do not add a token.

### Rule 8

Do not add a database unless it is actually needed for application state.

Sibyl is the memory layer.

### Rule 9

Do not replace Sibyl with another memory/RAG system.

### Rule 10

Do not claim an integration is complete until the technology actually performs work in the running demo.

### Rule 11

If the official documentation differs from this plan, follow the official documentation and update this file.

### Rule 12

When in doubt, ask:

> "Will this help a judge understand the core idea in 30 seconds?"

If not, defer it.

---

# 22. Product Positioning

### Product

**InheritanceFi**

### Team

**Legacy Labs**

### One-line pitch

> An AI-powered inheritance protocol that remembers your wishes and turns them into executable onchain plans.

### Core message

> **Your inheritance should remember what you wanted.**

### Hackathon message

> **Sibyl remembers the user's evolving intentions. Virtuals powers the agent that acts on them. Base executes the authorized inheritance plan.**

---

# 23. Final Architecture Principle

Do not build:

> "An AI chatbot with blockchain and memory."

Build:

> **"An inheritance system where persistent memory is necessary for the agent to understand and execute the user's evolving wishes."**

That distinction is the project.


---

# 24. Judge Evidence Checklist

Every claimed integration must have visible evidence in the running build.

## Sibyl
- [ ] Meaningful inheritance preference is persisted.
- [ ] A genuinely fresh session retrieves it.
- [ ] Retrieved memory changes the agent's recommendation/decision.
- [ ] We can demonstrate what changes when the relevant memory is deleted.
- [ ] We only claim Sibyl primitives we actually use.

## Virtuals
- [ ] Official/current Virtuals GAME path is used.
- [ ] The agent has real executable functions/tools.
- [ ] At least one function performs real application work.
- [ ] Its result affects application state or the response.
- [ ] We can explain exactly what Virtuals is doing.

## Base
- [ ] InheritanceVault is deployed to Base Sepolia.
- [ ] Frontend reads/writes the deployed contract.
- [ ] Demo distribution creates a real Base Sepolia transaction.
- [ ] Transaction can be shown in the explorer.
- [ ] No private key or secret is committed to GitHub.

---

# 25. Canonical Demo Scenario

Do not change the core demo story unless implementation problems force us to.

### Starting plan

```text
Mother       40%
Brother      30%
Sister       30%
```

### Memory event

The user tells the agent:

> "My brother is still studying. I want his 30% inheritance released gradually rather than all at once."

### What gets persisted

```text
Brother = 30%
Brother is studying
User wants gradual release
```

### Fresh-session question

> "What did I say about my brother's inheritance?"

### Decision question

> "How should his 30% be handled?"

### Expected change

The agent recommends staged/gradual release instead of treating the 30% as an immediate lump sum.

### Execution

The user reviews/approves the authorized plan.

The demo activation is triggered.

Base Sepolia executes the authorized distribution.

This one scenario should drive the UI, memory implementation, agent tools, smart contract, demo video, and submission answers.

---

# 26. Definition of Winning

A judge should understand the product within approximately 30 seconds.

```text
1. User gives an inheritance preference.
                ↓
2. Sibyl persists the meaningful context.
                ↓
3. A fresh agent session starts.
                ↓
4. Sibyl retrieves the context.
                ↓
5. The agent changes its recommendation because of memory.
                ↓
6. User approves the inheritance plan.
                ↓
7. Demo activation occurs.
                ↓
8. Base executes the authorized distribution.
```

If these eight steps work reliably, the core hackathon MVP is complete.

Everything else is optional.

---

# 27. Claims & Trust Boundaries

Never present the hackathon prototype as a production legal inheritance system.

## Do NOT claim

- AI can reliably determine whether a person has died.
- The application replaces a legal will.
- The application provides legal inheritance advice.
- The smart contract is production-ready for real inheritance assets.
- AI has unrestricted control over user funds.
- A simulated activation event is equivalent to real-world death verification.

## Hackathon framing

- Death/inheritance activation is **simulated**.
- Assets are **testnet/demo assets**.
- The user explicitly authorizes the inheritance plan.
- The smart contract enforces the authorized plan.
- The AI helps interpret wishes and coordinate actions; it is not the legal authority.

---

# 28. Integration Priority / Fallback

Do not let one difficult integration destroy the entire MVP.

### P0 — Non-negotiable

**Sibyl Memory → fresh-session recall → changed decision**

This is the hackathon's central requirement.

### P1 — Non-negotiable

**Base Sepolia → working contract → visible transaction**

This proves the Base partner stack is doing real work.

### P2 — Required for our intended partner-stack submission

**Virtuals → real agent/runtime → executable function**

Use the simplest official/current implementation that lets the agent perform meaningful work.

### P3 — Polish

- animations
- advanced visualizations
- extra dashboards
- advanced wallet UX

If P0/P1/P2 are not stable, do not spend time on P3.

---

# 29. Feature Parking Lot

Ideas explicitly deferred:

- Real death verification.
- Government death certificate APIs.
- Legal will generation.
- Guardian/executor networks.
- Multi-signature inheritance governance.
- NFT inheritance certificates.
- Multi-chain support.
- DAO governance.
- Token launch.
- DeFi yield strategies.
- Insurance integrations.
- Estate/real-estate management.
- Mobile application.
- Multiple autonomous agents.
- Custom model training.
- Separate RAG/vector database.
- Production compliance infrastructure.
- Mainnet real-money inheritance.

New ideas go here first.

A parked feature is not part of the MVP unless explicitly promoted.

---

# 30. Scope Decision Rule

Before implementing any new feature, answer:

> **Does this directly improve Memory → Decision → Action?**

If yes, consider it.

If no, defer it.

Also ask:

> **Will this make the judge understand the core idea faster?**

If no, it is probably not worth hackathon time.

Prefer one complete, impressive flow over ten partially implemented features.

---

# 31. Official Integration Notes

These are implementation guardrails, not a replacement for current official documentation.

## Sibyl

Sibyl's current documentation describes its system as local-first, file-based agentic memory using SQLite/FTS5 and zero embeddings. Its official setup uses `sibyl-memory-cli[mcp]`, followed by `sibyl init` and `sibyl setup` to connect the memory layer to supported AI tools.

Do not invent a separate memory/RAG architecture when the official Sibyl integration can handle the requirement.

Official docs:
https://docs.sibyllabs.org/

## Virtuals

The current official GAME repositories describe a modular architecture around:

- Agent
- Worker
- Function

Functions are executable actions defined by the developer. The TypeScript SDK supports `GameAgent`, `GameWorker`, and executable `GameFunction` objects, and also provides Chat Agents for interactive agents that can execute functions.

For InheritanceFi, use the **simplest current Virtuals path that supports our interactive use case**. Do not build a continuously autonomous swarm if a chat agent with real executable functions is sufficient.

Official/current repository:
https://github.com/game-by-virtuals/game-node

## Base

Base's official docs provide a Next.js + wagmi + viem path and use Base Sepolia as the testnet for development. The deployment guide supports Foundry for Solidity deployment.

Use:

```text
Base Sepolia
Chain ID: 84532
```

Keep deployment keys out of the repository.

Official docs:
https://docs.base.org/

---

# 32. Recommended Repository Shape

Keep the codebase understandable.

```text
inheritancefi/
│
├── app/
│   ├── dashboard/
│   ├── agent/
│   ├── memory/
│   └── vault/
│
├── components/
│
├── lib/
│   ├── agent/
│   ├── sibyl/
│   ├── base/
│   └── inheritance/
│
├── contracts/
│   ├── src/
│   │   └── InheritanceVault.sol
│   ├── script/
│   └── test/
│
├── public/
│
├── PROJECT.md
├── README.md
└── .env.example
```

The exact structure can change with implementation. Avoid unnecessary services or packages.

---

# 33. Build Log

Record important decisions here.

## Decisions

### [Date]

**Decision:**

**Why:**

**Alternative rejected:**

This prevents repeatedly reconsidering the same architecture.

---

# 34. Final Pre-Submission Gate

Do not mark the project ready for judging until all of these are true.

### Core
- [ ] User can create an inheritance plan.
- [ ] User can communicate an evolving preference to the agent.
- [ ] Sibyl persists the preference.
- [ ] Fresh session recalls it.
- [ ] Memory changes a decision.
- [ ] Removing memory demonstrably breaks that behavior.

### Virtuals
- [ ] Virtuals is genuinely used.
- [ ] Agent/function execution is real.
- [ ] Integration can be demonstrated.

### Base
- [ ] Contract is deployed.
- [ ] Frontend interacts with it.
- [ ] Demo transaction succeeds.
- [ ] Transaction is publicly inspectable on Base Sepolia.

### Demo
- [ ] Full flow works from a clean state.
- [ ] Demo takes 3–5 minutes.
- [ ] No hidden manual database edits are needed during the demo.
- [ ] Memory indicators are visible enough for judges to understand.
- [ ] Activation is clearly labeled as a simulation.

### Submission
- [ ] Repository link ready.
- [ ] Demo video ready.
- [ ] Memory walkthrough matches the implementation.
- [ ] "What breaks when memory is deleted?" matches actual behavior.
- [ ] Only actually-used memory primitives are selected.
- [ ] Base integration is accurately described.
- [ ] Virtuals integration is accurately described.
- [ ] No unsupported production/legal claims are made.
