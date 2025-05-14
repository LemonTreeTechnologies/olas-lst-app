import { DEFAULT_CHAIN_ID } from "@/config/wagmi";
import { Address, erc20Abi } from "viem";
import {
  useAccount,
  useWriteContract,
  useWaitForTransactionReceipt,
  usePublicClient,
} from "wagmi";
import { useState, useCallback, useEffect } from "react";

/**
 * Hook to handle token approval flow, including checking existing allowance within the approve function.
 * Returns the transaction hash, loading state, error state, and the approve function.
 */
export const useTokenApprove = ({
  token,
  spender,
}: {
  token?: Address;
  spender?: Address;
}): {
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
      if (!token || !account || !spender) {
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
          address: token,
          abi: erc20Abi,
          functionName: "allowance",
          args: [account, spender],
        });

        const currentAllowance = allowanceData
          ? BigInt(allowanceData)
          : BigInt(0);

        if (currentAllowance < amount) {
          const hash = await writeContractAsync({
            address: token,
            abi: erc20Abi,
            functionName: "approve",
            args: [spender, amount],
          });
          setApprovalHash(hash);
        } else {
          setIsApprovalSuccessOrNotNeeded(true);
          console.log("Sufficient allowance already granted.");
        }
      } catch (error: any) {
        console.error("Error during approval process:", error);
        setApproveError(error);
        throw error;
      } finally {
        setIsApproveLoading(false);
      }
    },
    [token, account, spender, writeContractAsync, publicClient],
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
