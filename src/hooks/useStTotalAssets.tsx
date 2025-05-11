import { useReadContract } from "wagmi";
import { ST_OLAS_ABI, ST_OLAS_ADDRESSES } from "@/constants/contracts/stOlas";
import { useChainId } from "@/hooks/useChainId";
import { formatNumber } from "@/utils/format";
import { formatUnits } from "viem";

export const useStTotalAssets = () => {
  const chainId = useChainId();

  const { data, isLoading, error } = useReadContract({
    address: ST_OLAS_ADDRESSES[chainId],
    abi: ST_OLAS_ABI,
    functionName: "totalAssets",
    chainId,
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
