import type { Metadata } from "next";
import { LegalDocument } from "@/components/blocks/legal-document";
import { SecurityPanel } from "@/components/blocks/security-panel";
import { privacyCopy } from "@/lib/constants/siteCopy";

export const metadata: Metadata = {
  title: "Privacy Policy · Codependent Coding™",
};

export default function Page() {
  return <LegalDocument copy={privacyCopy} preface={<SecurityPanel />} />;
}
