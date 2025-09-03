import { DEFAULT_CHAIN_ID } from "@/config/wagmi";
import { Address, erc20Abi } from "viem";
import {
  useAccount,
  useWriteContract,
  useWaitForTransactionReceipt,
  usePublicClient,
} from "wagmi";
import { useState, useCallback, useEffect } from "react";
import {
  TREASURY_ABI,
  TREASURY_ADDRESSES,
} from "@/constants/contracts/treasury";

type ERC20Approve = {
  erc20: {
    token: Address;
    spender: Address;
  };
  erc6909?: never; // explicitly forbid
};

type ERC6909Approve = {
  erc20?: never; // explicitly forbid
  erc6909: {
    requestId: bigint;
  };
};

/**
 * Hook to handle token approval flow, including checking existing allowance within the approve function.
 * Returns the transaction hash, loading state, error state, and the approve function.
 *
 * Note: for treasury approvals requestId is required, pass it to args if provided
 */
export const useTokenApprove = ({
  erc20,
  erc6909,
}: ERC20Approve | ERC6909Approve): {
  hash: string | undefined;
  isLoading: boolean;
  isApprovalSuccessOrNotNeeded: boolean;
  error: Error | null;
  approve: (amount: bigint) => Promise<void>;
} => {
  const { address: account } = useAccount();
  const { writeContractAsync } = useWriteContract();
  const publicClient = usePublicClient({ chainId: DEFAULT_CHAIN_ID });
  const [approvalHash, setApprovalHash] = useState<`0x${string}` | undefined>(
    undefined,
  );
  const [isApproveLoading, setIsApproveLoading] = useState<boolean>(false);
  const [approveError, setApproveError] = useState<Error | null>(null);

  const [isApprovalSuccessOrNotNeeded, setIsApprovalSuccessOrNotNeeded] =
    useState<boolean>(false);

  const { isLoading: isTransactionLoading, error: transactionError } =
    useWaitForTransactionReceipt({
      chainId: DEFAULT_CHAIN_ID,
      hash: approvalHash,
    });

  const error = approveError || transactionError;

  const approve = useCallback(
    async (amount: bigint) => {
      if (!(erc20 || erc6909) || !account) {
        console.error("Missing required parameters for approval.");
        setApproveError(new Error("Missing required parameters."));
        return;
      }

      setIsApproveLoading(true);
      setApproveError(null);
      setApprovalHash(undefined);
      setIsApprovalSuccessOrNotNeeded(false);

      try {
        const allowanceData = await publicClient?.readContract({
          address: erc6909 ? TREASURY_ADDRESSES[DEFAULT_CHAIN_ID] : erc20.token,
          abi: erc6909 ? TREASURY_ABI : erc20Abi,
          functionName: "allowance",
          args: erc6909
            ? [account, TREASURY_ADDRESSES[DEFAULT_CHAIN_ID], erc6909.requestId]
            : [account, erc20.spender],
        });

        const currentAllowance = allowanceData
          ? BigInt(allowanceData)
          : BigInt(0);

        if (currentAllowance < amount) {
          const hash = await writeContractAsync({
            address: erc6909
              ? TREASURY_ADDRESSES[DEFAULT_CHAIN_ID]
              : erc20.token,
            abi: erc6909 ? TREASURY_ABI : erc20Abi,
            functionName: "approve",
            args: erc6909
              ? [
                  TREASURY_ADDRESSES[DEFAULT_CHAIN_ID],
                  erc6909.requestId,
                  amount,
                ]
              : [erc20.spender, amount],
          });
          setApprovalHash(hash);
        } else {
          setIsApprovalSuccessOrNotNeeded(true);
          console.log("Sufficient allowance already granted.");
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        console.error("Error during approval process:", error);
        setApproveError(error);
        throw error;
      } finally {
        setIsApproveLoading(false);
      }
    },
    [erc20, account, erc6909, writeContractAsync, publicClient],
  );

  useEffect(() => {
    // Check if approval is done
    if (approvalHash && !isApproveLoading && !isTransactionLoading) {
      setIsApprovalSuccessOrNotNeeded(true);
    }
  }, [approvalHash, isApproveLoading, isTransactionLoading]);

  return {
    hash: approvalHash,
    isLoading: isApproveLoading || isTransactionLoading,
    isApprovalSuccessOrNotNeeded,
    error,
    approve,
  };
};
