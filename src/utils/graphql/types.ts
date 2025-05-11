import { Address } from "viem";

export type StakingModelStatus = "Retired" | "Active" | "Inactive";

export type StakingModel = {
  id: string;
  chainId: string;
  stakingProxy: Address;
  stakeLimitPerSlot: string;
  numSlots: string;
  status: StakingModelStatus;
  blockNumber: string;
  blockTimestamp: string;
  transactionHash: string;
  stAmount: string;
};
