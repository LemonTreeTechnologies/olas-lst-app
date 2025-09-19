import { StakingModel } from "@/utils/graphql/types";

export type ContractForDeposit = Pick<
  StakingModel,
  "chainId" | "stakingProxy"
> & {
  allocation: bigint;
};

export type TokenType = "OLAS" | "stOLAS";
