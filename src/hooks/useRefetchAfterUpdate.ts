import { DEFAULT_CHAIN_ID } from "@/config/wagmi";
import { queryClient } from "@/context/ReownAppKitProvider";
import { useEffect, useRef } from "react";
import { useWaitForTransactionReceipt } from "wagmi";

export const useRefetchAfterUpdate = (
  updateHash: `0x${string}` | undefined,
  scopeKeys: string[],
) => {
  const reFetched = useRef(false);

  const { isSuccess } = useWaitForTransactionReceipt({
    chainId: DEFAULT_CHAIN_ID,
    hash: updateHash,
  });

  useEffect(() => {
    reFetched.current = false;
  }, [updateHash]);

  useEffect(() => {
    if (reFetched.current) return;
    if (isSuccess) {
      queryClient.refetchQueries({
        predicate: (query) =>
          scopeKeys.includes(
            (query.queryKey[1] as Record<string, string>)?.scopeKey,
          ),
      });
      reFetched.current = true;
    }
  }, [scopeKeys, isSuccess]);
};
