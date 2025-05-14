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
import { useProjectedApr } from "@/hooks/useApr";
import { useFetchBalance } from "@/hooks/useFetchBalance";
import { useGetContractsForDeposit } from "@/hooks/useGetContractsForDeposit";
import { useDebounce } from "@uidotdev/usehooks";
import { usePreviewDeposit } from "@/hooks/usePreviewDeposit";
import { formatNumber } from "@/utils/format";
import { Button } from "@/components/Button";
import { LuArrowUpRight } from "react-icons/lu";
import { useStake } from "./hooks";

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

  const {
    handleStake,
    isLoading: isStakeLoading,
    isApproveLoading,
    isDepositLoading,
    isApprovalSuccessOrNotNeeded,
    approveHash,
    depositHash,
    error,
  } = useStake(contracts, amountInWei);

  console.log("error", error);

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
              content: `${apr}%`,
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
          {(isStakeLoading || approveHash || depositHash || error) && (
            <div
              className="bg-white/5 border-2 border-dashed border-[#364DED]/50 text-white/80 px-4 py-3 rounded-lg"
              role="alert"
            >
              {isApproveLoading && !approveHash && (
                <div className="loading-ellipses">
                  Checking allowance and approve if needed
                </div>
              )}

              {approveHash && (
                <>
                  <div>
                    Token transfer approved!{" "}
                    <a
                      href={`https://sepolia.etherscan.io/tx/${approveHash}`}
                      target="_blank"
                      className="inline-flex items-center gap-1 text-blue-400"
                    >
                      Txn details <LuArrowUpRight />
                    </a>
                  </div>
                  {!isApprovalSuccessOrNotNeeded && (
                    <div className="loading-ellipses">
                      Waiting for txn receipt
                    </div>
                  )}
                </>
              )}

              {isDepositLoading && !depositHash && (
                <div className="loading-ellipses">
                  Waiting for deposit approval
                </div>
              )}

              {depositHash && (
                <div>
                  Deposit approved!{" "}
                  <a
                    href={`https://sepolia.etherscan.io/tx/${depositHash}`}
                    target="_blank"
                    className="inline-flex items-center gap-1 text-blue-400"
                  >
                    Txn details <LuArrowUpRight />
                  </a>
                </div>
              )}

              {error && (
                <div className="text-fuchsia-400">
                  Some error occurred. Please try later
                </div>
              )}
            </div>
          )}
          <div className="flex flex-auto">
            <Button
              className="w-full"
              onClick={handleStake}
              isLoading={isStakeLoading}
              disabled={
                isPreviewDepositLoading ||
                isContractsLoading ||
                isAprLoading ||
                !amountInWei ||
                debouncedAmount !== amount ||
                isStakeLoading
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
