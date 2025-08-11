"use client";

import Image from "next/image";
import { useAccount } from "wagmi";
import { useOlasBalances } from "@/hooks/useFetchBalance";
import { Wallet } from "@/components/Wallet/Wallet";
import { TOKEN_LOGOS } from "@/constants";

export const WalletInfo = () => {
  const { isConnected, chainId, address } = useAccount();
  const { stOlasFormattedBalance, availableOlasFormattedBalance } =
    useOlasBalances(address, chainId);

  if (!isConnected || !address || !chainId) return null;

  return (
    <Wallet address={address} chainId={chainId}>
      <div className="grid grid-cols-2">
        <div className="flex flex-col items-start">
          <span className="text-sm text-white/60">Available to stake</span>
          <div className="flex items-center gap-2 mt-2">
            <Image
              src={TOKEN_LOGOS.OLAS}
              alt="OLAS logo"
              width="24"
              height="24"
            />
            <span className="text-base font-semibold">
              {availableOlasFormattedBalance}
            </span>
          </div>
        </div>

        <div className="flex flex-col items-start">
          <span className="text-sm text-white/60">Staked amount</span>
          <div className="flex items-center gap-2 mt-2">
            <Image
              src={TOKEN_LOGOS.stOLAS}
              alt="stOLAS logo"
              width="24"
              height="24"
            />
            <span className="text-base font-semibold">
              {stOlasFormattedBalance}
            </span>
          </div>
        </div>
      </div>
    </Wallet>
  );
};
