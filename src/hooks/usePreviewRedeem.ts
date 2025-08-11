import { useReadContract } from "wagmi";
import { formatUnits } from "viem";
import { formatNumber } from "@/utils/format";
import { DEFAULT_CHAIN_ID } from "@/config/wagmi";
import { ST_OLAS_ABI, ST_OLAS_ADDRESSES } from "@/constants/contracts/stOlas";

export const usePreviewRedeem = (amount: bigint) => {
  const {
    data: redeem,
    isLoading,
    error,
  } = useReadContract({
    address: ST_OLAS_ADDRESSES[DEFAULT_CHAIN_ID],
    abi: ST_OLAS_ABI,
    functionName: "previewRedeem",
    args: [amount],
    chainId: DEFAULT_CHAIN_ID,
    query: {
      enabled: amount > 0,
    },
  });

  const formattedRedeem = redeem
    ? formatNumber(Number(formatUnits(redeem, 18)))
    : "0";

  return {
    rawRedeem: redeem,
    formattedRedeem,
    isLoading,
    error,
  };
};
