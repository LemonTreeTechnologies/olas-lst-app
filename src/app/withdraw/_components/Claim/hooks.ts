import { useCallback, useEffect, useState } from "react";
import { useWriteContract } from "wagmi";
import { DEFAULT_CHAIN_ID } from "@/config/wagmi";
import { useTokenApprove } from "@/hooks/useTokenApprove";
import {
  TREASURY_ABI,
  TREASURY_ADDRESSES,
} from "@/constants/contracts/treasury";
import { FInalizeWithdrawalStatus } from "./types";

export const useFinalizeWithdrawal = (
  requestId: bigint,
  amount: bigint,
  onFinish: () => void,
) => {
  const [isFinalizeWithdrawalLoading, setIsFinalizeWithdrawalLoading] =
    useState(false);
  const [isFinalizeStarted, setIsFinalizeStarted] = useState(false);

  // check allowance and approve
  const {
    hash: approveHash,
    isLoading,
    isApprovalSuccessOrNotNeeded,
    error: approveError,
    approve,
  } = useTokenApprove({
    erc6909: {
      requestId: requestId,
    },
  });

  // finalize withdrawal
  const {
    data: finalizeHash,
    isPending: isFinalizeLoading,
    writeContract,
    reset,
    error: requestError,
  } = useWriteContract();

  const handleFinalizeWithdraw = useCallback(async () => {
    if (isFinalizeLoading) return;
    setIsFinalizeWithdrawalLoading(true);

    try {
      reset();

      // check allowance first
      await approve(amount);
    } catch {
      setIsFinalizeWithdrawalLoading(false);
    }
  }, [amount, approve, isFinalizeLoading, reset]);

  useEffect(() => {
    if (
      isFinalizeWithdrawalLoading &&
      isApprovalSuccessOrNotNeeded &&
      !isFinalizeStarted
    ) {
      setIsFinalizeStarted(true);

      writeContract({
        address: TREASURY_ADDRESSES[DEFAULT_CHAIN_ID],
        abi: TREASURY_ABI,
        functionName: "finalizeWithdrawRequests",
        args: [[requestId], [amount]],
      });
    }
  }, [
    amount,
    isApprovalSuccessOrNotNeeded,
    isFinalizeStarted,
    isFinalizeWithdrawalLoading,
    requestId,
    writeContract,
  ]);

  // Reset states once request finished
  useEffect(() => {
    if (
      isFinalizeWithdrawalLoading &&
      isFinalizeStarted &&
      !isFinalizeLoading
    ) {
      setIsFinalizeWithdrawalLoading(false);
      setIsFinalizeStarted(false);

      if (finalizeHash) {
        onFinish();
      }
    }
  }, [
    isFinalizeLoading,
    isFinalizeStarted,
    isFinalizeWithdrawalLoading,
    finalizeHash,
    onFinish,
  ]);

  const baseError = approveError || requestError;

  const status: FInalizeWithdrawalStatus = baseError
    ? "error"
    : isFinalizeWithdrawalLoading && isLoading && !approveHash
      ? "approving"
      : isFinalizeWithdrawalLoading &&
          approveHash &&
          !isApprovalSuccessOrNotNeeded
        ? "approved"
        : isFinalizeWithdrawalLoading && isFinalizeLoading && !finalizeHash
          ? "finalizing"
          : finalizeHash
            ? "finalized"
            : "idle";

  const isBusy =
    status === "approving" ||
    status === "approved" ||
    status === "finalizing" ||
    status === "finalized";

  return {
    handleFinalizeWithdraw,
    status,
    isBusy,
    approveHash,
    finalizeHash,
    error: baseError,
  };
};
