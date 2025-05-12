import { useReadContract } from "wagmi";
import { formatUnits } from "viem";
import { formatNumber } from "@/utils/format";
import { DEFAULT_CHAIN_ID } from "@/config/wagmi";
import { ST_OLAS_ABI, ST_OLAS_ADDRESSES } from "@/constants/contracts/stOlas";

export const usePreviewDeposit = (amount: bigint) => {
  const {
    data: deposit,
    isLoading,
    error,
  } = useReadContract({
    address: ST_OLAS_ADDRESSES[DEFAULT_CHAIN_ID],
    abi: ST_OLAS_ABI,
    functionName: "previewDeposit",
    args: [amount],
    chainId: DEFAULT_CHAIN_ID,
    query: {
      enabled: amount > 0,
    },
  });

  const formattedDeposit = deposit
    ? formatNumber(Number(formatUnits(deposit, 18)))
    : "0";

  return {
    rawDeposit: deposit,
    formattedDeposit,
    isLoading,
    error,
  };
};
