"use client";

import { Accordion } from "@/components/Accordion";
import { Card } from "@/components/Card";

const FAQ_ITEMS = [
  {
    id: "1",
    title: "What is stOLAS?",
    content: (
      <>
        <p className="mb-2">
          <b>stOLAS</b> is a liquid staking token (LST) that represents a share
          of OLAS held and managed by the `stOLAS` vault on L1.
        </p>
        <p>
          Its value is expressed via price-per-share (PPS): as protocol reserves
          grow from staking rewards bridged from L2, PPS increases and each
          stOLAS is redeemable for more OLAS over time.
        </p>
      </>
    ),
  },
  {
    id: "2",
    title: "How does stOLAS work?",
    content: (
      <ul className="list-disc px-5">
        <li className="mb-2">
          Users deposit OLAS through the system&apos;s Depository module (the
          only allowed caller of stOLAS.deposit()).
        </li>
        <li className="mb-2">
          The protocol stakes OLAS on L2 services. Rewards accrued on L2 are
          bridged back to L1 and topped up into the vault&apos;s reserves.
        </li>
        <li className="mb-2">
          The vault updates internal accounting (totalReserves = staked + vault
          + reserve), and PPS increases accordingly.
        </li>
        <li>
          Withdrawals are requested and finalized by the Treasury module (see
          below).
        </li>
      </ul>
    ),
  },
  {
    id: "3",
    title: "What are the risks of staking with stOLAS?",
    content: (
      <ul className="list-disc px-5">
        <li className="mb-2">
          <b>Smart-contract risk.</b> Bugs or unforeseen interactions in the
          contracts.
        </li>
        <li className="mb-2">
          <b>Cross-chain/bridge risk.</b> Messages and funds move between L2 and
          L1; delays or failures can impact withdrawals and rewards.
        </li>
        <li className="mb-2">
          <b>Operational/configuration risk.</b> The L2→L1 routing must be set
          so that rewarded/unstaked OLAS return to Treasury; misconfiguration
          can delay finalization.
        </li>
        <li className="mb-2">
          <b>Liquidity/withdrawal timing risk.</b> If the vault has insufficient
          immediate liquidity, withdrawals depend on unstaking on L2 and
          bridging.
        </li>
        <li className="mb-2">
          <b>Governance/upgrade risk.</b> Parameters and upgrade flows are
          governed; poor process control can introduce risk.
        </li>
        <li>
          <b>Market risk.</b> Secondary-market price of (w)stOLAS may deviate
          from PPS (if/where a market exists).
        </li>
      </ul>
    ),
  },
  {
    id: "4",
    title: "What is stOLAS staking APY?",
    content: (
      <>
        There is <b>no fixed or guaranteed APY</b>. Returns are realized as
        <b>PPS growth</b> driven by L2 rewards and can vary over time.
        Historical PPS and dashboard metrics are the best way to assess realized
        performance.
      </>
    ),
  },
  {
    id: "5",
    title: "What fee is applied by Liquid OLAS Staking?",
    content: (
      <>
        <p className="mb-2">
          At the <b>contract level</b> (audited commit), we did not identify a
          protocol fee taken on deposit or withdrawal.
        </p>
        <p className="mb-2">
          Protocol fee is taken from rewards on L2 in order to manage all the
          required maintenance costs.
        </p>
        <p className="mb-2">
          Another part of rewards fee is taken on L1 in order to increase the
          protocol veOLAS lock.
        </p>
        <p className="mb-2">
          Users pay <b>gas fees</b> and, if a withdrawal requires
          bridging/unstaking, network/bridge costs may apply.
        </p>
        <p className="mb-2">
          Third party integrations (DEXes, aggregators) may charge their own
          fees.
        </p>
        <p>
          Governance can introduce changes in the future; always check the app
          for current parameters.
        </p>
      </>
    ),
  },
  {
    id: "6",
    title: "How can I get stOLAS?",
    content: (
      <ul className="list-disc px-5">
        <li className="mb-2">
          <b>Mint:</b> Deposit OLAS through the official front‑end/wallet flow
          (invoking the Depository, which calls `stOLAS.deposit()` on your
          behalf).
        </li>
        <li>
          <b>Buy:</b> Acquire on a secondary market/DEX if listed (availability
          is not guaranteed).
        </li>
      </ul>
    ),
  },
  {
    id: "7",
    title: "How can I use stOLAS?",
    content: (
      <ul className="list-disc px-5">
        <li className="mb-2">
          <b>Hold</b> to participate in PPS growth as L2 rewards are added to
          reserves.
        </li>
        <li>
          <b>DeFi integrations (if/when available)</b>: use as collateral,
          provide liquidity, etc. Integration availability is
          ecosystem-dependent and not guaranteed by the protocol.
        </li>
      </ul>
    ),
  },
  {
    id: "8",
    title: "How can I unstake stOLAS?",
    content: (
      <>
        <p className="mb-2">
          Use the app to <b>request a withdrawal</b>. The <b>Treasury</b>{" "}
          records your ticket (ERC-6909 semantics / cooldown applies) and
          redeems your shares against available liquidity.
        </p>
        <p className="mb-2">
          If there is a shortfall, an <b>unstake on L2</b> is triggered and OLAS
          are bridged back to L1.
        </p>
        <p className="mb-2">After cooldown, you finalize to receive OLAS.</p>
        <p>
          Alternatively, a <b>secondary-market swap</b> may provide an earlier
          exit (subject to price and liquidity).
        </p>
      </>
    ),
  },
  {
    id: "9",
    title: "How much OLAS can I stake?",
    content: (
      <>
        <p className="mb-2">
          Initially for alpha and beta versions there will be stake limits.
        </p>
        <p className="mb-2">
          After more protocol stability is traced, there will be
          <b>no on-chain hard cap</b> specific to a single user in the audited
          contracts.
        </p>
        <p>
          Practical limits arise from <b>gas costs</b>, wallet/app minimums, and
          overall protocol capacity.
        </p>
      </>
    ),
  },
];

export const Faq = () => (
  <Card title="FAQ">
    <Accordion items={FAQ_ITEMS} />
  </Card>
);
