import { useReadContracts } from "wagmi";
import { STAKING_TOKEN_LOCKED_ABI } from "@/constants/contracts/stakingTokenLocked";
import { formatNumber } from "@/utils/format";
import { useFetchActiveModels } from "./useFetchActiveModels";
import { SECONDS_IN_YEAR } from "@/constants";
import { useStTotalStakedAssets } from "./useStTotalStakedAssets";
import { StakingModel } from "@/utils/graphql/types";
import { useMemo } from "react";
import { ContractForDeposit } from "@/types";

const PROD_TO_TESTNET_CHAIN_IDS: Record<string, number> = {
  "8453": 84532,
  "100": 1020,
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
      maximumFractionDigits: 2,
      minimumFractionDigits: 2,
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

const getUsedSlots = (contract: StakingModel | ContractForDeposit) => {
  return "usedSlots" in contract
    ? Number(contract.usedSlots)
    : contract.allocation < BigInt(contract.stakeLimitPerSlot)
      ? 0
      : 1;
};

export const useProjectedApr = (
  contractsForDeposit: ContractForDeposit[],
  stakeAmount: bigint,
) => {
  // Get active staking contracts
  const { data: stakingContracts, isLoading: isContractsLoading } =
    useFetchActiveModels({}, stakeAmount > BigInt(0));

  /**
   * Merge current active contracts with projected contracts
   * for deposit and combine their taken slots
   */
  const allStakingContracts = useMemo<ProjectedContract[]>(() => {
    if (isContractsLoading) return [];
    if (!stakingContracts) return [];

    const result: ProjectedContract[] = [];

    [...contractsForDeposit, ...stakingContracts.stakingModels].forEach(
      (contract) => {
        const contractIndex = result.findIndex(
          (stakingContract) =>
            stakingContract.chainId === contract.chainId &&
            stakingContract.stakingProxy.toLowerCase() ===
              contract.stakingProxy.toLowerCase(),
        );

        if (contractIndex === -1) {
          result.push({
            chainId: contract.chainId,
            stakingProxy: contract.stakingProxy,
            usedSlots: `${getUsedSlots(contract)}`,
          });
        } else {
          result[contractIndex].usedSlots = `${
            Number(result[contractIndex].usedSlots) + getUsedSlots(contract)
          }`;
        }
      },
    );

    return result;
  }, [contractsForDeposit, stakingContracts, isContractsLoading]);

  const {
    apr,
    isLoading: isAprLoading,
    error,
  } = useApr(allStakingContracts, stakeAmount);

  return {
    apr,
    isLoading: isContractsLoading || isAprLoading,
    error,
  };
};
