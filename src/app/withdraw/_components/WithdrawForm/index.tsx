"use client";

import { parseUnits } from "viem";
import { useCallback, useState } from "react";
import { useAccount } from "wagmi";
import { Card } from "@/components/Card";
import { KeyValueList } from "@/components/KeyValueList";
import { WalletConnectButton } from "@/components/layouts/WalletConnectButton";
import { Spinner } from "@/components/loaders/Spinner";
import { TokenInput } from "@/components/TokenInput";
import { useOlasBalances } from "@/hooks/useFetchBalance";
import { useGetContractsForRedeem } from "@/hooks/useGetContractsForRedeem";
import { useDebounce } from "@uidotdev/usehooks";
import { formatNumber } from "@/utils/format";
import { Button } from "@/components/Button";
import { useRequestWithdrawal } from "./hooks";
import { usePreviewRedeem } from "@/hooks/usePreviewRedeem";
import { Status } from "./Status";
import { SCOPE_KEYS } from "@/constants/scopeKeys";
import { useRefetchAfterUpdate } from "@/hooks/useRefetchAfterUpdate";

const getWithdrawValueContent = ({
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

export const WithdrawForm = () => {
  const { isConnected: isAccountConnected, address, chainId } = useAccount();
  const { stOlasBalance } = useOlasBalances(address, chainId);

  const [amount, setAmount] = useState("");
  const debouncedAmount = useDebounce(amount, 500);
  const amountInWei = parseUnits(debouncedAmount, 18);

  const { contracts, isLoading: isContractsLoading } =
    useGetContractsForRedeem(amountInWei);

  const {
    formattedRedeem,
    rawRedeem,
    isLoading: isPreviewRedeemLoading,
  } = usePreviewRedeem(amountInWei);

  const handleFinish = useCallback(() => {
    setAmount("");
  }, []);

  const {
    handleRequestToWithdraw,
    status,
    isBusy,
    approveHash,
    requestHash,
    error,
  } = useRequestWithdrawal(contracts, amountInWei, handleFinish);

  useRefetchAfterUpdate(requestHash, [
    SCOPE_KEYS.stOlas(address, chainId),
    SCOPE_KEYS.staker({ id: address }),
  ]);

  return (
    <Card title="Request withdrawal">
      <TokenInput
        value={amount}
        onChange={setAmount}
        token="stOLAS"
        rawBalance={stOlasBalance}
      />
      <KeyValueList
        items={[
          {
            label: "You will receive",
            value: getWithdrawValueContent({
              amount,
              placeholder: "0.00 OLAS",
              isLoading: isPreviewRedeemLoading || debouncedAmount !== amount,
              content: `${formattedRedeem} OLAS`,
            }),
          },
          {
            label: "Max unlock cost",
            value: "FREE",
          },
          {
            label: "Exchange rate",
            value: getWithdrawValueContent({
              amount,
              placeholder: "1 OLAS = 1 stOLAS",
              isLoading:
                isPreviewRedeemLoading ||
                !rawRedeem ||
                !amountInWei ||
                debouncedAmount !== amount,
              content: `1 stOLAS = ${formatNumber(Number(rawRedeem) / Number(amountInWei), { maximumFractionDigits: 3 })} OLAS`,
            }),
          },
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
            requestHash={requestHash}
            error={error}
          />

          <div className="flex flex-auto">
            <Button
              className="w-full"
              onClick={handleRequestToWithdraw}
              isLoading={isBusy}
              disabled={
                isPreviewRedeemLoading ||
                isContractsLoading ||
                !amountInWei ||
                debouncedAmount !== amount ||
                isBusy
              }
            >
              Request
            </Button>
          </div>
        </>
      )}
    </Card>
  );
};
