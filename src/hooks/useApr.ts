import { useReadContracts } from "wagmi";
import { STAKING_TOKEN_LOCKED_ABI } from "@/constants/contracts/stakingTokenLocked";
import { formatNumber } from "@/utils/format";
import { useFetchActiveModels } from "./useFetchActiveModels";
import { SECONDS_IN_YEAR } from "@/constants";
import { useStTotalStakedAssets } from "./useStTotalStakedAssets";
import { StakingModel } from "@/utils/graphql/types";

const PROD_TO_TESTNET_CHAIN_IDS: Record<string, number> = {
  "8453": 84532,
  "100": 10200,
};

type ProjectedContract = Pick<
  StakingModel,
  "chainId" | "stakingProxy" | "usedSlots"
>;

const useApr = (
  stakingContracts: (StakingModel | ProjectedContract)[],
  projectedStakeAssets: bigint = BigInt(0),
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
      apr: "0",
      isLoading,
      error: stOlasTotalStakeAssetsError || contractDetailsError,
    };
  }

  /**
   * Calculate total rewards per year for taken slots in each contract
   */
  const numerators = stakingContracts.map((contract, index) => {
    const rewardsResult = contractsDetails[index];

    if (rewardsResult?.status !== "success") {
      return BigInt(0);
    }

    const usedSlots = contract.usedSlots;
    const rewardsPerSecond = rewardsResult.result as bigint;

    return BigInt(usedSlots) * rewardsPerSecond * BigInt(SECONDS_IN_YEAR);
  });

  const averageApr =
    Number(numerators.reduce((sum, cur) => sum + cur, BigInt(0))) /
    Number(totalStakeAssets + projectedStakeAssets);

  return {
    apr: formatNumber(Math.floor(averageApr * 100), {
      maximumFractionDigits: 1,
    }),
    isLoading,
    error: stOlasTotalStakeAssetsError || contractDetailsError,
  };
};

export const useCurrentApr = () => {
  // Get active staking contracts
  const { data: stakingContracts, isLoading: isContractsLoading } =
    useFetchActiveModels({});

  const {
    apr,
    isLoading: isAprLoading,
    error,
  } = useApr(stakingContracts ? stakingContracts.stakingModels : []);

  return {
    apr,
    isLoading: isContractsLoading || isAprLoading,
    error,
  };
};
