import { useReadContracts } from "wagmi";
import { ST_OLAS_ABI, ST_OLAS_ADDRESSES } from "@/constants/contracts/stOlas";
import { DEFAULT_CHAIN_ID } from "@/config/wagmi";

const ST_OLAS_FUNCTIONS = ["stakedBalance", "reserveBalance"] as const;

export const useStTotalStakedAssets = () => {
  const { data, isLoading, error } = useReadContracts({
    contracts: ST_OLAS_FUNCTIONS.map((functionName) => ({
      address: ST_OLAS_ADDRESSES[DEFAULT_CHAIN_ID],
      abi: ST_OLAS_ABI,
      chainId: DEFAULT_CHAIN_ID,
      functionName,
    })),
  });

  /**
   * Calculate total stake assets (stakedBalance + reserveBalance)
   */
  const [stakedBalance, reserveBalance] = data
    ? data.map(
        (result) =>
          (result?.status === "success" ? result.result : BigInt(0)) as bigint,
      )
    : [BigInt(0), BigInt(0)];

  const totalStakeAssets = stakedBalance + reserveBalance;

  return {
    totalStakeAssets,
    isLoading,
    error,
  };
};
