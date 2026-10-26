import type { Metadata } from "next";
import { LegalDocument } from "@/components/blocks/legal-document";
import { termsCopy } from "@/lib/constants/siteCopy";

export const metadata: Metadata = {
  title: "Terms of Service · Codependent Coding™",
};

export default function Page() {
  return <LegalDocument copy={termsCopy} />;
}
