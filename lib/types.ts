export type BeneficiaryId = "mother" | "brother" | "sister" | string;

export type PayoutType = "lump_sum" | "gradual_release" | "milestone_trust";

export interface Beneficiary {
  id: string;
  name: string;
  relationship: string;
  address: `0x${string}`;
  allocationPercent: number; // e.g. 40 for 40%
  payoutType: PayoutType;
  payoutSchedule?: string; // e.g. "25% annually over 4 years for education completion"
  notes?: string;
  status: "verified" | "pending_authorization" | "draft";
}

export type PlanStatus = "draft" | "authorized" | "activated" | "distributed";

export interface InheritancePlan {
  planId: string;
  ownerAddress: `0x${string}`;
  vaultBalanceEth: number; // e.g. 5.0 ETH
  vaultBalanceUsd: number; // e.g. 10000 USD
  beneficiaries: Beneficiary[];
  status: PlanStatus;
  authorizedAt?: string;
  activatedAt?: string;
  distributedAt?: string;
  txHash?: string;
  lastUpdated: string;
}

export type MemoryTier = "hot_state" | "warm_entity" | "cold_journal" | "reference" | "archive";

export interface SibylEntityMemory {
  id: string;
  tenantId: string;
  category: "beneficiary" | "preference" | "directive" | "rule";
  name: string;
  body: Record<string, any>;
  createdAt: string;
  updatedAt: string;
  isArchived?: boolean;
}

export interface SibylJournalEvent {
  id: string;
  tenantId: string;
  timestamp: string;
  action: string;
  context: string;
  actor: "user" | "agent" | "contract";
}

export interface AgentChatMessage {
  id: string;
  sender: "user" | "agent" | "system";
  content: string;
  timestamp: string;
  recalledMemories?: SibylEntityMemory[];
  savedMemories?: SibylEntityMemory[];
  toolCalls?: {
    toolName: string;
    params: Record<string, any>;
    result: Record<string, any>;
  }[];
  isFreshSessionMarker?: boolean;
  proposedPlanUpdate?: Partial<InheritancePlan>;
}
