import { Address } from "viem";
import { useCallback, useEffect, useState } from "react";
import { useWriteContract } from "wagmi";
import { OLAS_ADDRESSES } from "@/constants/contracts/olas";
import {
  DEPOSITORY_ABI,
  DEPOSITORY_ADDRESSES,
} from "@/constants/contracts/depository";
import { DEFAULT_CHAIN_ID } from "@/config/wagmi";
import { useTokenApprove } from "@/hooks/useTokenApprove";
import { ContractForDeposit } from "@/types";

export const useStake = (contracts: ContractForDeposit[], amount: bigint) => {
  const [isStakeLoading, setIsStakeLoading] = useState(false);

  const [isDepositStarted, setIsDepositStarted] = useState(false);

  // check allowance and approve
  const {
    hash: approveHash,
    isLoading,
    isApprovalSuccessOrNotNeeded,
    error: approveError,
    approve,
  } = useTokenApprove({
    token: OLAS_ADDRESSES[DEFAULT_CHAIN_ID],
    spender: DEPOSITORY_ADDRESSES[DEFAULT_CHAIN_ID],
  });

  // stake
  const {
    data: depositHash,
    isPending: isDepositLoading,
    writeContract,
    reset,
    error: depositError,
  } = useWriteContract();

  const handleStake = useCallback(async () => {
    if (isStakeLoading) return;
    setIsStakeLoading(true);

    try {
      reset();

      // check allowance first
      await approve(amount);
    } catch {
      setIsStakeLoading(false);
    }
  }, [amount, approve, isStakeLoading, reset]);

  useEffect(() => {
    if (isStakeLoading && isApprovalSuccessOrNotNeeded && !isDepositStarted) {
      setIsDepositStarted(true);
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
        address: DEPOSITORY_ADDRESSES[DEFAULT_CHAIN_ID],
        abi: DEPOSITORY_ABI,
        functionName: "deposit",
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
    isDepositStarted,
    isStakeLoading,
    writeContract,
  ]);

  // Reset states once deposit finished
  useEffect(() => {
    if (isStakeLoading && isDepositStarted && !isDepositLoading) {
      setIsStakeLoading(false);
      setIsDepositStarted(false);
    }
  }, [isStakeLoading, isDepositStarted, isDepositLoading]);

  return {
    handleStake,
    isLoading: isStakeLoading || isDepositLoading,
    isApproveLoading: isLoading,
    isDepositLoading,
    isApprovalSuccessOrNotNeeded,
    approveHash,
    depositHash,
    error: approveError || depositError,
  };
};
