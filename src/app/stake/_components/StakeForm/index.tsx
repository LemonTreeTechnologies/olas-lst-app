"use client";

import { parseUnits } from "viem";
import { useState } from "react";
import { useAccount } from "wagmi";
import { Card } from "@/components/Card";
import { KeyValueList } from "@/components/KeyValueList";
import { WalletConnectButton } from "@/components/layouts/WalletConnectButton";
import { Spinner } from "@/components/loaders/Spinner";
import { TokenInput } from "@/components/TokenInput";
import { OLAS_ADDRESSES } from "@/constants/contracts/olas";
import { useProjectedApy } from "@/hooks/useApy";
import { useFetchBalance } from "@/hooks/useFetchBalance";
import { useGetContractsForDeposit } from "@/hooks/useGetContractsForDeposit";
import { useDebounce } from "@uidotdev/usehooks";
import { usePreviewDeposit } from "@/hooks/usePreviewDeposit";
import { formatNumber } from "@/utils/format";

export const StakeForm = () => {
  const { isConnected: isAccountConnected, chainId } = useAccount();
  const { formattedBalance } = useFetchBalance(
    chainId ? OLAS_ADDRESSES[chainId] : undefined,
  );

  const [amount, setAmount] = useState("");
  const debouncedAmount = useDebounce(amount, 500);
  const amountInEth = parseUnits(debouncedAmount, 18);

  const { contracts, isLoading: isContractsLoading } =
    useGetContractsForDeposit(amountInEth);
  const { apy, isLoading: isApyLoading } = useProjectedApy(contracts);

  const {
    formattedDeposit,
    rawDeposit,
    isLoading: isPreviewDepositLoading,
  } = usePreviewDeposit(amountInEth);

  const isApyContentLoading = isContractsLoading || isApyLoading;
  // TODO: organize nested conditions better
  const apyContent = !amount ? "Vary" : isApyContentLoading ? <Spinner /> : apy;

  const previewDepositContent = !amount ? (
    "0.00 stOLAS"
  ) : isPreviewDepositLoading ? (
    <Spinner />
  ) : (
    `${formattedDeposit} stOLAS`
  );

  const exchangeContent = !amount ? (
    "1 OLAS = 1 stOLAS"
  ) : isPreviewDepositLoading || !rawDeposit || !amountInEth ? (
    <Spinner />
  ) : (
    `1 OLAS = ${formatNumber(Number(rawDeposit) / Number(amountInEth), { maximumFractionDigits: 3 })} stOLAS`
  );

  console.log("contracts for deposit", contracts);

  return (
    <Card title="Stake OLAS">
      <TokenInput
        value={amount}
        onChange={setAmount}
        token="OLAS"
        balance={formattedBalance}
      />
      <KeyValueList
        items={[
          { label: "APY", value: apyContent },
          { label: "You will receive", value: previewDepositContent },
          { label: "Exchange rate", value: exchangeContent },
          { label: "Max transaction cost", value: "--" },
          { label: "Reward fee", value: "0%" },
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
