import { truncateAddress } from "@/utils/format";
import { LuExternalLink, LuWallet, LuLogOut } from "react-icons/lu";
import { TbCopy, TbCopyCheckFilled } from "react-icons/tb";
import { SCAN_URLS } from "@/constants";
import { useState } from "react";
import { useDisconnect } from "wagmi";

type WalletProps = {
  address: `0x${string}`;
  chainId: number;
  children: React.ReactNode;
};

const CopyButton = ({ address }: Pick<WalletProps, "address">) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button className="rounded cursor-pointer" onClick={handleCopy}>
      {copied ? (
        <TbCopyCheckFilled className="text-xl font-secondary" />
      ) : (
        <TbCopy className="text-xl font-secondary" />
      )}
    </button>
  );
};

const LogoutButton = () => {
  const { disconnect } = useDisconnect();

  const handleLogout = () => {
    disconnect();
  };

  return (
    <button className="rounded cursor-pointer" onClick={handleLogout}>
      <LuLogOut className="text-xl font-secondary" />
    </button>
  );
};

export const Wallet = ({ address, chainId, children }: WalletProps) => {
  return (
    <div className="w-full mx-auto overflow-hidden rounded-2xl border border-[#273346] bg-[linear-gradient(180deg,_rgba(101,206,241,0.15)_0%,_rgba(54,77,237,0.15)_100%)] shadow-lg text-white">
      <div className="flex items-stretch justify-between">
        <div className="flex flex-auto items-center bg-white/5 gap-2 px-6 py-4">
          <LuWallet className="text-xl font-secondary" />
          <span>{truncateAddress(address)}</span>
        </div>
        <div className="flex items-stretch gap-[1px]">
          <div className="flex items-center justify-center w-[56px] bg-white/5">
            <CopyButton address={address} />
          </div>
          <div className="flex items-center justify-center w-[56px] bg-white/5">
            <a
              className="rounded"
              href={`${SCAN_URLS[chainId]}/address/${address}`}
              target="_blank"
            >
              <LuExternalLink className="text-xl font-secondary" />
            </a>
          </div>
          <div className="flex items-center justify-center w-[56px] bg-white/5">
            <LogoutButton />
          </div>
        </div>
      </div>
      <div className="px-6 py-4">{children}</div>
    </div>
  );
};
