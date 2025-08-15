import { SCAN_URLS } from "@/constants";
import { LuArrowUpRight, LuExternalLink } from "react-icons/lu";

type TxnLinkProps = {
  chainId: number;
  hash: string;
  short?: boolean;
};

export const TxnLink = ({ chainId, hash, short }: TxnLinkProps) => (
  <a
    href={`${SCAN_URLS[chainId]}/tx/${hash}`}
    target="_blank"
    className="inline-flex items-center gap-1 text-blue-400"
  >
    {short ? (
      <LuExternalLink className="text-xl font-secondary" />
    ) : (
      <>
        Txn details <LuArrowUpRight />
      </>
    )}
  </a>
);
