import type { Metadata } from "next";
import { LegalDocument } from "@/components/blocks/legal-document";
import { termsCopy } from "@/content/legal";

export const metadata: Metadata = {
  title: "Terms of Service · Codependent Coding™",
};

export default function Page() {
  return <LegalDocument copy={termsCopy} />;
}
