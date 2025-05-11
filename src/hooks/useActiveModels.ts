import { getStakingModels } from "@/utils/graphql/queries";
import { useQuery } from "@tanstack/react-query";

export const useActiveModels = () => {
  return useQuery({
    queryKey: ["getActiveModels"],
    queryFn: async () =>
      getStakingModels({
        status: "Active",
      }),
  });
};
