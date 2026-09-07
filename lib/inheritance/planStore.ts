import { InheritancePlan, Beneficiary, PlanStatus } from "../types";
import { sibylMemory } from "../sibyl/memoryEngine";

const PLAN_STORAGE_KEY = "inheritance_plan_store_v4";

export const SAMPLE_FAMILY_PLAN: InheritancePlan = {
  planId: "plan-vault-base-family-01",
  ownerAddress: "0x71C8F79B37E4C74B2925b364860B615372338A12",
  vaultBalanceEth: 5.0,
  vaultBalanceUsd: 13000,
  status: "authorized",
  lastUpdated: new Date().toISOString(),
  beneficiaries: [
    {
      id: "mother",
      name: "Eleanor",
      relationship: "Mother",
      address: "0x89205A3E3b2A69De6Dbf7f01ED13B2108B2c43e7",
      allocationPercent: 40,
      payoutType: "lump_sum",
      notes: "Primary matriarch allocation upon execution.",
      status: "verified",
    },
    {
      id: "brother",
      name: "Marcus",
      relationship: "Brother",
      address: "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC",
      allocationPercent: 30,
      payoutType: "gradual_release",
      payoutSchedule: "25% released annually over 4 college years",
      notes: "Education directive: Staged payouts for college fees.",
      status: "verified",
    },
    {
      id: "sister",
      name: "Clara",
      relationship: "Sister",
      address: "0x90F79bf6EB2c4f870365E785982E1f101E93b906",
      allocationPercent: 30,
      payoutType: "lump_sum",
      notes: "Immediate lump sum distribution.",
      status: "verified",
    },
  ],
};

export const BLANK_PLAN: InheritancePlan = {
  planId: "plan-vault-clean-01",
  ownerAddress: "0x71C8F79B37E4C74B2925b364860B615372338A12",
  vaultBalanceEth: 0.0,
  vaultBalanceUsd: 0,
  status: "draft",
  lastUpdated: new Date().toISOString(),
  beneficiaries: [],
};

const DEFAULT_PLAN = BLANK_PLAN;

class InheritancePlanStore {
  private isBrowser: boolean = typeof window !== "undefined";

  public getPlan(): InheritancePlan {
    if (!this.isBrowser) return DEFAULT_PLAN;
    try {
      const data = localStorage.getItem(PLAN_STORAGE_KEY);
      if (!data) {
        localStorage.setItem(PLAN_STORAGE_KEY, JSON.stringify(DEFAULT_PLAN));
        return DEFAULT_PLAN;
      }
      return JSON.parse(data);
    } catch {
      return DEFAULT_PLAN;
    }
  }

  public savePlan(plan: InheritancePlan): void {
    if (!this.isBrowser) return;
    try {
      localStorage.setItem(PLAN_STORAGE_KEY, JSON.stringify(plan));
      window.dispatchEvent(new CustomEvent("inheritance-plan-updated", { detail: plan }));
    } catch (e) {
      console.error("Failed to save inheritance plan", e);
    }
  }

  public loadSamplePlan(): InheritancePlan {
    const newPlan = { ...SAMPLE_FAMILY_PLAN, lastUpdated: new Date().toISOString() };
    this.savePlan(newPlan);
    sibylMemory.setEntity("preference", "Brother", {
      allocation: "30%",
      relationship: "Brother",
      lifeStage: "Currently enrolled in college/studies",
      payoutPreference: "gradual_release",
      releaseSchedule: "25% annually across 4 years (Milestone/Education vesting)",
      directive: "Do not release in lump sum; incentivize educational milestone completion",
    });
    sibylMemory.writeEvent("Loaded sample family plan with brother education directive.");
    return newPlan;
  }

  public clearPlan(): InheritancePlan {
    const cleanPlan = { ...BLANK_PLAN, lastUpdated: new Date().toISOString() };
    this.savePlan(cleanPlan);
    sibylMemory.clearAllMemories();
    return cleanPlan;
  }

  public addBeneficiary(beneficiary: Omit<Beneficiary, "id">): InheritancePlan {
    const plan = this.getPlan();
    const newId = `ben-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const newBeneficiary: Beneficiary = {
      ...beneficiary,
      id: newId,
    };

    plan.beneficiaries.push(newBeneficiary);
    plan.lastUpdated = new Date().toISOString();
    this.savePlan(plan);
    sibylMemory.writeEvent(`Added beneficiary [${newBeneficiary.name}] (${newBeneficiary.allocationPercent}%)`);
    return plan;
  }

  public removeBeneficiary(id: string): InheritancePlan {
    const plan = this.getPlan();
    plan.beneficiaries = plan.beneficiaries.filter((b) => b.id !== id);
    plan.lastUpdated = new Date().toISOString();
    this.savePlan(plan);
    sibylMemory.writeEvent(`Removed beneficiary id [${id}]`);
    return plan;
  }

  public updateBeneficiary(id: string, updates: Partial<Beneficiary>): InheritancePlan {
    const plan = this.getPlan();
    const index = plan.beneficiaries.findIndex((b) => b.id === id);
    if (index >= 0) {
      plan.beneficiaries[index] = {
        ...plan.beneficiaries[index],
        ...updates,
      };
      plan.lastUpdated = new Date().toISOString();
      this.savePlan(plan);
      sibylMemory.writeEvent(`Updated beneficiary [${plan.beneficiaries[index].name}] plan settings`);
    }
    return plan;
  }

  public updateVaultBalance(usd: number, eth: number): InheritancePlan {
    const plan = this.getPlan();
    plan.vaultBalanceUsd = usd;
    plan.vaultBalanceEth = eth;
    plan.lastUpdated = new Date().toISOString();
    this.savePlan(plan);
    return plan;
  }

  public setStatus(status: PlanStatus, txHash?: string): InheritancePlan {
    const plan = this.getPlan();
    plan.status = status;
    plan.lastUpdated = new Date().toISOString();
    if (status === "authorized") {
      plan.authorizedAt = new Date().toISOString();
    } else if (status === "activated") {
      plan.activatedAt = new Date().toISOString();
    } else if (status === "distributed") {
      plan.distributedAt = new Date().toISOString();
      if (txHash) plan.txHash = txHash;
    }
    this.savePlan(plan);
    sibylMemory.writeEvent(`Vault Plan status shifted to [${status.toUpperCase()}]${txHash ? ` Tx: ${txHash}` : ""}`);
    return plan;
  }

  public resetToDefault(): InheritancePlan {
    return this.clearPlan();
  }
}

export const planStore = new InheritancePlanStore();
