import { useReadContracts } from "wagmi";
import { ST_OLAS_ABI, ST_OLAS_ADDRESSES } from "@/constants/contracts/stOlas";
import { DEFAULT_CHAIN_ID } from "@/config/wagmi";

const ST_OLAS_FUNCTIONS = [
  "stakedBalance",
  "reserveBalance",
  "vaultBalance",
  "totalAssets",
  "totalSupply",
] as const;

export const useStOlasStatistics = () => {
  const { data, isLoading, error } = useReadContracts({
    contracts: ST_OLAS_FUNCTIONS.map((functionName) => ({
      address: ST_OLAS_ADDRESSES[DEFAULT_CHAIN_ID],
      abi: ST_OLAS_ABI,
      chainId: DEFAULT_CHAIN_ID,
      functionName,
    })),
  });

  const [
    stakedBalance,
    reserveBalance,
    vaultBalance,
    totalAssets,
    totalSupply,
  ] = data
    ? data.map(
        (result) =>
          (result?.status === "success" ? result.result : BigInt(0)) as bigint,
      )
    : Array(ST_OLAS_FUNCTIONS.length).fill(undefined);

  return {
    stakedBalance,
    reserveBalance,
    vaultBalance,
    totalAssets,
    totalSupply,
    isLoading,
    error,
  };
};
