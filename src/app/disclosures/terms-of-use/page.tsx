import React from "react";
import { MarkdownPage } from "../_components/DisclosurePage";
import { DISCLOSURES_URLS } from "@/constants";

export default function TermsOfUsePage() {
  return <MarkdownPage url={DISCLOSURES_URLS.termsOfUse} />;
}
