import { useReadContracts } from "wagmi";
import { STAKING_TOKEN_LOCKED_ABI } from "@/constants/contracts/stakingTokenLocked";
import { formatNumber } from "@/utils/format";
import { useFetchActiveModels } from "./useFetchActiveModels";
import { ST_OLAS_ABI, ST_OLAS_ADDRESSES } from "@/constants/contracts/stOlas";
import { DEFAULT_CHAIN_ID } from "@/config/wagmi";

const PROD_TO_TESTNET_CHAIN_IDS: Record<string, number> = {
  "8453": 84532,
  "100": 1020,
};

const ST_OLAS_FUNCTIONS = ["stakedBalance", "reserveBalance"] as const;

const SECONDS_IN_YEAR = 365 * 24 * 60 * 60;

export const useApy = () => {
  /**
   * Get active staking contracts
   */
  const { data: stakingContracts, isLoading: isContractsLoading } =
    useFetchActiveModels();

  const contracts = stakingContracts
    ? stakingContracts.stakingModels.map((contract) => ({
        address: contract.stakingProxy,
        abi: STAKING_TOKEN_LOCKED_ABI,
        chainId: PROD_TO_TESTNET_CHAIN_IDS[contract.chainId],
        functionName: "rewardsPerSecond",
      }))
    : [];

  const {
    data: contractsDetails,
    isLoading: isContractsDataLoading,
    error: contractDetailsError,
  } = useReadContracts({
    contracts,
    query: { enabled: contracts.length > 0 },
  });

  /**
   * Get stakedBalance and reserveBalance of stOLAS
   */
  const {
    data: stOlasTotalStakeAssets,
    isLoading: isStOlasTotalStakeAssetsLoading,
    error: stOlasTotalStakeAssetsError,
  } = useReadContracts({
    contracts: ST_OLAS_FUNCTIONS.map((functionName) => ({
      address: ST_OLAS_ADDRESSES[DEFAULT_CHAIN_ID],
      abi: ST_OLAS_ABI,
      chainId: DEFAULT_CHAIN_ID,
      functionName,
    })),
  });

  /**
   * Loading state for all fetched data
   */
  const isLoading =
    isContractsLoading ||
    isContractsDataLoading ||
    isStOlasTotalStakeAssetsLoading;

  /**
   * If some data not yet loaded - return a placeholder
   */
  if (!contractsDetails || !stOlasTotalStakeAssets || !stakingContracts) {
    return {
      apy: "0",
      isLoading,
      error: stOlasTotalStakeAssetsError || contractDetailsError,
    };
  }

  /**
   * Calculate total stake assets (stakedBalance + reserveBalance)
   */
  const [stakedBalance, reserveBalance] = stOlasTotalStakeAssets.map(
    (result) =>
      (result?.status === "success" ? result.result : BigInt(0)) as bigint,
  );
  const totalStakeAssets = stakedBalance + reserveBalance;

  /**
   * Calculate APY for each contract
   */
  const apys = stakingContracts.stakingModels.map((contract, index) => {
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

// TBD
export const useProjectedApy = () => {
  return null;
};
