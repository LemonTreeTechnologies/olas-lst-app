import { GetStakerParams } from "@/utils/graphql/types";

export const SCOPE_KEYS = {
  stOlas: (address: `0x${string}` | undefined, chainId: number | undefined) =>
    `stOlas_${address}_${chainId}`,
  stOlasStatistics: "stOlas_statistics",
  staker: (params: GetStakerParams) => `staker_${params.id}`,
};
