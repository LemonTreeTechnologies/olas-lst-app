"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useAccount } from "wagmi";
import { Card } from "@/components/Card";
import { Spinner } from "@/components/loaders/Spinner";
import { formatNumber, formatTimeDifference, pluralize } from "@/utils/format";
import { useStaker } from "@/hooks/useFetchStaker";
import { formatUnits } from "viem";
import { WithdrawRequest } from "./types";
import { Button } from "@/components/Button";
import { WalletConnectButton } from "@/components/layouts/WalletConnectButton";
import { Status } from "./Status";
import { useFinalizeWithdrawal } from "./hooks";
import { useRefetchAfterUpdate } from "@/hooks/useRefetchAfterUpdate";
import { SCOPE_KEYS } from "@/constants/scopeKeys";
import { ClaimableRequest } from "./ClaimableRequest";

type SelectionHeaderProps = {
  claimableRequests: WithdrawRequest[];
  selectedRequests: Set<string>;
  onSelectAll: () => void;
};

const SelectionHeader = ({
  claimableRequests,
  selectedRequests,
  onSelectAll,
}: SelectionHeaderProps) => {
  if (claimableRequests.length <= 1) return null;

  const isAllSelected =
    selectedRequests.size === claimableRequests.length &&
    claimableRequests.length > 0;

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
          Select all claimable ({claimableRequests.length})
        </span>
      </div>
    </div>
  );
};

export const Claim = () => {
  const [selectedRequests, setSelectedRequests] = useState<Set<string>>(
    new Set(),
  );
  const busyRequests = useRef<Set<string>>(new Set());
  const { address, isConnected: isAccountConnected, chainId } = useAccount();
  const {
    data: stakerData,
    isLoading: isStakerLoading,
    isRefetching: isStakerRefetching,
  } = useStaker({ id: address }, !!address);
  const { handleClaim, status, isBusy, finalizeHash, error } =
    useFinalizeWithdrawal();

  const requests = useMemo<WithdrawRequest[]>(() => {
    const withdrawRequests = stakerData?.staker?.withdrawRequests;
    if (!withdrawRequests || withdrawRequests.length === 0) return [];

    const nowInSeconds = Math.floor(Date.now() / 1000);
    return withdrawRequests.map((item) => {
      const isComplete = !!item.requestExecution;
      const secondsTillAvailable = Number(item.withdrawTime) - nowInSeconds;
      const isAvailable = !isComplete && secondsTillAvailable <= 0;
      return {
        id: item.id,
        txHash: item.requestExecution?.transactionHash || item.transactionHash,
        isComplete,
        isAvailable,
        olasAmount: formatNumber(
          Number(formatUnits(BigInt(item.olasAmount), 18)),
        ),
        olasAmountInWei: item.olasAmount,
        timeTillAvailable: isAvailable
          ? null
          : formatTimeDifference(secondsTillAvailable),
        isApproved: false,
      };
    });
  }, [stakerData]);

  const availableRequests = requests.filter((request) => request.isAvailable);
  const claimableRequests = availableRequests.filter(
    (request) => !request.isComplete,
  );
  const hasClaimableRequests = claimableRequests.length > 0;
  const selectedRequestsData = useMemo(
    () =>
      claimableRequests.length === 1
        ? claimableRequests
        : claimableRequests.filter((request) =>
            selectedRequests.has(request.id),
          ),
    [claimableRequests, selectedRequests],
  );

  const handleSelect = (requestId: string, selected: boolean) => {
    const newSelection = new Set(selectedRequests);
    if (selected) newSelection.add(requestId);
    else newSelection.delete(requestId);
    setSelectedRequests(newSelection);
  };

  const handleSelectAll = () => {
    if (selectedRequests.size === claimableRequests.length) {
      setSelectedRequests(new Set());
    } else {
      setSelectedRequests(
        new Set(claimableRequests.map((request) => request.id)),
      );
    }
  };

  const handleBatchClaim = () => {
    if (selectedRequestsData.length === 0) return;
    const requestIds = selectedRequestsData.map((request) => request.id);
    const amounts = selectedRequestsData.map(
      (request) => request.olasAmountInWei,
    );
    busyRequests.current = new Set(requestIds);
    handleClaim(requestIds, amounts, () => setSelectedRequests(new Set()));
  };

  useRefetchAfterUpdate(finalizeHash, [SCOPE_KEYS.staker({ id: address })]);
  useEffect(() => {
    if (isStakerRefetching) {
      busyRequests.current = new Set([]);
    }
  }, [isStakerRefetching]);

  return (
    <Card title="Claim withdrawal">
      {isStakerLoading && (
        <div className="flex my-8 justify-center">
          <Spinner />
        </div>
      )}
      {!isStakerLoading && requests.length === 0 && (
        <div className="text-center text-lg my-8 font-tertiary">
          No withdrawal requests found
        </div>
      )}
      {!isStakerLoading && requests.length > 0 && (
        <>
          <div className="mb-6">
            <SelectionHeader
              claimableRequests={claimableRequests}
              selectedRequests={selectedRequests}
              onSelectAll={handleSelectAll}
            />
            <div className="flex flex-col divide-y divide-[#FFFFFF1A]">
              {requests.map((request) => (
                <ClaimableRequest
                  key={request.id}
                  request={request}
                  isSelected={selectedRequests.has(request.id)}
                  onSelect={handleSelect}
                  showCheckbox={
                    hasClaimableRequests && claimableRequests.length > 1
                  }
                  isClaiming={busyRequests.current.has(request.id)}
                  chainId={chainId ?? 0}
                />
              ))}
            </div>
          </div>
          <Status
            status={status}
            chainId={chainId}
            finalizeHash={finalizeHash}
            error={error}
          />
          {!isAccountConnected ? (
            <div className="flex justify-end">
              <WalletConnectButton />
            </div>
          ) : (
            <div className="flex flex-auto">
              <Button
                className="w-full"
                disabled={
                  selectedRequestsData.length === 0 || !hasClaimableRequests
                }
                onClick={handleBatchClaim}
                isLoading={isBusy}
              >
                {!hasClaimableRequests
                  ? "No claimable requests"
                  : selectedRequestsData.length === 0
                    ? "Select requests to claim"
                    : `Claim${selectedRequests.size > 0 ? ` ${selectedRequests.size} ${pluralize("request", selectedRequests.size)}` : ""}`}
              </Button>
            </div>
          )}
        </>
      )}
    </Card>
  );
};
