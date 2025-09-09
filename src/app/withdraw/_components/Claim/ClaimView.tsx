"use client";

import { useState, useMemo, useEffect } from "react";
import { Button } from "@/components/Button";
import Image from "next/image";
import { TOKEN_LOGOS } from "@/constants";
import { WithdrawRequest } from "./types";
import { useWriteContract } from "wagmi";
import {
  TREASURY_ABI,
  TREASURY_ADDRESSES,
} from "@/constants/contracts/treasury";
import { DEFAULT_CHAIN_ID } from "@/config/wagmi";
import { useTokenApprove } from "@/hooks/useTokenApprove";
import { LuCircleCheckBig } from "react-icons/lu";
import { pluralize } from "@/utils/format";

const ClaimableRequest = ({
  request,
  isSelected,
  onSelectionChange,
}: {
  request: WithdrawRequest;
  isSelected: boolean;
  onSelectionChange: (requestId: string, selected: boolean) => void;
}) => {
  const [isApproving, setIsApproving] = useState(false);

  const { approve } = useTokenApprove({
    erc6909: { requestId: BigInt(request.id) },
  });

  const handleApprove = async () => {
    if (isApproving) return;

    setIsApproving(true);
    try {
      await approve(BigInt(request.olasAmountInWei));
    } catch (error) {
      console.error("Approval failed:", error);
    } finally {
      // TODO: update the state properly
      // setIsApproving(false);
    }
  };

  return (
    <div className="flex items-center justify-between py-4 border-b border-[#FFFFFF1A] last:border-b-0">
      <div className="flex items-center gap-4">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={(e) => onSelectionChange(request.id, e.target.checked)}
          className="w-4 h-4 text-[#364DED] bg-transparent border border-[#FFFFFF1A] rounded focus:ring-[#364DED] focus:ring-2"
        />
        <div className="flex gap-4 items-center text-base font-semibold">
          <Image
            src={TOKEN_LOGOS.OLAS}
            alt="OLAS logo"
            width="24"
            height="24"
          />
          {request.olasAmount}
        </div>
      </div>

      <div className="flex gap-4 items-center">
        {request.isApproved ? (
          <div className="flex gap-2 items-center text-green-400 font-semibold px-3">
            <LuCircleCheckBig color="#00CF6B" size={16} /> Approved
          </div>
        ) : (
          <Button
            variant="secondary"
            onClick={handleApprove}
            disabled={isApproving}
            isLoading={isApproving}
          >
            {isApproving ? "Approving..." : "Approve"}
          </Button>
        )}
      </div>
    </div>
  );
};

const SelectionHeader = ({
  availableRequests,
  selectedRequests,
  onSelectAll,
}: {
  availableRequests: WithdrawRequest[];
  selectedRequests: Set<string>;
  onSelectAll: () => void;
}) => {
  const isAllSelected =
    selectedRequests.size === availableRequests.length &&
    availableRequests.length > 0;

  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-4">
        <input
          type="checkbox"
          checked={isAllSelected}
          onChange={onSelectAll}
          className="w-4 h-4 text-[#364DED] bg-transparent border border-[#FFFFFF1A] rounded focus:ring-[#364DED] focus:ring-2"
        />
        <span className="text-sm text-white/60">
          Select all ({availableRequests.length})
        </span>
      </div>
    </div>
  );
};

const BatchClaimButton = ({
  selectedRequests,
  availableRequests,
  onBatchClaim,
  isProcessing,
}: {
  selectedRequests: Set<string>;
  availableRequests: WithdrawRequest[];
  onBatchClaim: () => void;
  isProcessing: boolean;
}) => {
  const selected = availableRequests.filter((request) =>
    selectedRequests.has(request.id),
  );
  const approvedSelected = selected.filter((request) => request.isApproved);

  const allSelectedApproved =
    selected.length > 0 && approvedSelected.length === selected.length;

  const getButtonText = () => {
    if (!allSelectedApproved) {
      const pendingCount = selected.length - approvedSelected.length;
      return `Approve ${pendingCount} more ${pluralize("request", selected.length)} to enable batch claim`;
    }
    if (isProcessing) {
      return `Processing ${selected.length} ${pluralize("request", selected.length)}...`;
    }
    return `Batch Claim ${selected.length} approved ${pluralize("request", selected.length)}`;
  };

  return (
    <div className="mb-6">
      <Button
        className="w-full"
        onClick={onBatchClaim}
        disabled={isProcessing || !allSelectedApproved}
        isLoading={isProcessing}
      >
        {getButtonText()}
      </Button>
    </div>
  );
};

export const ClaimView = ({
  availableRequests,
  onReturn,
}: {
  availableRequests: WithdrawRequest[];
  onReturn: () => void;
}) => {
  const [selectedRequests, setSelectedRequests] = useState<Set<string>>(
    new Set(),
  );
  const {
    writeContract,
    isPending,
    data: batchHash,
    error,
    reset,
  } = useWriteContract();

  const selectedRequestsData = useMemo(
    () =>
      availableRequests.filter((request) => selectedRequests.has(request.id)),
    [availableRequests, selectedRequests],
  );

  const handleSelectionChange = (requestId: string, selected: boolean) => {
    const newSelection = new Set(selectedRequests);
    if (selected) newSelection.add(requestId);
    else newSelection.delete(requestId);
    setSelectedRequests(newSelection);
  };

  const handleSelectAll = () => {
    if (selectedRequests.size === availableRequests.length) {
      setSelectedRequests(new Set());
    } else {
      setSelectedRequests(
        new Set(availableRequests.map((request) => request.id)),
      );
    }
  };

  const handleBatchClaim = async () => {
    if (selectedRequestsData.length === 0) return;
    try {
      const requestIds = selectedRequestsData.map((request) =>
        BigInt(request.id),
      );
      const amounts = selectedRequestsData.map((request) =>
        BigInt(request.olasAmountInWei),
      );
      await writeContract({
        address: TREASURY_ADDRESSES[DEFAULT_CHAIN_ID],
        abi: TREASURY_ABI,
        functionName: "finalizeWithdrawRequests",
        args: [requestIds, amounts],
      });
    } catch (err) {
      console.error("Batch claim failed:", err);
    }
  };

  useEffect(() => () => reset(), [reset]);

  return (
    <>
      <div className="mb-6">
        <SelectionHeader
          availableRequests={availableRequests}
          selectedRequests={selectedRequests}
          onSelectAll={handleSelectAll}
        />

        <div className="flex flex-col divide-y divide-[#FFFFFF1A]">
          {availableRequests.map((request) => (
            <ClaimableRequest
              key={request.id}
              request={request}
              isSelected={selectedRequests.has(request.id)}
              onSelectionChange={handleSelectionChange}
            />
          ))}
        </div>
      </div>

      {selectedRequests.size > 0 && (
        <BatchClaimButton
          selectedRequests={selectedRequests}
          availableRequests={availableRequests}
          onBatchClaim={handleBatchClaim}
          isProcessing={isPending}
        />
      )}

      {error && (
        <div className="mb-6 text-sm text-red-400 text-center">
          Batch claim failed: {error.message}
        </div>
      )}
      {batchHash && (
        <div className="mb-6 text-sm text-green-400 text-center">
          Batch transaction submitted! Hash: {batchHash}
        </div>
      )}

      <div className="flex flex-auto">
        <Button className="w-full" onClick={onReturn}>
          Return
        </Button>
      </div>
    </>
  );
};
