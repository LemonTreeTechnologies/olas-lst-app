import React from "react";
import { MarkdownPage } from "../_components/DisclosurePage";
import { DISCLOSURES_URLS } from "@/constants";

export default function PrivacyPolicyPage() {
  return <MarkdownPage url={DISCLOSURES_URLS.privacyPolicy} />;
}
