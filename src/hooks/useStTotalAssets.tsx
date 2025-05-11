import { useReadContract } from "wagmi";
import { ST_OLAS_ABI, ST_OLAS_ADDRESSES } from "@/constants/contracts/stOlas";
import { formatNumber } from "@/utils/format";
import { formatUnits } from "viem";
import { DEFAULT_CHAIN_ID } from "@/config/wagmi";

export const useStTotalAssets = () => {
  const { data, isLoading, error } = useReadContract({
    address: ST_OLAS_ADDRESSES[DEFAULT_CHAIN_ID],
    abi: ST_OLAS_ABI,
    functionName: "totalAssets",
    chainId: DEFAULT_CHAIN_ID,
  });

  const formattedStTotalAssets = data
    ? formatNumber(Number(formatUnits(data, 18)))
    : "0";

  return {
    formattedStTotalAssets,
    stTotalAssetsInWei: data,
    isLoading,
    error,
  };
};
