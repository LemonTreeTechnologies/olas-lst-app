import { StakingModel } from "@/utils/graphql/types";
import { useFetchActiveModels } from "./useFetchActiveModels";

const withdrawFromContracts = (amount: bigint, models: StakingModel[]) => {
  let remainingAmount = BigInt(amount);
  const contractsForWithdrawal: Array<{
    chainId: StakingModel["chainId"];
    stakingProxy: StakingModel["stakingProxy"];
    allocation: bigint;
  }> = [];

  // Create a mutable deep copy to avoid side effects on the original array.
  const processedModels = models.map((model, index) => {
    const newModel = { ...model };
    if (!newModel.id) {
      // Add a unique ID for easier tracking
      newModel.id = `${newModel.stakingProxy}-${index}`;
    }
    return newModel;
  });

  while (remainingAmount > BigInt(0)) {
    let allocatedThisLoop = false;

    // Step 1: Withdraw from the largest partial slots first.
    const partialModels = processedModels
      .filter(
        (model) =>
          BigInt(model.reminderPerSlot) > BigInt(0) &&
          BigInt(model.reminderPerSlot) < BigInt(model.stakeLimitPerSlot),
      )
      .sort((a, b) =>
        BigInt(b.reminderPerSlot) < BigInt(a.reminderPerSlot) ? -1 : 1,
      );

    if (partialModels.length > 0) {
      const contract = partialModels[0];
      const reminderPerSlot = BigInt(contract.reminderPerSlot);
      const allocation =
        reminderPerSlot < remainingAmount ? reminderPerSlot : remainingAmount;

      contractsForWithdrawal.push({
        chainId: contract.chainId,
        stakingProxy: contract.stakingProxy,
        allocation,
      });
      remainingAmount -= allocation;
      allocatedThisLoop = true;

      const updatedModelIndex = processedModels.findIndex(
        (m) => m.id === contract.id,
      );
      if (updatedModelIndex > -1) {
        const newReminder = reminderPerSlot - allocation;
        processedModels[updatedModelIndex].reminderPerSlot =
          String(newReminder);

        if (newReminder <= BigInt(0)) {
          // If the partial slot is now empty, make it a full slot.
          const availableSlots = BigInt(
            processedModels[updatedModelIndex].availableSlots,
          );
          const numSlots = BigInt(processedModels[updatedModelIndex].numSlots);
          if (availableSlots + BigInt(1) <= numSlots) {
            processedModels[updatedModelIndex].availableSlots = String(
              availableSlots + BigInt(1),
            );
          }
          processedModels[updatedModelIndex].reminderPerSlot =
            processedModels[updatedModelIndex].stakeLimitPerSlot;
        }
      }
    }

    // Step 2: If no partial slots are available, withdraw from the largest full slots.
    if (!allocatedThisLoop && remainingAmount > BigInt(0)) {
      const fullSlotModels = processedModels
        .filter(
          (model) =>
            BigInt(model.availableSlots) > BigInt(0) &&
            BigInt(model.stakeLimitPerSlot) <= remainingAmount,
        )
        .sort((a, b) =>
          BigInt(b.stakeLimitPerSlot) < BigInt(a.stakeLimitPerSlot) ? -1 : 1,
        );

      if (fullSlotModels.length > 0) {
        const contract = fullSlotModels[0];
        const stakeLimitPerSlot = BigInt(contract.stakeLimitPerSlot);

        contractsForWithdrawal.push({
          chainId: contract.chainId,
          stakingProxy: contract.stakingProxy,
          allocation: stakeLimitPerSlot,
        });
        remainingAmount -= stakeLimitPerSlot;
        allocatedThisLoop = true;

        const updatedModelIndex = processedModels.findIndex(
          (model) => model.id === contract.id,
        );
        if (updatedModelIndex > -1) {
          const availableSlots = BigInt(
            processedModels[updatedModelIndex].availableSlots,
          );
          const numSlots = BigInt(processedModels[updatedModelIndex].numSlots);
          if (availableSlots + BigInt(1) <= numSlots) {
            processedModels[updatedModelIndex].availableSlots = String(
              availableSlots + BigInt(1),
            );
          }
        }
      }
    }

    // Step 3: If still not fully withdrawn, take the remaining amount from the smallest available full slot.
    if (!allocatedThisLoop && remainingAmount > BigInt(0)) {
      const smallestAvailableSlotModel = processedModels
        .filter((model) => BigInt(model.availableSlots) > BigInt(0))
        .sort((a, b) =>
          BigInt(a.stakeLimitPerSlot) < BigInt(b.stakeLimitPerSlot) ? -1 : 1,
        )[0];

      if (smallestAvailableSlotModel) {
        contractsForWithdrawal.push({
          chainId: smallestAvailableSlotModel.chainId,
          stakingProxy: smallestAvailableSlotModel.stakingProxy,
          allocation: remainingAmount,
        });

        const updatedModelIndex = processedModels.findIndex(
          (model) => model.id === smallestAvailableSlotModel.id,
        );
        if (updatedModelIndex > -1) {
          const availableSlots = BigInt(
            processedModels[updatedModelIndex].availableSlots,
          );
          const newReminder =
            BigInt(smallestAvailableSlotModel.stakeLimitPerSlot) -
            remainingAmount;

          processedModels[updatedModelIndex].reminderPerSlot =
            String(newReminder);
          // We are converting a full slot to a partial one, so we decrease the count of full slots.
          processedModels[updatedModelIndex].availableSlots = String(
            availableSlots - BigInt(1),
          );
        }

        remainingAmount = BigInt(0);
        allocatedThisLoop = true;
      }
    }

    if (!allocatedThisLoop) {
      break;
    }
  }

  return contractsForWithdrawal;
};

export const useGetContractsForRedeem = (amount: bigint) => {
  const { data: stakingContracts, isLoading: isContractsLoading } =
    useFetchActiveModels(
      {
        usedSlots_gte: 1,
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

  const contractsForRedeem = withdrawFromContracts(
    amount,
    stakingContracts.stakingModels,
  );

  return {
    contracts: contractsForRedeem,
    isLoading: isContractsLoading,
  };
};
