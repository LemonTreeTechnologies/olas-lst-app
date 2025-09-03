"use client";

import { useMemo, useState } from "react";
import { useAccount } from "wagmi";
import { Card } from "@/components/Card";
import { Spinner } from "@/components/loaders/Spinner";
import { formatNumber, formatTimeDifference } from "@/utils/format";
import { useStaker } from "@/hooks/useFetchStaker";
import { formatUnits } from "viem";
import { WithdrawRequest } from "./types";
import { DefaultView } from "./DefaultView";
import { ClaimView } from "./ClaimView";

export const Claim = () => {
  const [view, setView] = useState<"claim" | "default">("default");

  const { address } = useAccount();
  const { data: stakerData, isLoading: isStakerLoading } = useStaker(
    { id: address },
    !!address,
  );

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
      };
    });
  }, [stakerData]);

  const availableRequests = requests.filter((request) => request.isAvailable);
  const hasAvailableRequests = availableRequests.length > 0;

  return (
    <>
      <Card title="Claim withdrawal">
        {isStakerLoading && <Spinner />}

        {view === "default" && (
          <DefaultView
            requests={requests}
            isClaimDisabled={!hasAvailableRequests}
            onClaim={() => setView("claim")}
          />
        )}

        {view === "claim" && (
          <ClaimView
            availableRequests={availableRequests}
            onReturn={() => setView("default")}
          />
        )}
      </Card>
    </>
  );
};
