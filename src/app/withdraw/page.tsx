"use client";

import { useState } from "react";
import { Switcher } from "./_components/Switcher";
import { WithdrawForm } from "./_components/WithdrawForm";
import { Card } from "@/components/Card";
import { WalletInfo } from "./_components/WalletInfo";

const TABS = {
  request: "Request",
  claim: "Claim",
};

const Page = () => {
  const [tab, setTab] = useState(TABS.request);

  return (
    <div className="max-w-lg w-full flex flex-col gap-8">
      <Switcher tabs={Object.values(TABS)} selected={tab} onChange={setTab} />
      <WalletInfo />
      {tab === TABS.request && <WithdrawForm />}
      {tab === TABS.claim && <Card title="Claim withdrawal">Coming soon</Card>}
    </div>
  );
};

export default Page;
