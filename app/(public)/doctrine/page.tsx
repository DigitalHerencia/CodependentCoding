import type { Metadata } from "next";
import { ComingSoon } from "@/components/blocks/coming-soon";
import { comingSoonCopy } from "@/lib/constants/siteCopy";

export const metadata: Metadata = { title: "Doctrine · Codependent Coding™" };

export default function Page() {
  return <ComingSoon {...comingSoonCopy.doctrine} />;
}
