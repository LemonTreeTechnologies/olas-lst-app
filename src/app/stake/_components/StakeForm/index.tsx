"use client";

import { formatUnits, parseUnits } from "viem";
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
import { LuCircleAlert } from "react-icons/lu";

const getStakeValueContent = ({
  rawValue,
  placeholder,
  isLoading,
  content,
}: {
  rawValue: string;
  placeholder: string;
  isLoading: boolean;
  content: string;
}) => {
  if (!rawValue) return placeholder;
  if (isLoading) return <Spinner />;
  return content;
};

const LimitCaption = ({
  limit,
  overLimit,
}: {
  limit: bigint;
  overLimit: boolean;
}) => {
  const text = `Maximum per transaction: ${formatUnits(limit, 18)} OLAS`;

  if (overLimit) {
    return (
      <div className="flex gap-1 items-center text-rose-400">
        <LuCircleAlert />
        {text}
      </div>
    );
  }

  return <span className="font-tertiary">{text}</span>;
};

export const StakeForm = () => {
  const { isConnected: isAccountConnected, chainId, address } = useAccount();
  const { data: depositoryLimits, isLoading: isDepositoryLimitsLoading } =
    useDepositoryLimits();
  const [isDisclaimerOpen, setIsDisclaimerOpen] = useState(false);
  const handleCloseDisclaimer = () => setIsDisclaimerOpen(false);
  const isDisclaimerShown = useRef(false);

  const { availableOlasBalance } = useOlasBalances(address, chainId);

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
    const hasLimit = depositoryLimits && depositoryLimits.limit !== null;
    if (!isDisclaimerShown.current && hasLimit && depositoryLimits) {
      setIsDisclaimerOpen(true);
      isDisclaimerShown.current = true;
      return;
    }

    handleStake();
  }, [depositoryLimits, handleStake]);

  useRefetchBalanceAfterUpdate(
    depositHash,
    SCOPE_KEYS.stOlas(address, chainId),
  );

  const limit = depositoryLimits?.limit
    ? BigInt(depositoryLimits.limit)
    : undefined;
  const overLimit =
    limit && amount ? BigInt(parseUnits(amount, 18)) > limit : false;

  return (
    <Card title="Stake OLAS">
      <div className="flex flex-col gap-2">
        <TokenInput
          value={amount}
          onChange={setAmount}
          token="OLAS"
          rawBalance={availableOlasBalance}
          isError={overLimit}
        />
        {limit && <LimitCaption limit={limit} overLimit={overLimit} />}
      </div>
      <KeyValueList
        items={[
          {
            label: "You will receive",
            value: getStakeValueContent({
              rawValue: amount,
              placeholder: "0.00 stOLAS",
              isLoading: isPreviewDepositLoading || debouncedAmount !== amount,
              content: `${formattedDeposit} stOLAS`,
            }),
          },
          {
            label: "Exchange rate",
            value: getStakeValueContent({
              rawValue: amount,
              placeholder: "--",
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
                isBusy ||
                overLimit
              }
            >
              Stake
            </Button>
          </div>
        </>
      )}
      {depositoryLimits && depositoryLimits.limit !== null && (
        <Disclaimer
          isOpen={isDisclaimerOpen}
          onClose={handleCloseDisclaimer}
          onProceed={() => {
            handleCloseDisclaimer();
            handleStake();
          }}
        />
      )}
    </Card>
  );
};
