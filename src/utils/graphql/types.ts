import { Address } from "viem";

export type StakingModelStatus = "Retired" | "Active" | "Inactive";

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
