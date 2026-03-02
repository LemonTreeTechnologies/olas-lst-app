"use client";

import { useAppKit, useAppKitAccount } from "@reown/appkit/react";
import { truncateAddress } from "@/utils/format";

export const WalletConnectButton = () => {
  const { open } = useAppKit();
  const { address, isConnected } = useAppKitAccount();

  if (isConnected && address) {
    return (
      <button
        className="flex items-center gap-2 bg-transparent text-white text-base font-semibold pl-3 pr-4 py-2 border border-[#FFFFFF1A] rounded-full cursor-pointer hover:bg-white/5 transition-colors"
        onClick={() => open({ view: "Account" })}
      >
        <span className="w-3 h-3 rounded-full bg-gradient-to-b from-white to-[#AFD2E4]" />
        {truncateAddress(address as `0x${string}`)}
      </button>
    );
  }

  return (
    <button
      className="bg-[#364DED] text-white text-base font-semibold px-4 py-2 border border-[#FFFFFF1A] rounded-lg cursor-pointer hover:bg-[#2a3ec4] transition-colors"
      onClick={() => open({ view: "Connect" })}
    >
      Connect Wallet
    </button>
  );
};
