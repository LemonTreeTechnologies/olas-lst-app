import { StakingModel } from "@/utils/graphql/types";

export type ContractForDeposit = Pick<
  StakingModel,
  "chainId" | "stakingProxy" | "reminderPerSlot"
> & {
  allocation: bigint;
};
