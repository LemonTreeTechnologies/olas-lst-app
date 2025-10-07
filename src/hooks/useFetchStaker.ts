import { SCOPE_KEYS } from "@/constants/scopeKeys";
import { getStaker } from "@/utils/graphql/queries";
import { GetStakerParams } from "@/utils/graphql/types";
import { useQuery } from "@tanstack/react-query";

export const useStaker = (params: GetStakerParams, enabled?: boolean) => {
  return useQuery({
    queryKey: ["useQuery", { scopeKey: SCOPE_KEYS.staker(params) }],
    queryFn: async () => getStaker(params),
    enabled,
  });
};
