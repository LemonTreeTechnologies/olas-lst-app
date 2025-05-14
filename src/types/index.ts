import { StakingModel } from "@/utils/graphql/types";

export type ContractForDeposit = Pick<
  StakingModel,
  "chainId" | "stakingProxy" | "stakeLimitPerSlot"
> & {
  allocation: bigint;
};
