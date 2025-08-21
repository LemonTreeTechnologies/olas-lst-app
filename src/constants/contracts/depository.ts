import { Address } from "viem";
import { sepolia } from "viem/chains";

export const DEPOSITORY_ADDRESSES: Record<number, Address> = {
  [sepolia.id]: "0x972e3484378B9B7100a87766BFe82Da3B2931138",
};

export const DEPOSITORY_ABI = [
  {
    inputs: [
      { internalType: "address", name: "_olas", type: "address" },
      { internalType: "address", name: "_st", type: "address" },
      { internalType: "address", name: "_lock", type: "address" },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  { inputs: [], name: "AlreadyInitialized", type: "error" },
  {
    inputs: [
      { internalType: "uint256", name: "provided", type: "uint256" },
      { internalType: "uint256", name: "max", type: "uint256" },
    ],
    name: "Overflow",
    type: "error",
  },
  {
    inputs: [
      { internalType: "address", name: "sender", type: "address" },
      { internalType: "address", name: "owner", type: "address" },
    ],
    name: "OwnerOnly",
    type: "error",
  },
  {
    inputs: [
      { internalType: "uint256", name: "stakingModelId", type: "uint256" },
    ],
    name: "StakingModelAlreadyExists",
    type: "error",
  },
  {
    inputs: [{ internalType: "address", name: "account", type: "address" }],
    name: "UnauthorizedAccount",
    type: "error",
  },
  {
    inputs: [
      { internalType: "uint256", name: "numValues1", type: "uint256" },
      { internalType: "uint256", name: "numValues2", type: "uint256" },
    ],
    name: "WrongArrayLength",
    type: "error",
  },
  {
    inputs: [
      { internalType: "uint256", name: "stakingModelId", type: "uint256" },
    ],
    name: "WrongStakingModel",
    type: "error",
  },
  { inputs: [], name: "ZeroAddress", type: "error" },
  { inputs: [], name: "ZeroValue", type: "error" },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256[]",
        name: "modelIds",
        type: "uint256[]",
      },
      {
        indexed: false,
        internalType: "bool[]",
        name: "statuses",
        type: "bool[]",
      },
    ],
    name: "ChangeModelStatuses",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "sender",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "stakeAmount",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "stAmount",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256[]",
        name: "chainIds",
        type: "uint256[]",
      },
      {
        indexed: false,
        internalType: "address[]",
        name: "stakingProxies",
        type: "address[]",
      },
      {
        indexed: false,
        internalType: "uint256[]",
        name: "amounts",
        type: "uint256[]",
      },
    ],
    name: "Deposit",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "lockFactor",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "maxStakingLimit",
        type: "uint256",
      },
    ],
    name: "DepositoryParamsUpdated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "implementation",
        type: "address",
      },
    ],
    name: "ImplementationUpdated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "account",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "olasAmount",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "lockAmount",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "vaultBalance",
        type: "uint256",
      },
    ],
    name: "Locked",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
    ],
    name: "OwnerUpdated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address[]",
        name: "depositProcessors",
        type: "address[]",
      },
      {
        indexed: false,
        internalType: "uint256[]",
        name: "chainIds",
        type: "uint256[]",
      },
    ],
    name: "SetDepositProcessorChainIds",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256[]",
        name: "chainIds",
        type: "uint256[]",
      },
      {
        indexed: false,
        internalType: "address[]",
        name: "stakingProxies",
        type: "address[]",
      },
      {
        indexed: false,
        internalType: "uint256[]",
        name: "supplies",
        type: "uint256[]",
      },
    ],
    name: "StakingModelsActivated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "treasury",
        type: "address",
      },
    ],
    name: "TreasuryUpdated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "sender",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "unstakeAmount",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256[]",
        name: "chainIds",
        type: "uint256[]",
      },
      {
        indexed: false,
        internalType: "address[]",
        name: "stakingProxies",
        type: "address[]",
      },
      {
        indexed: false,
        internalType: "uint256[]",
        name: "amounts",
        type: "uint256[]",
      },
    ],
    name: "Unstake",
    type: "event",
  },
  {
    inputs: [],
    name: "MAX_LOCK_FACTOR",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "PROXY_SLOT",
    outputs: [{ internalType: "bytes32", name: "", type: "bytes32" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "STAKE",
    outputs: [{ internalType: "bytes32", name: "", type: "bytes32" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "UNSTAKE",
    outputs: [{ internalType: "bytes32", name: "", type: "bytes32" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "newImplementation", type: "address" },
    ],
    name: "changeImplementation",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "newLockFactor", type: "uint256" },
      { internalType: "uint256", name: "newMaxStakingLimit", type: "uint256" },
    ],
    name: "changeLockFactor",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "newOwner", type: "address" }],
    name: "changeOwner",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "newTreasury", type: "address" }],
    name: "changeTreasury",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256[]", name: "chainIds", type: "uint256[]" },
      { internalType: "address[]", name: "stakingProxies", type: "address[]" },
      { internalType: "uint256[]", name: "supplies", type: "uint256[]" },
    ],
    name: "createAndActivateStakingModels",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "stakeAmount", type: "uint256" },
      { internalType: "uint256[]", name: "chainIds", type: "uint256[]" },
      { internalType: "address[]", name: "stakingProxies", type: "address[]" },
      { internalType: "bytes[]", name: "bridgePayloads", type: "bytes[]" },
      { internalType: "uint256[]", name: "values", type: "uint256[]" },
    ],
    name: "deposit",
    outputs: [
      { internalType: "uint256", name: "stAmount", type: "uint256" },
      { internalType: "uint256[]", name: "amounts", type: "uint256[]" },
    ],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "stakingModelId", type: "uint256" },
    ],
    name: "getChainIdAndStakingProxy",
    outputs: [
      { internalType: "uint256", name: "", type: "uint256" },
      { internalType: "address", name: "", type: "address" },
    ],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [],
    name: "getNumStakingModels",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "chainId", type: "uint256" },
      { internalType: "address", name: "stakingProxy", type: "address" },
    ],
    name: "getStakingModelId",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "_lockFactor", type: "uint256" },
      { internalType: "uint256", name: "_maxStakingLimit", type: "uint256" },
    ],
    name: "initialize",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "lock",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "lockFactor",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    name: "mapChainIdDepositProcessors",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    name: "mapStakingModels",
    outputs: [
      { internalType: "uint96", name: "supply", type: "uint96" },
      { internalType: "uint96", name: "remainder", type: "uint96" },
      { internalType: "bool", name: "active", type: "bool" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "maxStakingLimit",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "olas",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address[]",
        name: "depositProcessors",
        type: "address[]",
      },
      { internalType: "uint256[]", name: "chainIds", type: "uint256[]" },
    ],
    name: "setDepositProcessorChainIds",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    name: "setStakingModelIds",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256[]", name: "stakingModelIds", type: "uint256[]" },
      { internalType: "bool[]", name: "statuses", type: "bool[]" },
    ],
    name: "setStakingModelStatuses",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "st",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "treasury",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "unstakeAmount", type: "uint256" },
      { internalType: "uint256[]", name: "chainIds", type: "uint256[]" },
      { internalType: "address[]", name: "stakingProxies", type: "address[]" },
      { internalType: "bytes[]", name: "bridgePayloads", type: "bytes[]" },
      { internalType: "uint256[]", name: "values", type: "uint256[]" },
    ],
    name: "unstake",
    outputs: [
      { internalType: "uint256[]", name: "amounts", type: "uint256[]" },
    ],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [],
    name: "ve",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
] as const;
