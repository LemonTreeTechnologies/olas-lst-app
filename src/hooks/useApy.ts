import { useReadContracts } from "wagmi";
import { STAKING_TOKEN_LOCKED_ABI } from "@/constants/contracts/stakingTokenLocked";
import { formatNumber } from "@/utils/format";
import { useFetchActiveModels } from "./useFetchActiveModels";
import { SECONDS_IN_YEAR } from "@/constants";
import { useStTotalStakedAssets } from "./useStTotalStakedAssets";
import { StakingModel } from "@/utils/graphql/types";

const PROD_TO_TESTNET_CHAIN_IDS: Record<string, number> = {
  "8453": 84532,
  "100": 1020,
};

const useApy = (
  stakingContracts: (
    | StakingModel
    | Pick<StakingModel, "chainId" | "stakingProxy" | "usedSlots">
  )[],
) => {
  const contracts = stakingContracts.map((contract) => ({
    address: contract.stakingProxy,
    abi: STAKING_TOKEN_LOCKED_ABI,
    chainId: PROD_TO_TESTNET_CHAIN_IDS[contract.chainId],
    functionName: "rewardsPerSecond",
  }));

  const {
    data: contractsDetails,
    isLoading: isContractsDataLoading,
    error: contractDetailsError,
  } = useReadContracts({
    contracts,
    query: { enabled: contracts.length > 0 },
  });

  /**
   * Get totalStakeAssets
   */
  const {
    totalStakeAssets,
    isLoading: isStOlasTotalStakeAssetsLoading,
    error: stOlasTotalStakeAssetsError,
  } = useStTotalStakedAssets();

  // Loading state for all fetched data
  const isLoading = isContractsDataLoading || isStOlasTotalStakeAssetsLoading;

  /**
   * If some data not yet loaded - return a placeholder
   */
  if (!contractsDetails || !totalStakeAssets || !stakingContracts) {
    return {
      apy: "0",
      isLoading,
      error: stOlasTotalStakeAssetsError || contractDetailsError,
    };
  }

  /**
   * Calculate APY for each contract
   */
  const apys = stakingContracts.map((contract, index) => {
    const rewardsResult = contractsDetails[index];

    if (rewardsResult?.status !== "success") {
      return 0;
    }

    const usedSlots = contract.usedSlots;
    const rewardsPerSecond = rewardsResult.result as bigint;

    const numerator =
      BigInt(usedSlots) * rewardsPerSecond * BigInt(SECONDS_IN_YEAR);
    const apy = Number(numerator) / Number(totalStakeAssets);

    return apy;
  });

  // Calculate average APY from all contracts
  const averageApy = apys.reduce((sum, apy) => sum + apy, 0) / apys.length;

  return {
    apy: formatNumber(Math.floor(averageApy * 100), {
      maximumFractionDigits: 2,
      minimumFractionDigits: 2,
    }),
    isLoading,
    error: stOlasTotalStakeAssetsError || contractDetailsError,
  };
};

export const useCurrentApy = () => {
  // Get active staking contracts
  const { data: stakingContracts, isLoading: isContractsLoading } =
    useFetchActiveModels({});

  const {
    apy,
    isLoading: isApyLoading,
    error,
  } = useApy(stakingContracts ? stakingContracts.stakingModels : []);

  return {
    apy,
    isLoading: isContractsLoading || isApyLoading,
    error,
  };
};

export const useProjectedApy = (
  contractsForDeposit: {
    chainId: StakingModel["chainId"];
    stakingProxy: StakingModel["stakingProxy"];
    allocation: bigint;
  }[],
) => {
  const stakingContracts: Pick<
    StakingModel,
    "chainId" | "stakingProxy" | "usedSlots"
  >[] = [];

  contractsForDeposit.forEach((contractForDeposit) => {
    const contractIndex = stakingContracts.findIndex(
      (stakingContract) =>
        stakingContract.chainId === contractForDeposit.chainId &&
        stakingContract.stakingProxy === contractForDeposit.stakingProxy,
    );

    if (contractIndex === -1) {
      stakingContracts.push({
        chainId: contractForDeposit.chainId,
        stakingProxy: contractForDeposit.stakingProxy,
        // TODO: fix type as it's weird
        usedSlots: "1",
      });
    } else {
      stakingContracts[contractIndex].usedSlots =
        `${Number(stakingContracts[contractIndex].usedSlots) + 1}`;
    }
  });

  return useApy(stakingContracts);
};
