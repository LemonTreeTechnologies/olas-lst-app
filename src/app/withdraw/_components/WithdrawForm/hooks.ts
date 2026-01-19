import { Address } from "viem";
import { useCallback, useEffect } from "react";
import { useWriteContract } from "wagmi";
import { DEFAULT_CHAIN_ID } from "@/config/wagmi";
import { ContractForDeposit } from "@/types";
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

    try {
      reset();

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
          [[], chainIds],
          [],
          stakingProxies,
          [[], bridgePayloads],
          [values],
        ],
        value: BigInt(0),
      });
    } catch (error) {
      console.error("Error requesting withdrawal:", error);
    }
  }, [amount, contracts, isRequestLoading, reset, writeContract]);

  // Call onFinish when request is successful
  useEffect(() => {
    if (requestHash) {
      onFinish();
    }
  }, [requestHash, onFinish]);

  const status: RequestWithdrawalStatus = requestError
    ? "error"
    : isRequestLoading && !requestHash
      ? "requesting"
      : requestHash
        ? "requested"
        : "idle";

  const isBusy = status === "requesting";

  return {
    handleRequestToWithdraw,
    status,
    isBusy,
    requestHash,
    error: requestError,
  };
};
