"use client";

import Head from "next/head";
import { LaunchLayout } from "@/components/layouts/LaunchLayout";
import { useStTotalAssets } from "@/hooks/useStTotalAssets";
import { StatisticSkeleton } from "@/components/loaders/Skeleton";
import { useFetchGlobal } from "@/hooks/useGlobal";
import { Apr } from "@/components/Apr";

export default function Home() {
  const { formattedStTotalAssets, isLoading: isStTotalAssetsLoading } =
    useStTotalAssets();
  const { data: globalData, isLoading: isGlobalLoading } = useFetchGlobal();

  return (
    <>
      <Head>
        <link
          rel="preload"
          href="/images/waterfall.png"
          as="image"
          type="image/png"
        />
      </Head>

      <LaunchLayout>
        <div className="flex flex-col flex-auto gap-6 p-12 items-center transition-opacity duration-700 opacity-100 bg-[url('/images/waterfall.png')] bg-no-repeat bg-contain">
          <h1 className="text-5xl font-bold font-gradient text-center leading-tight overflow-visible">
            Liquid staking with stOLAS
          </h1>
          <p className="font-tertiary text-lg text-center">
            Scalable rewards and enhanced strategies powered by a modular
            framework.
          </p>
          <div className="flex gap-12">
            <div className="flex flex-col gap-1 text-center">
              <span className="font-gradient text-4xl font-semibold">
                {isStTotalAssetsLoading ? (
                  <StatisticSkeleton />
                ) : (
                  formattedStTotalAssets
                )}
              </span>
              <span className="font-tertiary">TVL (OLAS)</span>
            </div>

            <div className="flex flex-col gap-1 text-center">
              <span className="font-gradient text-4xl font-semibold">
                {isGlobalLoading ? (
                  <StatisticSkeleton />
                ) : (
                  <Apr
                    value={globalData?.global?.sevenDaysApr}
                    className="font-gradient"
                  />
                )}
              </span>
              <span className="font-tertiary">APR</span>
            </div>
          </div>
        </div>
      </LaunchLayout>
    </>
  );
}
