import { useReadContract } from "wagmi";
import { erc20Abi, formatUnits } from "viem";
import { formatNumber } from "@/utils/format";
import { DEFAULT_CHAIN_ID } from "@/config/wagmi";
import { OLAS_ADDRESSES } from "@/constants/contracts/olas";
import { ST_OLAS_ADDRESSES } from "@/constants/contracts/stOlas";
import { SCOPE_KEYS } from "@/constants/scopeKeys";

export const useFetchBalance = ({
  walletAddress,
  tokenAddress,
  decimals = 18,
  scopeKey,
}: {
  walletAddress?: `0x${string}`;
  tokenAddress?: `0x${string}`;
  decimals?: number;
  scopeKey?: string;
}) => {
  const {
    data: balance,
    isLoading,
    error,
  } = useReadContract({
    address: tokenAddress,
    abi: erc20Abi,
    functionName: "balanceOf",
    args: [walletAddress!],
    chainId: DEFAULT_CHAIN_ID,
    scopeKey,
    query: {
      enabled: !!walletAddress && !!tokenAddress,
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

export const useOlasBalances = (
  address: `0x${string}` | undefined,
  chainId: number | undefined,
) => {
  const {
    formattedBalance: olasFormattedBalance,
    rawBalance: olasBalance,
    isLoading: isOlasBalanceLoading,
  } = useFetchBalance({
    walletAddress: address,
    tokenAddress: chainId ? OLAS_ADDRESSES[chainId] : undefined,
  });
  const {
    formattedBalance: stOlasFormattedBalance,
    rawBalance: stOlasBalance,
    isLoading: isStOlasBalanceLoading,
  } = useFetchBalance({
    walletAddress: address,
    tokenAddress: chainId ? ST_OLAS_ADDRESSES[chainId] : undefined,
    scopeKey: SCOPE_KEYS.stOlas(address, chainId),
  });

  const availableOlasBalance =
    olasBalance !== undefined && stOlasBalance !== undefined
      ? olasBalance - stOlasBalance
      : undefined;
  const availableOlasFormattedBalance =
    availableOlasBalance !== undefined
      ? formatNumber(
          Number(
            formatUnits(
              availableOlasBalance < 0 ? BigInt(0) : availableOlasBalance,
              18,
            ),
          ),
        )
      : "0";

  return {
    olasFormattedBalance,
    olasBalance,
    stOlasFormattedBalance,
    stOlasBalance,
    availableOlasBalance,
    availableOlasFormattedBalance,
    isLoading: isOlasBalanceLoading || isStOlasBalanceLoading,
  };
};
