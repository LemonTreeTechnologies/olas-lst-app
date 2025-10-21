import { useCallback, useEffect, useState } from "react";
import { useWriteContract } from "wagmi";
import { DEFAULT_CHAIN_ID } from "@/config/wagmi";
import {
  TREASURY_ABI,
  TREASURY_ADDRESSES,
} from "@/constants/contracts/treasury";
import { FInalizeWithdrawalStatus } from "./types";

export const useFinalizeWithdrawal = () => {
  const [claimedRequestIds, setClaimedRequestIds] = useState<Set<string>>(
    new Set(),
  );

  const {
    data: finalizeHash,
    isPending: isFinalizeLoading,
    writeContract,
    reset,
    error: requestError,
  } = useWriteContract();

  // handles batch or single claim; expects: string[] for ids, string[] for amounts in wei
  const handleClaim = useCallback(
    async (requestIds: string[], amounts: string[]) => {
      if (requestIds.length === 0 || amounts.length === 0 || isFinalizeLoading)
        return;

      setClaimedRequestIds(new Set(requestIds));
      reset();

      writeContract({
        address: TREASURY_ADDRESSES[DEFAULT_CHAIN_ID],
        abi: TREASURY_ABI,
        functionName: "finalizeWithdrawRequests",
        args: [requestIds.map(BigInt), amounts.map(BigInt)],
      });
    },
    [isFinalizeLoading, reset, writeContract],
  );

  const status: FInalizeWithdrawalStatus = requestError
    ? "error"
    : isFinalizeLoading && !finalizeHash
      ? "finalizing"
      : finalizeHash
        ? "finalized"
        : "idle";

  useEffect(() => {
    if ((finalizeHash || requestError) && claimedRequestIds.size !== 0) {
      setClaimedRequestIds(new Set());
    }
  }, [finalizeHash, requestError, claimedRequestIds]);

  const isBusy = status === "finalizing";

  return {
    handleClaim,
    status,
    isBusy,
    finalizeHash,
    error: requestError,
    claimedRequestIds,
    reset,
  };
};
