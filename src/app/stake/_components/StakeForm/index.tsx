"use client";

import { Card } from "@/components/Card";
import { KeyValueList } from "@/components/KeyValueList";
import { WalletConnectButton } from "@/components/layouts/WalletConnectButton";
import { TokenInput } from "@/components/TokenInput";
import { OLAS_ADDRESSES } from "@/constants/contracts/olas";
import { useFetchBalance } from "@/hooks/useFetchBalance";
import { useState } from "react";
import { useAccount } from "wagmi";

export const StakeForm = () => {
  const { isConnected: isAccountConnected, chainId } = useAccount();
  const { formattedBalance } = useFetchBalance(
    chainId ? OLAS_ADDRESSES[chainId] : undefined,
  );

  const [value, setValue] = useState("");

  return (
    <Card title="Stake OLAS">
      <TokenInput
        value={value}
        onChange={setValue}
        token="OLAS"
        balance={formattedBalance}
      />
      <KeyValueList
        items={[
          { label: "APY", value: "Vary" },
          { label: "You will receive", value: "0.00 stOLAS" },
          { label: "Exchange rate", value: "1 OLAS = 1 stOLAS" },
          { label: "Max transaction cost", value: "$1.52" },
          { label: "Reward fee", value: "10%" },
        ]}
      />

      {!isAccountConnected && (
        <div className="flex justify-end">
          <WalletConnectButton />
        </div>
      )}
    </Card>
  );
};
