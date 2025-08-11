import { SCAN_URLS } from "@/constants";
import { LuArrowUpRight } from "react-icons/lu";

type TxnLinkProps = {
  chainId: number;
  hash: string;
};

export const TxnLink = ({ chainId, hash }: TxnLinkProps) => (
  <a
    href={`${SCAN_URLS[chainId]}/tx/${hash}`}
    target="_blank"
    className="inline-flex items-center gap-1 text-blue-400"
  >
    Txn details <LuArrowUpRight />
  </a>
);
