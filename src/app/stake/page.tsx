import { StakeForm } from "./_components/StakeForm";
import { Statistics } from "./_components/Statistics";
import { WalletInfo } from "./_components/WalletInfo";

const Page = () => {
  return (
    <div className="max-w-lg w-full flex flex-col gap-8">
      <WalletInfo />
      <StakeForm />
      <Statistics />
    </div>
  );
};

export default Page;
