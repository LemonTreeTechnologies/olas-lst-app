"use client";

import { Spinner } from "@/components/loaders/Spinner";
import { WithdrawRequest } from "./types";
import Image from "next/image";
import { TOKEN_LOGOS } from "@/constants";
import { Tag } from "@/components/Tag";
import { LuCircleCheckBig, LuClock } from "react-icons/lu";
import { TxnLink } from "@/components/TxnLink";

export const ClaimableRequest = ({
  request,
  isSelected,
  onSelect,
  showCheckbox,
  isClaiming,
  chainId,
}: {
  request: WithdrawRequest;
  isSelected: boolean;
  onSelect: (requestId: string, selected: boolean) => void;
  showCheckbox: boolean;
  isClaiming: boolean;
  chainId: number;
}) => {
  const isDisabled = request.isComplete || !request.isAvailable;

  return (
    <div className="flex items-center justify-between py-4 border-b border-[#FFFFFF1A] last:border-b-0">
      <div className="flex items-center gap-4">
        {showCheckbox && (
          <input
            type="checkbox"
            checked={isSelected}
            disabled={isDisabled || isClaiming}
            onChange={(e) => onSelect(request.id, e.target.checked)}
            className="w-4 h-4 text-[#364DED] bg-transparent border border-[#FFFFFF1A] rounded focus:ring-[#364DED] focus:ring-2 disabled:opacity-50 disabled:cursor-not-allowed"
          />
        )}
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
        {isClaiming ? (
          <div className="flex items-center gap-2">
            <Spinner />
            <span className="text-sm text-white/60">Claiming...</span>
          </div>
        ) : request.isComplete ? (
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
        <TxnLink hash={request.txHash} chainId={chainId ?? 0} short />
      </div>
    </div>
  );
};
