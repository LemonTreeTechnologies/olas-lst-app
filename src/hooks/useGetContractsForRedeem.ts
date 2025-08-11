import { StakingModel } from "@/utils/graphql/types";
import { useFetchActiveModels } from "./useFetchActiveModels";

const getContractWithStakeAmount = (
  contract: StakingModel,
  stakeAmount: bigint,
  remainingAmount: bigint,
) => {
  const allocation =
    stakeAmount < remainingAmount ? stakeAmount : remainingAmount;
  if (allocation <= BigInt(0)) return null;

  return {
    chainId: contract.chainId,
    stakingProxy: contract.stakingProxy,
    reminderPerSlot: contract.reminderPerSlot,
    allocation,
  };
};

export const useGetContractsForRedeem = (amount: bigint) => {
  const { data: stakingContracts, isLoading: isContractsLoading } =
    useFetchActiveModels(
      {
        reminderPerSlot_gte: 0,
        orderBy: "reminderPerSlot",
        orderDirection: "asc",
      },
      amount > BigInt(0),
    );

  if (!stakingContracts || isContractsLoading) {
    return {
      contracts: [],
      isLoading: isContractsLoading,
    };
  }

  /**
   * Calculate contracts with unstake amount for the provided total amount
   * Strategy:
   * 1) Free partially filled slots first (take currently filled amount), smallest filled amounts first
   * 2) Then free fully filled slots, preferring smaller stake limits first
   */
  let remainingAmount = amount;
  const contractsForRedeem: Array<{
    chainId: StakingModel["chainId"];
    stakingProxy: StakingModel["stakingProxy"];
    reminderPerSlot: StakingModel["reminderPerSlot"];
    allocation: bigint;
  }> = [];

  const models = stakingContracts.stakingModels;

  // Normalize data per model
  const normalized = models.map((model) => {
    const limit = BigInt(model.stakeLimitPerSlot);
    const reminder = BigInt(model.reminderPerSlot);
    const filledInPartial = limit - reminder; // if between (0, limit) => partial exists
    const hasPartial = filledInPartial > BigInt(0) && filledInPartial < limit;
    const usedSlots = Number(model.usedSlots);
    const fullSlotsCount = Math.max(usedSlots - (hasPartial ? 1 : 0), 0);

    return {
      model,
      limit,
      reminder,
      filledInPartial,
      hasPartial,
      fullSlotsCount,
    };
  });

  // Step 1: partially filled slots -> free the slot (unstake filled amount) by smallest filled first
  const partials = normalized
    .filter((item) => item.hasPartial)
    .sort((a, b) => (a.filledInPartial < b.filledInPartial ? -1 : 1));

  for (const item of partials) {
    if (remainingAmount <= BigInt(0)) break;
    const toUnstake = item.filledInPartial;
    const contractWithStakeAmount = getContractWithStakeAmount(
      item.model,
      toUnstake,
      remainingAmount,
    );
    if (contractWithStakeAmount) {
      contractsForRedeem.push(contractWithStakeAmount);
      remainingAmount -= contractWithStakeAmount.allocation;
    }
  }

  // Step 2: fully filled slots -> iterate per full slot by smallest limit first
  if (remainingAmount > BigInt(0)) {
    const fulls = normalized
      .filter((item) => item.fullSlotsCount > 0)
      .sort((a, b) => (a.limit < b.limit ? -1 : 1));

    for (const item of fulls) {
      if (remainingAmount <= BigInt(0)) break;
      const perSlotAmount = item.limit;
      for (let i = 0; i < item.fullSlotsCount; i++) {
        if (remainingAmount <= BigInt(0)) break;
        const contractWithStakeAmount = getContractWithStakeAmount(
          item.model,
          perSlotAmount,
          remainingAmount,
        );
        if (contractWithStakeAmount) {
          contractsForRedeem.push(contractWithStakeAmount);
          remainingAmount -= contractWithStakeAmount.allocation;
        }
      }
    }
  }

  return {
    contracts: contractsForRedeem,
    isLoading: isContractsLoading,
  };
};
