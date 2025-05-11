import { getStakingModels } from "@/utils/graphql/queries";
import { useQuery } from "@tanstack/react-query";

export const useFetchActiveModels = () => {
  return useQuery({
    queryKey: ["getActiveModels"],
    queryFn: async () =>
      getStakingModels({
        status: "Active",
      }),
  });
};
