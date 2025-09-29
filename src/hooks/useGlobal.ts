import { getGlobal } from "@/utils/graphql/queries";
import { useQuery } from "@tanstack/react-query";

export const useFetchGlobal = () => {
  return useQuery({
    queryKey: ["getGlobal"],
    queryFn: getGlobal,
  });
};
