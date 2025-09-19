import { StakingModel } from "@/utils/graphql/types";
import { useFetchActiveModels } from "./useFetchActiveModels";

const allocateDepositToContracts = (amount: bigint, models: StakingModel[]) => {
  let remainingAmount = BigInt(amount);
  const contractsForDeposit: Array<{
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

  while (remainingAmount > BigInt(0) && processedModels.length > 0) {
    let allocatedThisLoop = false;

    // Step 1: Find and fill a partially taken slot with the smallest remaining amount needed.
    const partialModels = processedModels
      .filter(
        (model) =>
          BigInt(model.reminderPerSlot) > BigInt(0) &&
          BigInt(model.reminderPerSlot) < BigInt(model.stakeLimitPerSlot),
      )
      .sort((a, b) =>
        BigInt(a.reminderPerSlot) < BigInt(b.reminderPerSlot) ? -1 : 1,
      );

    if (partialModels.length > 0) {
      const contract = partialModels[0];
      const reminderPerSlot = BigInt(contract.reminderPerSlot);
      const allocation =
        reminderPerSlot < remainingAmount ? reminderPerSlot : remainingAmount;

      if (allocation > BigInt(0)) {
        contractsForDeposit.push({
          chainId: contract.chainId,
          stakingProxy: contract.stakingProxy,
          allocation,
        });
        remainingAmount -= allocation;
        allocatedThisLoop = true;

        // Update the state of the model.
        const updatedModelIndex = processedModels.findIndex(
          (model) => model.id === contract.id,
        );
        if (updatedModelIndex > -1) {
          const newReminder = reminderPerSlot - allocation;
          processedModels[updatedModelIndex].reminderPerSlot =
            String(newReminder);
          if (newReminder <= BigInt(0)) {
            const availableSlots = BigInt(
              processedModels[updatedModelIndex].availableSlots,
            );
            processedModels[updatedModelIndex].availableSlots = String(
              availableSlots - BigInt(1),
            );
          }
        }
      }
    }

    // Step 2: If no partial slots are filled, find the biggest one that can be filled fully.
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

        contractsForDeposit.push({
          chainId: contract.chainId,
          stakingProxy: contract.stakingProxy,
          allocation: stakeLimitPerSlot,
        });
        remainingAmount -= stakeLimitPerSlot;
        allocatedThisLoop = true;

        // Decrease the available slots for the model we just filled.
        const updatedModelIndex = processedModels.findIndex(
          (model) => model.id === contract.id,
        );
        if (updatedModelIndex > -1) {
          const availableSlots = BigInt(
            processedModels[updatedModelIndex].availableSlots,
          );
          processedModels[updatedModelIndex].availableSlots = String(
            availableSlots - BigInt(1),
          );
        }
      }
    }

    // Step 3: If still not allocated, find the smallest available slot and put the remaining amount there.
    if (!allocatedThisLoop && remainingAmount > BigInt(0)) {
      const smallestAvailableSlotModel = processedModels
        .filter(
          (model) =>
            BigInt(model.availableSlots) > BigInt(0) &&
            BigInt(model.reminderPerSlot) > BigInt(0),
        )
        .sort((a, b) =>
          BigInt(a.stakeLimitPerSlot) < BigInt(b.stakeLimitPerSlot) ? -1 : 1,
        )[0];

      if (smallestAvailableSlotModel) {
        contractsForDeposit.push({
          chainId: smallestAvailableSlotModel.chainId,
          stakingProxy: smallestAvailableSlotModel.stakingProxy,
          allocation: remainingAmount,
        });

        // Update the model to reflect the new partial fill.
        const updatedModelIndex = processedModels.findIndex(
          (model) => model.id === smallestAvailableSlotModel.id,
        );
        if (updatedModelIndex > -1) {
          processedModels[updatedModelIndex].reminderPerSlot =
            String(remainingAmount);
        }

        remainingAmount = BigInt(0); // All remaining amount is allocated.
        allocatedThisLoop = true;
      }
    }

    if (!allocatedThisLoop) {
      break;
    }
  }

  return contractsForDeposit;
};

export const useGetContractsForDeposit = (amount: bigint) => {
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

  const contractsForDeposit = allocateDepositToContracts(
    amount,
    stakingContracts.stakingModels,
  );

  return {
    contracts: contractsForDeposit,
    isLoading: isContractsLoading,
  };
};
