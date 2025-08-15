"use client";

import Image from "next/image";
import { useAccount } from "wagmi";
import { useOlasBalances } from "@/hooks/useFetchBalance";
import { Wallet } from "@/components/Wallet/Wallet";
import { TOKEN_LOGOS } from "@/constants";
import { LuClock, LuCircleCheckBig } from "react-icons/lu";
import { useStaker } from "@/hooks/useFetchStaker";
import { Spinner } from "@/components/loaders/Spinner";
import { InputSkeleton } from "@/components/loaders/Skeleton";

export const WalletInfo = () => {
  const { isConnected, chainId, address } = useAccount();
  const { stOlasFormattedBalance, isLoading: isBalancesLoading } =
    useOlasBalances(address, chainId);
  const { data: stakerData, isLoading: isStakerLoading } = useStaker(
    { id: address },
    !!address,
  );

  if (!isConnected || !address || !chainId) return null;

  return (
    <Wallet address={address} chainId={chainId}>
      <div className="flex flex-col items-start mb-8">
        <span className="text-sm text-white/60">My requests</span>
        <div className="flex gap-3 mt-2">
          <div className="flex items-center gap-2 rounded-xl bg-[#FFFFFF0D] px-4 py-2">
            <LuClock color="#CFC500" size={20} />{" "}
            <span className="text-base font-semibold">
              Pending -{" "}
              {isStakerLoading ? (
                <Spinner />
              ) : (
                (stakerData?.staker?.pendingWithdrawRequests ?? 0)
              )}
            </span>
          </div>
          <div className="flex items-center gap-2 rounded-xl bg-[#FFFFFF0D] px-4 py-2">
            <LuCircleCheckBig color="#00CF6B" size={20} />
            <span className="text-base font-semibold">
              Completed -{" "}
              {isStakerLoading ? (
                <Spinner />
              ) : (
                (stakerData?.staker?.completedWithdrawRequests ?? 0)
              )}
            </span>
          </div>
        </div>
      </div>
      <div className="flex flex-col items-start">
        <span className="text-sm text-white/60">stOLAS balance</span>
        <div className="flex items-center gap-2 mt-2">
          <Image
            src={TOKEN_LOGOS.stOLAS}
            alt="stOLAS logo"
            width="24"
            height="24"
          />
          <span className="text-base font-semibold">
            {isBalancesLoading ? <InputSkeleton /> : stOlasFormattedBalance}
          </span>
        </div>
      </div>
    </Wallet>
  );
};
