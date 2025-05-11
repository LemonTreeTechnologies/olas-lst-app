import { useAccount, useReadContract } from "wagmi";
import { erc20Abi, formatUnits } from "viem";
import { formatNumber } from "@/utils/format";
import { DEFAULT_CHAIN_ID } from "@/config/wagmi";

export const useFetchBalance = (
  tokenAddress?: `0x${string}`,
  decimals = 18,
) => {
  const { address } = useAccount();

  const {
    data: balance,
    isLoading,
    error,
  } = useReadContract({
    address: tokenAddress,
    abi: erc20Abi,
    functionName: "balanceOf",
    args: [address!],
    chainId: DEFAULT_CHAIN_ID,
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
