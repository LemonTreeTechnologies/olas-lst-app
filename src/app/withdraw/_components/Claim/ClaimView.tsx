"use client";

import { Button } from "@/components/Button";

import Image from "next/image";
import { TOKEN_LOGOS } from "@/constants";
import { WithdrawRequest } from "./types";
import { useFinalizeWithdrawal } from "./hooks";
import { useAccount } from "wagmi";
import { Status } from "./Status";

type ClaimableRequestProps = {
  requestId: string;
  amount: string;
  amountInWei: string;
};

const ClaimableRequest = ({
  requestId,
  amount,
  amountInWei,
}: ClaimableRequestProps) => {
  const { chainId } = useAccount();
  const {
    handleFinalizeWithdraw,
    isBusy,
    status,
    approveHash,
    finalizeHash,
    error,
  } = useFinalizeWithdrawal(BigInt(requestId), BigInt(amountInWei), () => {});

  return (
    <div>
      <div className="flex items-center justify-between py-4" key={requestId}>
        <div className="flex gap-4 items-center text-base font-semibold">
          <Image
            src={TOKEN_LOGOS.OLAS}
            alt="OLAS logo"
            width="24"
            height="24"
          />
          {amount}
        </div>
        <div className="flex gap-4 items-center">
          <Button
            variant="secondary"
            disabled={isBusy}
            onClick={handleFinalizeWithdraw}
          >
            Claim
          </Button>
        </div>
      </div>
      <Status
        status={status}
        chainId={chainId}
        approveHash={approveHash}
        finalizeHash={finalizeHash}
        error={error}
      />
    </div>
  );
};

type ClaimDetailsProps = {
  availableRequests: WithdrawRequest[];
  onReturn: () => void;
};

export const ClaimView = ({
  availableRequests,
  onReturn,
}: ClaimDetailsProps) => {
  return (
    <>
      <div className="flex flex-col divide-y divide-[#FFFFFF1A]">
        {availableRequests.map((request) => (
          <ClaimableRequest
            key={request.id}
            requestId={request.id}
            amount={request.olasAmount}
            amountInWei={request.olasAmountInWei}
          />
        ))}
      </div>
      <div className="flex flex-auto">
        <Button className="w-full" onClick={onReturn}>
          Return
        </Button>
      </div>
    </>
  );
};
