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

export const useGetContractsForDeposit = (amount: bigint) => {
  /**
   * Get active staking contracts sorted by reminderPerSlot
   */
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
   * Calculate contracts with stake amount for the provided total amount
   */
  let remainingAmount = amount;
  const contractsForDeposit: Array<{
    chainId: StakingModel["chainId"];
    stakingProxy: StakingModel["stakingProxy"];
    reminderPerSlot: StakingModel["reminderPerSlot"];
    allocation: bigint;
  }> = [];

  // First fill contracts with not fully taken slots
  for (const contract of stakingContracts.stakingModels) {
    if (remainingAmount <= BigInt(0)) break;
    if (contract.reminderPerSlot === contract.stakeLimitPerSlot) break;
    if (Number(contract.availableSlots) === 0) break;

    const reminderPerSlot = BigInt(contract.reminderPerSlot);
    const contractWithStakeAmount = getContractWithStakeAmount(
      contract,
      reminderPerSlot,
      remainingAmount,
    );

    if (contractWithStakeAmount) {
      contractsForDeposit.push(contractWithStakeAmount);
      remainingAmount -= contractWithStakeAmount.allocation;
    }
  }

  // Second fill remaining contracts to take available slots
  if (remainingAmount > BigInt(0)) {
    for (const contract of stakingContracts.stakingModels) {
      if (remainingAmount <= BigInt(0)) break;

      const stakeLimitPerSlot = BigInt(contract.stakeLimitPerSlot);
      let availableSlots = Number(contract.availableSlots);

      // If partial slot already taken, remove it from num of available
      if (
        contractsForDeposit.find(
          (item) =>
            item.chainId === contract.chainId &&
            item.stakingProxy.toLocaleLowerCase() ===
              contract.stakingProxy.toLocaleLowerCase(),
        )
      ) {
        availableSlots -= 1;
      }

      for (let i = 0; i < availableSlots; i++) {
        const contractWithStakeAmount = getContractWithStakeAmount(
          contract,
          stakeLimitPerSlot,
          remainingAmount,
        );

        if (contractWithStakeAmount) {
          contractsForDeposit.push(contractWithStakeAmount);
          remainingAmount -= contractWithStakeAmount.allocation;
        }

        if (remainingAmount <= BigInt(0)) break;
      }
    }
  }

  return {
    contracts: contractsForDeposit,
    isLoading: isContractsLoading,
  };
};
