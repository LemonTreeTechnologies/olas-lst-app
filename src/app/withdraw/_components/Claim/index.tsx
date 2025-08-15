"use client";

import { useMemo } from "react";
import { useAccount } from "wagmi";
import { Card } from "@/components/Card";
import { WalletConnectButton } from "@/components/layouts/WalletConnectButton";
import { Spinner } from "@/components/loaders/Spinner";
import { formatNumber, formatTimeDifference } from "@/utils/format";
import { Button } from "@/components/Button";

import Image from "next/image";
import { useStaker } from "@/hooks/useFetchStaker";
import { TOKEN_LOGOS } from "@/constants";
import { formatUnits } from "viem";
import { Tag } from "@/components/Tag";
import { LuCircleCheckBig, LuClock } from "react-icons/lu";
import { TxnLink } from "@/components/TxnLink";
import { DEFAULT_CHAIN_ID } from "@/config/wagmi";

export const Claim = () => {
  const { isConnected: isAccountConnected, address } = useAccount();

  const { data: stakerData, isLoading: isStakerLoading } = useStaker(
    { id: address },
    !!address,
  );

  const requests = useMemo(() => {
    const withdrawRequests = stakerData?.staker?.withdrawRequests;
    if (!withdrawRequests || withdrawRequests.length === 0) return [];

    const nowInSeconds = Math.floor(Date.now() / 1000);

    return withdrawRequests.map((item) => {
      const isComplete = !!item.requestExecution;
      const secondsTillAvailable = Number(item.withdrawTime) - nowInSeconds;
      const isAvailable = secondsTillAvailable <= 0;

      return {
        id: item.id,
        txHash: item.requestExecution?.transactionHash || item.transactionHash,
        isComplete,
        isAvailable,
        olasAmount: formatNumber(
          Number(formatUnits(BigInt(item.olasAmount), 18)),
        ),
        timeTillAvailable: isAvailable
          ? null
          : formatTimeDifference(secondsTillAvailable),
      };
    });
  }, [stakerData]);

  return (
    <Card title="Claim withdrawal">
      {isStakerLoading && <Spinner />}

      <div className="flex flex-col divide-y divide-[#FFFFFF1A]">
        {requests.map((request) => (
          <div
            className="flex items-center justify-between py-4"
            key={request.id}
          >
            <div className="flex gap-4 items-center text-base font-semibold">
              <Image
                src={TOKEN_LOGOS.OLAS}
                alt="OLAS logo"
                width="24"
                height="24"
              />
              {request.olasAmount}
            </div>
            <div className="flex gap-4 items-center">
              {request.isComplete ? (
                <Tag
                  icon={<LuCircleCheckBig color="#00CF6B" size={20} />}
                  className="bg-[#00CF6B1A] text-[#00CF6B]"
                >
                  Completed
                </Tag>
              ) : request.isAvailable ? (
                <Tag>Available</Tag>
              ) : (
                <Tag
                  icon={<LuClock color="#CFC500" size={20} />}
                  className="bg-[#CFC5001A] text-[#CFC500]"
                >
                  ~{request.timeTillAvailable}
                </Tag>
              )}
              <TxnLink hash={request.txHash} chainId={DEFAULT_CHAIN_ID} short />
            </div>
          </div>
        ))}
      </div>
      {!isAccountConnected ? (
        <div className="flex justify-end">
          <WalletConnectButton />
        </div>
      ) : (
        <>
          <div className="flex flex-auto">
            <Button className="w-full" disabled>
              Claim
            </Button>
          </div>
        </>
      )}
    </Card>
  );
};
