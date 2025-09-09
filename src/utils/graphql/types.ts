import { Address } from "viem";

export type StakingModelStatus = "Retired" | "Active" | "Inactive";

export type GetStakingModelsQueryParams = {
  status: StakingModelStatus;
  orderBy?: string;
  orderDirection?: string;
  reminderPerSlot_gte?: number;
};

export type StakingModel = {
  id: string;
  chainId: string;
  stakingProxy: Address;
  numSlots: string;
  usedSlots: string;
  availableSlots: string;
  stakeLimitPerSlot: string;
  stAmount: string;
  supply: string;
  reminder: string;
  reminderPerSlot: string;
  status: StakingModelStatus;
  blockNumber: string;
  blockTimestamp: string;
  transactionHash: string;
};

export type GetStakerParams = {
  id: Address | undefined;
};

export type Staker = {
  id: string;
  pendingWithdrawRequests: number;
  completedWithdrawRequests: number;
  withdrawRequests: {
    requestExecution: {
      amount: string;
      transactionHash: string;
    } | null;
    requestApproval: {
      amount: string;
    } | null;
    id: string;
    requestId: string;
    olasAmount: string;
    transactionHash: string;
    withdrawTime: string;
  }[];
};
