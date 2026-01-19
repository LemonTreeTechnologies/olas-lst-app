import { Address } from "viem";
import { mainnet, sepolia } from "viem/chains";

export const DEPOSITORY_ADDRESSES: Record<number, Address> = {
  [sepolia.id]: "0x8A74DAfA5F5E8e6E3F32270537E56a65A0fa1375",
  [mainnet.id]: "0xEfF4A1D9faF5c750d5E32754c40Cf163767C63A4",
};

export const DEPOSITORY_ABI = [
  {
    type: "constructor",
    inputs: [
      {
        name: "_olas",
        type: "address",
        internalType: "address",
      },
      {
        name: "_st",
        type: "address",
        internalType: "address",
      },
    ],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "ALPHA_DEPOSIT_LIMIT",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "BETA_DEPOSIT_LIMIT",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "LzCloseStakingModel",
    inputs: [
      {
        name: "chainId",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "stakingProxy",
        type: "address",
        internalType: "address",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "LzCreateAndActivateStakingModel",
    inputs: [
      {
        name: "chainId",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "stakingProxy",
        type: "address",
        internalType: "address",
      },
      {
        name: "stakeLimitPerSlot",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "numSlots",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "PROXY_SLOT",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "bytes32",
        internalType: "bytes32",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "STAKE",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "bytes32",
        internalType: "bytes32",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "UNSTAKE",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "bytes32",
        internalType: "bytes32",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "UNSTAKE_RETIRED",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "bytes32",
        internalType: "bytes32",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "VERSION",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "string",
        internalType: "string",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "changeImplementation",
    inputs: [
      {
        name: "newImplementation",
        type: "address",
        internalType: "address",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "changeLzOracle",
    inputs: [
      {
        name: "newLzOracle",
        type: "address",
        internalType: "address",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "changeOwner",
    inputs: [
      {
        name: "newOwner",
        type: "address",
        internalType: "address",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "changeProductType",
    inputs: [
      {
        name: "newProductType",
        type: "uint8",
        internalType: "enum ProductType",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "changeTreasury",
    inputs: [
      {
        name: "newTreasury",
        type: "address",
        internalType: "address",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "closeRetiredStakingModels",
    inputs: [
      {
        name: "chainIds",
        type: "uint256[]",
        internalType: "uint256[]",
      },
      {
        name: "stakingProxies",
        type: "address[]",
        internalType: "address[]",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "createAndActivateStakingModels",
    inputs: [
      {
        name: "chainIds",
        type: "uint256[]",
        internalType: "uint256[]",
      },
      {
        name: "stakingProxies",
        type: "address[]",
        internalType: "address[]",
      },
      {
        name: "stakeLimitPerSlots",
        type: "uint256[]",
        internalType: "uint256[]",
      },
      {
        name: "numSlots",
        type: "uint256[]",
        internalType: "uint256[]",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "deposit",
    inputs: [
      {
        name: "stakeAmount",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "chainIds",
        type: "uint256[]",
        internalType: "uint256[]",
      },
      {
        name: "stakingProxies",
        type: "address[]",
        internalType: "address[]",
      },
      {
        name: "bridgePayloads",
        type: "bytes[]",
        internalType: "bytes[]",
      },
      {
        name: "values",
        type: "uint256[]",
        internalType: "uint256[]",
      },
    ],
    outputs: [
      {
        name: "stAmount",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "amounts",
        type: "uint256[]",
        internalType: "uint256[]",
      },
    ],
    stateMutability: "payable",
  },
  {
    type: "function",
    name: "depositExternal",
    inputs: [
      {
        name: "chainIds",
        type: "uint256[]",
        internalType: "uint256[]",
      },
      {
        name: "amounts",
        type: "uint256[]",
        internalType: "uint256[]",
      },
      {
        name: "bridgePayloads",
        type: "bytes[]",
        internalType: "bytes[]",
      },
      {
        name: "values",
        type: "uint256[]",
        internalType: "uint256[]",
      },
    ],
    outputs: [],
    stateMutability: "payable",
  },
  {
    type: "function",
    name: "drain",
    inputs: [],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "getChainIdAndStakingProxy",
    inputs: [
      {
        name: "stakingModelId",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    outputs: [
      {
        name: "",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "",
        type: "address",
        internalType: "address",
      },
    ],
    stateMutability: "pure",
  },
  {
    type: "function",
    name: "getStakingModelId",
    inputs: [
      {
        name: "chainId",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "stakingProxy",
        type: "address",
        internalType: "address",
      },
    ],
    outputs: [
      {
        name: "",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    stateMutability: "pure",
  },
  {
    type: "function",
    name: "initialize",
    inputs: [],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "lzOracle",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "address",
        internalType: "address",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "mapAccountDeposits",
    inputs: [
      {
        name: "",
        type: "address",
        internalType: "address",
      },
    ],
    outputs: [
      {
        name: "",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "mapAccountWithdraws",
    inputs: [
      {
        name: "",
        type: "address",
        internalType: "address",
      },
    ],
    outputs: [
      {
        name: "",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "mapChainIdDepositProcessors",
    inputs: [
      {
        name: "",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    outputs: [
      {
        name: "",
        type: "address",
        internalType: "address",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "mapChainIdStakedExternals",
    inputs: [
      {
        name: "",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    outputs: [
      {
        name: "",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "mapStakingModels",
    inputs: [
      {
        name: "",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    outputs: [
      {
        name: "supply",
        type: "uint96",
        internalType: "uint96",
      },
      {
        name: "remainder",
        type: "uint96",
        internalType: "uint96",
      },
      {
        name: "stakeLimitPerSlot",
        type: "uint96",
        internalType: "uint96",
      },
      {
        name: "status",
        type: "uint8",
        internalType: "enum StakingModelStatus",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "olas",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "address",
        internalType: "address",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "owner",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "address",
        internalType: "address",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "pause",
    inputs: [],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "paused",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "productType",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "uint8",
        internalType: "enum ProductType",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "setDepositProcessorChainIds",
    inputs: [
      {
        name: "depositProcessors",
        type: "address[]",
        internalType: "address[]",
      },
      {
        name: "chainIds",
        type: "uint256[]",
        internalType: "uint256[]",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "setExternalStakingDistributorChainIds",
    inputs: [
      {
        name: "chainIds",
        type: "uint256[]",
        internalType: "uint256[]",
      },
      {
        name: "externalStakingDistributors",
        type: "address[]",
        internalType: "address[]",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "setStakingModelStatuses",
    inputs: [
      {
        name: "chainIds",
        type: "uint256[]",
        internalType: "uint256[]",
      },
      {
        name: "stakingProxies",
        type: "address[]",
        internalType: "address[]",
      },
      {
        name: "statuses",
        type: "uint8[]",
        internalType: "enum StakingModelStatus[]",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "st",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "address",
        internalType: "address",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "treasury",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "address",
        internalType: "address",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "unpause",
    inputs: [],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "unstake",
    inputs: [
      {
        name: "unstakeAmount",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "chainIds",
        type: "uint256[]",
        internalType: "uint256[]",
      },
      {
        name: "stakingProxies",
        type: "address[]",
        internalType: "address[]",
      },
      {
        name: "bridgePayloads",
        type: "bytes[]",
        internalType: "bytes[]",
      },
      {
        name: "values",
        type: "uint256[]",
        internalType: "uint256[]",
      },
      {
        name: "sender",
        type: "address",
        internalType: "address",
      },
    ],
    outputs: [
      {
        name: "amounts",
        type: "uint256[]",
        internalType: "uint256[]",
      },
    ],
    stateMutability: "payable",
  },
  {
    type: "function",
    name: "unstakeExternal",
    inputs: [
      {
        name: "chainIds",
        type: "uint256[]",
        internalType: "uint256[]",
      },
      {
        name: "amounts",
        type: "uint256[]",
        internalType: "uint256[]",
      },
      {
        name: "bridgePayloads",
        type: "bytes[]",
        internalType: "bytes[]",
      },
      {
        name: "values",
        type: "uint256[]",
        internalType: "uint256[]",
      },
      {
        name: "sender",
        type: "address",
        internalType: "address",
      },
    ],
    outputs: [],
    stateMutability: "payable",
  },
  {
    type: "function",
    name: "unstakeRetired",
    inputs: [
      {
        name: "chainIds",
        type: "uint256[]",
        internalType: "uint256[]",
      },
      {
        name: "stakingProxies",
        type: "address[]",
        internalType: "address[]",
      },
      {
        name: "bridgePayloads",
        type: "bytes[]",
        internalType: "bytes[]",
      },
      {
        name: "values",
        type: "uint256[]",
        internalType: "uint256[]",
      },
    ],
    outputs: [
      {
        name: "amounts",
        type: "uint256[]",
        internalType: "uint256[]",
      },
    ],
    stateMutability: "payable",
  },
  {
    type: "event",
    name: "Deposit",
    inputs: [
      {
        name: "sender",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "stakeAmount",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
      {
        name: "stAmount",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
      {
        name: "chainIds",
        type: "uint256[]",
        indexed: false,
        internalType: "uint256[]",
      },
      {
        name: "stakingProxies",
        type: "address[]",
        indexed: false,
        internalType: "address[]",
      },
      {
        name: "amounts",
        type: "uint256[]",
        indexed: false,
        internalType: "uint256[]",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "DepositExternal",
    inputs: [
      {
        name: "sender",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "chainIds",
        type: "uint256[]",
        indexed: false,
        internalType: "uint256[]",
      },
      {
        name: "externalStakingDistributors",
        type: "address[]",
        indexed: false,
        internalType: "address[]",
      },
      {
        name: "amounts",
        type: "uint256[]",
        indexed: false,
        internalType: "uint256[]",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "DepositoryPaused",
    inputs: [],
    anonymous: false,
  },
  {
    type: "event",
    name: "DepositoryUnpaused",
    inputs: [],
    anonymous: false,
  },
  {
    type: "event",
    name: "Drained",
    inputs: [
      {
        name: "sender",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "receiver",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "amount",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "ImplementationUpdated",
    inputs: [
      {
        name: "implementation",
        type: "address",
        indexed: true,
        internalType: "address",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "LzOracleUpdated",
    inputs: [
      {
        name: "lzOracle",
        type: "address",
        indexed: true,
        internalType: "address",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "OwnerUpdated",
    inputs: [
      {
        name: "owner",
        type: "address",
        indexed: true,
        internalType: "address",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "ProductTypeUpdated",
    inputs: [
      {
        name: "productType",
        type: "uint8",
        indexed: false,
        internalType: "enum ProductType",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "Retired",
    inputs: [
      {
        name: "chainIds",
        type: "uint256[]",
        indexed: false,
        internalType: "uint256[]",
      },
      {
        name: "stakingProxies",
        type: "address[]",
        indexed: false,
        internalType: "address[]",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "SetDepositProcessorChainIds",
    inputs: [
      {
        name: "depositProcessors",
        type: "address[]",
        indexed: false,
        internalType: "address[]",
      },
      {
        name: "chainIds",
        type: "uint256[]",
        indexed: false,
        internalType: "uint256[]",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "SetExternalStakingDistributorChainIds",
    inputs: [
      {
        name: "chainIds",
        type: "uint256[]",
        indexed: false,
        internalType: "uint256[]",
      },
      {
        name: "externalStakingDistributors",
        type: "address[]",
        indexed: false,
        internalType: "address[]",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "StakingModelActivated",
    inputs: [
      {
        name: "chainId",
        type: "uint256",
        indexed: true,
        internalType: "uint256",
      },
      {
        name: "stakingProxy",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "stakeLimitPerSlots",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
      {
        name: "numSlots",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "StakingModelStatusSet",
    inputs: [
      {
        name: "chainId",
        type: "uint256",
        indexed: true,
        internalType: "uint256",
      },
      {
        name: "stakingProxy",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "status",
        type: "uint8",
        indexed: false,
        internalType: "enum StakingModelStatus",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "TreasuryUpdated",
    inputs: [
      {
        name: "treasury",
        type: "address",
        indexed: true,
        internalType: "address",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "Unstake",
    inputs: [
      {
        name: "sender",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "chainIds",
        type: "uint256[]",
        indexed: false,
        internalType: "uint256[]",
      },
      {
        name: "stakingProxies",
        type: "address[]",
        indexed: false,
        internalType: "address[]",
      },
      {
        name: "amounts",
        type: "uint256[]",
        indexed: false,
        internalType: "uint256[]",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "UnstakeExternal",
    inputs: [
      {
        name: "sender",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "chainIds",
        type: "uint256[]",
        indexed: false,
        internalType: "uint256[]",
      },
      {
        name: "externalStakingDistributors",
        type: "address[]",
        indexed: false,
        internalType: "address[]",
      },
      {
        name: "amounts",
        type: "uint256[]",
        indexed: false,
        internalType: "uint256[]",
      },
      {
        name: "operation",
        type: "bytes32",
        indexed: false,
        internalType: "bytes32",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "ValueRefunded",
    inputs: [
      {
        name: "sender",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "refund",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
      {
        name: "success",
        type: "bool",
        indexed: false,
        internalType: "bool",
      },
    ],
    anonymous: false,
  },
  {
    type: "error",
    name: "AlreadyInitialized",
    inputs: [],
  },
  {
    type: "error",
    name: "Overflow",
    inputs: [
      {
        name: "provided",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "max",
        type: "uint256",
        internalType: "uint256",
      },
    ],
  },
  {
    type: "error",
    name: "OwnerOnly",
    inputs: [
      {
        name: "sender",
        type: "address",
        internalType: "address",
      },
      {
        name: "owner",
        type: "address",
        internalType: "address",
      },
    ],
  },
  {
    type: "error",
    name: "Paused",
    inputs: [],
  },
  {
    type: "error",
    name: "ProductTypeDepositOverflow",
    inputs: [
      {
        name: "productType",
        type: "uint8",
        internalType: "uint8",
      },
      {
        name: "depositAmount",
        type: "uint256",
        internalType: "uint256",
      },
    ],
  },
  {
    type: "error",
    name: "ReentrancyGuard",
    inputs: [],
  },
  {
    type: "error",
    name: "StakingModelAlreadyExists",
    inputs: [
      {
        name: "stakingModelId",
        type: "uint256",
        internalType: "uint256",
      },
    ],
  },
  {
    type: "error",
    name: "TransferFailed",
    inputs: [
      {
        name: "token",
        type: "address",
        internalType: "address",
      },
      {
        name: "from",
        type: "address",
        internalType: "address",
      },
      {
        name: "to",
        type: "address",
        internalType: "address",
      },
      {
        name: "amount",
        type: "uint256",
        internalType: "uint256",
      },
    ],
  },
  {
    type: "error",
    name: "UnauthorizedAccount",
    inputs: [
      {
        name: "account",
        type: "address",
        internalType: "address",
      },
    ],
  },
  {
    type: "error",
    name: "WrongArrayLength",
    inputs: [],
  },
  {
    type: "error",
    name: "WrongStakingModel",
    inputs: [
      {
        name: "stakingModelId",
        type: "uint256",
        internalType: "uint256",
      },
    ],
  },
  {
    type: "error",
    name: "ZeroAddress",
    inputs: [],
  },
  {
    type: "error",
    name: "ZeroValue",
    inputs: [],
  },
] as const;
