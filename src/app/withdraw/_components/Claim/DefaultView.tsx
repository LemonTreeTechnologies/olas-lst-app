"use client";

import { useAccount } from "wagmi";
import { WalletConnectButton } from "@/components/layouts/WalletConnectButton";
import { Button } from "@/components/Button";

import Image from "next/image";
import { TOKEN_LOGOS } from "@/constants";
import { Tag } from "@/components/Tag";
import { LuCircleCheckBig, LuClock } from "react-icons/lu";
import { TxnLink } from "@/components/TxnLink";
import { DEFAULT_CHAIN_ID } from "@/config/wagmi";
import { WithdrawRequest } from "./types";

type DefaultViewProps = {
  requests: WithdrawRequest[];
  isClaimDisabled: boolean;
  onClaim: () => void;
};

export const DefaultView = ({
  requests,
  isClaimDisabled,
  onClaim,
}: DefaultViewProps) => {
  const { isConnected: isAccountConnected } = useAccount();

  return (
    <>
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
        <div className="flex flex-auto">
          <Button
            className="w-full"
            disabled={isClaimDisabled}
            onClick={onClaim}
          >
            Claim
          </Button>
        </div>
      )}
    </>
  );
};
