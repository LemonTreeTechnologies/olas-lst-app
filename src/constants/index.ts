import { TokenType } from "@/types";
import { sepolia } from "viem/chains";

export const OLAS_LST_SUBGRAPH_URL =
  "https://api.studio.thegraph.com/query/84262/st-olas/version/latest";

export const SECONDS_IN_YEAR = 365 * 24 * 60 * 60;

export const SCAN_URLS: Record<number, string> = {
  [sepolia.id]: "https://sepolia.etherscan.io/",
} as const;

export const TOKEN_LOGOS: Record<TokenType, string> = {
  OLAS: "/images/olas-icon.svg",
  stOLAS: "/images/stOLAS-icon.png",
};

const DISCLOSURES_URL =
  "https://raw.githubusercontent.com/LemonTreeTechnologies/olas-lst/main/doc/disclosures";

export const DISCLOSURES_URLS = {
  privacyPolicy: `${DISCLOSURES_URL}/stolas_privacy_policy.md`,
  riskDisclosure: `${DISCLOSURES_URL}/stolas_risk_disclosure.md`,
  termsOfUse: `${DISCLOSURES_URL}/stolas_terms_of_use.md`,
};
