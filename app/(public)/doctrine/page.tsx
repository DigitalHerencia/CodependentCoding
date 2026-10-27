import type { Metadata } from "next";
import { DoctrineDocsFeature } from "@/features/doctrine/doctrineDocsFeature";

export const metadata: Metadata = { title: "Doctrine · Codependent Coding™" };

export default function Page() {
  return <DoctrineDocsFeature slug="" />;
}
