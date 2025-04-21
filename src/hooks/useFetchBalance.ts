import { useAccount, useReadContract } from "wagmi";
import { erc20Abi, formatUnits } from "viem";

export const useFetchBalance = (tokenAddress: `0x${string}`) => {
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
    query: {
      enabled: !!address && !!tokenAddress,
    },
  });

  const formattedBalance = balance
    ? // TODO: improve formatting
      Intl.NumberFormat("en-US", {
        notation: "compact",
        minimumFractionDigits: 2,
      }).format(
        Number(
          formatUnits(
            balance,
            // TODO: make dynamic or get from token
            18,
          ),
        ),
      )
    : "0";

  return {
    rawBalance: balance,
    formattedBalance,
    isLoading,
    error,
  };
};
