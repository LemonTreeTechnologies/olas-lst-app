import { getStaker } from "@/utils/graphql/queries";
import { GetStakerParams } from "@/utils/graphql/types";
import { useQuery } from "@tanstack/react-query";

export const useStaker = (params: GetStakerParams, enabled?: boolean) => {
  return useQuery({
    queryKey: ["getStaker", params],
    queryFn: async () => getStaker(params),
    enabled,
  });
};
