import { useAccount, useReadContract } from "wagmi";
import { erc20Abi, formatUnits } from "viem";
import { useChainId } from "@/hooks/useChainId";
import { formatNumber } from "@/utils/format";

export const useFetchActiveModels = (
  tokenAddress?: `0x${string}`,
  decimals = 18,
) => {
  const { address } = useAccount();
  const chainId = useChainId();

  const {
    data: balance,
    isLoading,
    error,
  } = useReadContract({
    address: tokenAddress,
    abi: erc20Abi,
    functionName: "balanceOf",
    args: [address!],
    chainId,
    query: {
      enabled: !!address && !!tokenAddress,
    },
  });

  const formattedBalance = balance
    ? formatNumber(Number(formatUnits(balance, decimals)))
    : "0";

  return {
    rawBalance: balance,
    formattedBalance,
    isLoading,
    error,
  };
};
