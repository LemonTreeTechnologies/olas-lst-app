import { getStakingModels } from "@/utils/graphql/queries";
import { GetStakingModelsQueryParams } from "@/utils/graphql/types";
import { useQuery } from "@tanstack/react-query";

export const useFetchActiveModels = (
  params: Omit<GetStakingModelsQueryParams, "status">,
  enabled?: boolean,
) => {
  return useQuery({
    queryKey: ["getActiveModels", params],
    queryFn: async () =>
      getStakingModels({
        status: "Active",
        ...params,
      }),
    enabled,
  });
};
