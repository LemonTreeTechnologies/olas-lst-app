import { SCAN_URLS } from "@/constants";
import { ExternalLink } from "../ExternalLink";

type TxnLinkProps = {
  chainId: number;
  hash: string;
  short?: boolean;
};

export const TxnLink = ({ chainId, hash, short }: TxnLinkProps) => {
  const linkProps = short
    ? { short: true, className: "font-tertiary" }
    : { text: "Txn details", className: "text-blue-400" };
  return (
    <ExternalLink href={`${SCAN_URLS[chainId]}/tx/${hash}`} {...linkProps} />
  );
};
