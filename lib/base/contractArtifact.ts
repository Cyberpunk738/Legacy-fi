import fs from "fs";

export const INHERITANCE_VAULT_ABI = [
  {
    type: "constructor",
    inputs: [],
    stateMutability: "payable"
  },
  {
    type: "receive",
    stateMutability: "payable"
  },
  {
    type: "function",
    name: "activateInheritanceDemo",
    inputs: [],
    outputs: [],
    stateMutability: "nonpayable"
  },
  {
    type: "function",
    name: "activationTimestamp",
    inputs: [],
    outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    stateMutability: "view"
  },
  {
    type: "function",
    name: "authorizePlan",
    inputs: [
      { name: "_beneficiaries", type: "address[]", internalType: "address[]" },
      { name: "_allocationsBps", type: "uint256[]", internalType: "uint256[]" },
      { name: "_payoutTypes", type: "uint8[]", internalType: "enum InheritanceVault.PayoutType[]" }
    ],
    outputs: [],
    stateMutability: "nonpayable"
  },
  {
    type: "function",
    name: "beneficiaryAddresses",
    inputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    outputs: [{ name: "", type: "address", internalType: "address" }],
    stateMutability: "view"
  },
  {
    type: "function",
    name: "executeDistribution",
    inputs: [],
    outputs: [],
    stateMutability: "nonpayable"
  },
  {
    type: "function",
    name: "getBeneficiariesCount",
    inputs: [],
    outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    stateMutability: "view"
  },
  {
    type: "function",
    name: "owner",
    inputs: [],
    outputs: [{ name: "", type: "address", internalType: "address" }],
    stateMutability: "view"
  },
  {
    type: "function",
    name: "status",
    inputs: [],
    outputs: [{ name: "", type: "uint8", internalType: "enum InheritanceVault.VaultStatus" }],
    stateMutability: "view"
  },
  {
    type: "function",
    name: "totalVaultBalance",
    inputs: [],
    outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    stateMutability: "view"
  },
  {
    type: "event",
    name: "DistributionExecuted",
    inputs: [
      { name: "beneficiary", type: "address", indexed: true, internalType: "address" },
      { name: "amount", type: "uint256", indexed: false, internalType: "uint256" },
      { name: "payoutType", type: "uint8", indexed: false, internalType: "enum InheritanceVault.PayoutType" },
      { name: "timestamp", type: "uint256", indexed: false, internalType: "uint256" }
    ],
    anonymous: false
  },
  {
    type: "event",
    name: "InheritanceActivated",
    inputs: [
      { name: "caller", type: "address", indexed: true, internalType: "address" },
      { name: "timestamp", type: "uint256", indexed: false, internalType: "uint256" },
      { name: "reason", type: "string", indexed: false, internalType: "string" }
    ],
    anonymous: false
  },
  {
    type: "event",
    name: "PlanAuthorized",
    inputs: [
      { name: "owner", type: "address", indexed: true, internalType: "address" },
      { name: "totalBeneficiaries", type: "uint256", indexed: false, internalType: "uint256" },
      { name: "timestamp", type: "uint256", indexed: false, internalType: "uint256" }
    ],
    anonymous: false
  },
  {
    type: "event",
    name: "PlanUpdated",
    inputs: [
      { name: "owner", type: "address", indexed: true, internalType: "address" },
      { name: "beneficiary", type: "address", indexed: true, internalType: "address" },
      { name: "basisPoints", type: "uint256", indexed: false, internalType: "uint256" },
      { name: "payoutType", type: "uint8", indexed: false, internalType: "enum InheritanceVault.PayoutType" }
    ],
    anonymous: false
  }
] as const;
