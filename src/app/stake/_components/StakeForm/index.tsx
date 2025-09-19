"use client";

import { parseUnits } from "viem";
import { useCallback, useRef, useState } from "react";
import { useAccount } from "wagmi";
import { Card } from "@/components/Card";
import { KeyValueList } from "@/components/KeyValueList";
import { WalletConnectButton } from "@/components/layouts/WalletConnectButton";
import { Spinner } from "@/components/loaders/Spinner";
import { TokenInput } from "@/components/TokenInput";
import {
  useOlasBalances,
  useRefetchBalanceAfterUpdate,
} from "@/hooks/useFetchBalance";
import { useGetContractsForDeposit } from "@/hooks/useGetContractsForDeposit";
import { useDebounce } from "@uidotdev/usehooks";
import { usePreviewDeposit } from "@/hooks/usePreviewDeposit";
import { formatNumber } from "@/utils/format";
import { Button } from "@/components/Button";
import { useStake } from "./hooks";
import { SCOPE_KEYS } from "@/constants/scopeKeys";
import { Status } from "./Status";
import { useDepositoryLimits } from "@/hooks/useDepositoryLimits";
import { Disclaimer } from "./Disclaimer";

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
  const { isConnected: isAccountConnected, chainId, address } = useAccount();
  const { data: depositoryLimits, isLoading: isDepositoryLimitsLoading } =
    useDepositoryLimits();
  const [isDisclaimerOpen, setIsDisclaimerOpen] = useState(false);
  const handleCloseDisclaimer = () => setIsDisclaimerOpen(false);
  const wasDisclaimerShown = useRef(false);

  const { availableOlasBalance, availableOlasFormattedBalance } =
    useOlasBalances(address, chainId);

  const [amount, setAmount] = useState("");
  const debouncedAmount = useDebounce(amount, 500);
  const amountInWei = parseUnits(debouncedAmount, 18);

  const { contracts, isLoading: isContractsLoading } =
    useGetContractsForDeposit(amountInWei);

  const {
    formattedDeposit,
    rawDeposit,
    isLoading: isPreviewDepositLoading,
  } = usePreviewDeposit(amountInWei);

  const handleFinish = useCallback(() => {
    setAmount("");
  }, []);

  const { handleStake, status, isBusy, approveHash, depositHash, error } =
    useStake(contracts, amountInWei, handleFinish);

  const handleStakeWithDisclaimer = useCallback(() => {
    const hasLimit = depositoryLimits?.limit !== Infinity;
    if (!wasDisclaimerShown.current && hasLimit && depositoryLimits) {
      if (amountInWei > depositoryLimits.limit) {
        setIsDisclaimerOpen(true);
        wasDisclaimerShown.current = true;
        return;
      }
    } else {
      handleStake();
    }
  }, [amountInWei, depositoryLimits, handleStake]);

  useRefetchBalanceAfterUpdate(
    depositHash,
    SCOPE_KEYS.stOlas(address, chainId),
  );

  return (
    <Card title="Stake OLAS">
      <TokenInput
        value={amount}
        onChange={setAmount}
        token="OLAS"
        balance={availableOlasFormattedBalance}
        rawBalance={availableOlasBalance}
      />
      <KeyValueList
        items={[
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
          <Status
            status={status}
            chainId={chainId}
            approveHash={approveHash}
            depositHash={depositHash}
            error={error}
          />

          <div className="flex flex-auto">
            <Button
              className="w-full"
              onClick={handleStakeWithDisclaimer}
              isLoading={isBusy}
              disabled={
                isPreviewDepositLoading ||
                isContractsLoading ||
                isDepositoryLimitsLoading ||
                !amountInWei ||
                debouncedAmount !== amount ||
                isBusy
              }
            >
              Stake
            </Button>
          </div>
        </>
      )}
      {depositoryLimits && depositoryLimits.limit !== Infinity && (
        <Disclaimer
          isOpen={isDisclaimerOpen}
          onClose={handleCloseDisclaimer}
          onProceed={() => {
            handleCloseDisclaimer();
            handleStake();
          }}
          limit={depositoryLimits.limit}
          productName={depositoryLimits.productName}
        />
      )}
    </Card>
  );
};
