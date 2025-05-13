"use client";

import { Address, parseUnits } from "viem";
import { useState } from "react";
import { useAccount, useWriteContract } from "wagmi";
import { Card } from "@/components/Card";
import { KeyValueList } from "@/components/KeyValueList";
import { WalletConnectButton } from "@/components/layouts/WalletConnectButton";
import { Spinner } from "@/components/loaders/Spinner";
import { TokenInput } from "@/components/TokenInput";
import { OLAS_ADDRESSES } from "@/constants/contracts/olas";
import { useProjectedApr } from "@/hooks/useApr";
import { useFetchBalance } from "@/hooks/useFetchBalance";
import { useGetContractsForDeposit } from "@/hooks/useGetContractsForDeposit";
import { useDebounce } from "@uidotdev/usehooks";
import { usePreviewDeposit } from "@/hooks/usePreviewDeposit";
import { formatNumber } from "@/utils/format";
import { Button } from "@/components/Button";
import {
  DEPOSITORY_ABI,
  DEPOSITORY_ADDRESSES,
} from "@/constants/contracts/depository";
import { DEFAULT_CHAIN_ID } from "@/config/wagmi";
import { LuArrowUpRight } from "react-icons/lu";

const getStakeValueContent = ({
  amount,
  placeholder,
  isLoading,
  content,
}: {
  amount: string;
  placeholder: string;
  isLoading: boolean;
  content: string;
}) => {
  if (!amount) return placeholder;
  if (isLoading) return <Spinner />;
  return content;
};

export const StakeForm = () => {
  const { data: hash, isPending, writeContract, reset } = useWriteContract();

  const { isConnected: isAccountConnected, chainId } = useAccount();
  const { formattedBalance, rawBalance } = useFetchBalance(
    chainId ? OLAS_ADDRESSES[chainId] : undefined,
  );

  const [amount, setAmount] = useState("");
  const debouncedAmount = useDebounce(amount, 500);
  const amountInWei = parseUnits(debouncedAmount, 18);

  const { contracts, isLoading: isContractsLoading } =
    useGetContractsForDeposit(amountInWei);
  const { apr, isLoading: isAprLoading } = useProjectedApr(
    contracts,
    amountInWei,
  );

  const {
    formattedDeposit,
    rawDeposit,
    isLoading: isPreviewDepositLoading,
  } = usePreviewDeposit(amountInWei);

  const handleSendTransaction = () => {
    if (isPending) return;
    reset();

    const chainIds: bigint[] = [];
    const stakingProxies: Address[] = [];
    const bridgePayloads: `0x${string}`[] = [];
    const values: bigint[] = [];

    contracts.forEach((contract) => {
      chainIds.push(BigInt(contract.chainId));
      stakingProxies.push(contract.stakingProxy);
      bridgePayloads.push("0x");
      values.push(contract.allocation);
    });

    writeContract({
      address: DEPOSITORY_ADDRESSES[DEFAULT_CHAIN_ID],
      abi: DEPOSITORY_ABI,
      functionName: "deposit",
      args: [
        BigInt(amountInWei),
        chainIds,
        stakingProxies,
        bridgePayloads,
        values,
      ],
    });
  };

  return (
    <Card title="Stake OLAS">
      <TokenInput
        value={amount}
        onChange={setAmount}
        token="OLAS"
        balance={formattedBalance}
        rawBalance={rawBalance}
      />
      <KeyValueList
        items={[
          {
            label: "APR",
            value: getStakeValueContent({
              amount,
              placeholder: "Vary",
              isLoading:
                isContractsLoading ||
                isAprLoading ||
                debouncedAmount !== amount,
              content: apr,
            }),
          },
          {
            label: "You will receive",
            value: getStakeValueContent({
              amount,
              placeholder: "0.00 stOLAS",
              isLoading: isPreviewDepositLoading || debouncedAmount !== amount,
              content: `${formattedDeposit} stOLAS`,
            }),
          },
          {
            label: "Exchange rate",
            value: getStakeValueContent({
              amount,
              placeholder: "1 OLAS = 1 stOLAS",
              isLoading:
                isPreviewDepositLoading ||
                !rawDeposit ||
                !amountInWei ||
                debouncedAmount !== amount,
              content: `1 OLAS = ${formatNumber(Number(rawDeposit) / Number(amountInWei), { maximumFractionDigits: 3 })} stOLAS`,
            }),
          },
          { label: "Max transaction cost", value: "--" },
          { label: "Reward fee", value: "0%" },
        ]}
      />

      {!isAccountConnected ? (
        <div className="flex justify-end">
          <WalletConnectButton />
        </div>
      ) : (
        <>
          {hash && (
            <span className="text-center">
              Successfully deposited!{" "}
              <a
                href={`https://sepolia.etherscan.io/tx/${hash}`}
                target="_blank"
                className="inline-flex items-center gap-1 text-blue-400"
              >
                Txn details <LuArrowUpRight />
              </a>
            </span>
          )}
          <div className="flex flex-auto">
            <Button
              className="w-full"
              onClick={handleSendTransaction}
              isLoading={isPending}
              disabled={
                isPreviewDepositLoading ||
                isContractsLoading ||
                isAprLoading ||
                !amountInWei ||
                debouncedAmount !== amount
              }
            >
              Stake
            </Button>
          </div>
        </>
      )}
    </Card>
  );
};
