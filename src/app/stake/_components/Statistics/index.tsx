"use client";

import { formatUnits } from "viem";
import { Card } from "@/components/Card";
import { KeyValueList } from "@/components/KeyValueList";
import { Spinner } from "@/components/loaders/Spinner";
import { formatNumber } from "@/utils/format";
import { useFetchGlobal } from "@/hooks/useGlobal";
import { useStOlasStatistics } from "./hooks";
import { ExternalLink } from "@/components/ExternalLink";
import { DEFAULT_CHAIN_ID } from "@/config/wagmi";
import { ST_OLAS_ADDRESSES } from "@/constants/contracts/stOlas";
import { Apr } from "@/components/Apr";

const getStatisticValueContent = ({
  rawValue,
  isLoading,
  content,
}: {
  rawValue: string | bigint | number | undefined;
  isLoading: boolean;
  content: string | React.ReactElement;
}) => {
  if (isLoading) return <Spinner />;
  if (rawValue === undefined) return "--";
  return content;
};

export const Statistics = () => {
  /** st OLAS statistics */
  const {
    stakedBalance,
    reserveBalance,
    vaultBalance,
    totalAssets,
    totalSupply,
    isLoading: isStOlasStatisticsLoading,
  } = useStOlasStatistics();

  /** APR and Total number of stakers */
  const { data: globalData, isLoading: isGlobalLoading } = useFetchGlobal();

  return (
    <Card
      title="Global statistics"
      hint={
        <ExternalLink
          href={ST_OLAS_ADDRESSES[DEFAULT_CHAIN_ID]}
          text="Explore on Etherscan"
        />
      }
    >
      <KeyValueList
        items={[
          {
            label: "APR",
            value: getStatisticValueContent({
              rawValue: globalData?.global?.sevenDaysApr,
              isLoading: isGlobalLoading,
              content: <Apr value={globalData?.global?.sevenDaysApr} />,
            }),
          },
          {
            label: "Total staked",
            value: getStatisticValueContent({
              rawValue: stakedBalance,
              isLoading: isStOlasStatisticsLoading,
              content: `${formatNumber(Number(formatUnits(stakedBalance ?? BigInt(0), 18)))} OLAS`,
            }),
          },
          {
            label: "Reserved balance",
            value: getStatisticValueContent({
              rawValue: reserveBalance,
              isLoading: isStOlasStatisticsLoading,
              content: `${formatNumber(Number(formatUnits(reserveBalance ?? BigInt(0), 18)))} OLAS`,
            }),
          },
          {
            label: "Vault balance",
            value: getStatisticValueContent({
              rawValue: vaultBalance,
              isLoading: isStOlasStatisticsLoading,
              content: `${formatNumber(Number(formatUnits(vaultBalance ?? BigInt(0), 18)))} OLAS`,
            }),
          },
          {
            label: "stOLAS TVL",
            value: getStatisticValueContent({
              rawValue: totalAssets,
              isLoading: isStOlasStatisticsLoading,
              content: `${formatNumber(Number(formatUnits(totalAssets ?? BigInt(0), 18)))} OLAS`,
            }),
          },

          {
            label: "stOLAS Supply",
            value: getStatisticValueContent({
              rawValue: totalSupply,
              isLoading: isStOlasStatisticsLoading,
              content: `${formatNumber(Number(formatUnits(totalSupply ?? BigInt(0), 18)))} stOLAS`,
            }),
          },
          {
            label: "Stakers",
            value: getStatisticValueContent({
              rawValue: globalData?.global?.totalStakers,
              isLoading: isGlobalLoading,
              content: `${globalData?.global?.totalStakers ?? 0}`,
            }),
          },
        ]}
      />
    </Card>
  );
};
