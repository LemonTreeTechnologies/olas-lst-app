import { Address } from "viem";
import { useCallback, useEffect, useState } from "react";
import { useWriteContract } from "wagmi";
import { DEFAULT_CHAIN_ID } from "@/config/wagmi";
import { useTokenApprove } from "@/hooks/useTokenApprove";
import { ContractForDeposit } from "@/types";
import { ST_OLAS_ADDRESSES } from "@/constants/contracts/stOlas";
import {
  TREASURY_ABI,
  TREASURY_ADDRESSES,
} from "@/constants/contracts/treasury";
import { RequestWithdrawalStatus } from "./types";

export const useRequestWithdrawal = (
  contracts: ContractForDeposit[],
  amount: bigint,
  onFinish: () => void,
) => {
  const [isRequestWithdrawalLoading, setIsRequestWithdrawalLoading] =
    useState(false);
  const [isRequestStarted, setIsRequestStarted] = useState(false);

  // check allowance and approve
  const {
    hash: approveHash,
    isLoading,
    isApprovalSuccessOrNotNeeded,
    error: approveError,
    approve,
  } = useTokenApprove({
    token: ST_OLAS_ADDRESSES[DEFAULT_CHAIN_ID],
    spender: TREASURY_ADDRESSES[DEFAULT_CHAIN_ID],
  });

  // request withdrawal
  const {
    data: requestHash,
    isPending: isRequestLoading,
    writeContract,
    reset,
    error: requestError,
  } = useWriteContract();

  const handleRequestToWithdraw = useCallback(async () => {
    if (isRequestLoading) return;
    setIsRequestWithdrawalLoading(true);

    try {
      reset();

      // check allowance first
      await approve(amount);
    } catch {
      setIsRequestWithdrawalLoading(false);
    }
  }, [amount, approve, isRequestLoading, reset]);

  useEffect(() => {
    if (
      isRequestWithdrawalLoading &&
      isApprovalSuccessOrNotNeeded &&
      !isRequestStarted
    ) {
      setIsRequestStarted(true);

      const chainIds: bigint[] = [];
      const stakingProxies: Address[] = [];
      const bridgePayloads: `0x${string}`[] = [];
      const values: bigint[] = [];

      contracts.forEach((contract) => {
        chainIds.push(BigInt(contract.chainId));
        stakingProxies.push(contract.stakingProxy);
        bridgePayloads.push("0x");
        values.push(BigInt(0));
      });

      writeContract({
        address: TREASURY_ADDRESSES[DEFAULT_CHAIN_ID],
        abi: TREASURY_ABI,
        functionName: "requestToWithdraw",
        args: [
          BigInt(amount),
          chainIds,
          stakingProxies,
          bridgePayloads,
          values,
        ],
        value: BigInt(0),
      });
    }
  }, [
    amount,
    contracts,
    isApprovalSuccessOrNotNeeded,
    isRequestStarted,
    isRequestWithdrawalLoading,
    writeContract,
  ]);

  // Reset states once request finished
  useEffect(() => {
    if (isRequestWithdrawalLoading && isRequestStarted && !isRequestLoading) {
      setIsRequestWithdrawalLoading(false);
      setIsRequestStarted(false);

      if (requestHash) {
        onFinish();
      }
    }
  }, [
    isRequestLoading,
    isRequestStarted,
    isRequestWithdrawalLoading,
    requestHash,
    onFinish,
  ]);

  const baseError = approveError || requestError;

  const status: RequestWithdrawalStatus = baseError
    ? "error"
    : isRequestWithdrawalLoading && isLoading && !approveHash
      ? "approving"
      : isRequestWithdrawalLoading &&
          approveHash &&
          !isApprovalSuccessOrNotNeeded
        ? "approved"
        : isRequestWithdrawalLoading && isRequestLoading && !requestHash
          ? "requesting"
          : requestHash
            ? "requested"
            : "idle";

  const isBusy =
    status === "approving" || status === "approved" || status === "requesting";

  return {
    handleRequestToWithdraw,
    status,
    isBusy,
    approveHash,
    requestHash,
    error: baseError,
  };
};
