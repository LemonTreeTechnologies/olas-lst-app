import {
  getStakingModels,
  GetStakingModelsQueryParams,
} from "@/utils/graphql/queries";
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
