import { LaunchLayout } from "@/components/layouts/LaunchLayout";

export default function Home() {
  return (
    <LaunchLayout>
      <div className="flex flex-col flex-auto gap-6 p-16 items-center bg-[url('/images/waterfall.png')] bg-no-repeat bg-contain">
        <h1 className="text-5xl font-bold font-gradient text-center">
          Liquid staking with stOLAS
        </h1>
        <p className="font-secondary text-lg text-center">
          Scalable rewards and enhanced strategies powered by a modular
          framework.
        </p>
        <div className="grid grid-cols-2">
          <div className="grid grid-cols-1 gap-1 text-center">
            <span className="font-gradient text-4xl font-semibold">
              $10,000,000
            </span>
            <span className="font-secondary">TVL</span>
          </div>

          <div className="grid grid-cols-1 gap-1 text-center">
            <span className="font-gradient text-4xl font-semibold">130%</span>
            <span className="font-secondary">APY</span>
          </div>
        </div>
      </div>
    </LaunchLayout>
  );
}
