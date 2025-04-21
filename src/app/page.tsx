import Head from "next/head";
import { LaunchLayout } from "@/components/layouts/LaunchLayout";

export default function Home() {
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
          <p className="font-secondary text-lg text-center">
            Scalable rewards and enhanced strategies powered by a modular
            framework.
          </p>
          <div className="flex gap-12">
            <div className="flex flex-col gap-1 text-center">
              <span className="font-gradient text-4xl font-semibold">
                $10,000,000
              </span>
              <span className="font-secondary">TVL</span>
            </div>

            <div className="flex flex-col gap-1 text-center">
              <span className="font-gradient text-4xl font-semibold">130%</span>
              <span className="font-secondary">APY</span>
            </div>
          </div>
        </div>
      </LaunchLayout>
    </>
  );
}
