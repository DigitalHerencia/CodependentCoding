import type { Metadata } from "next";
import { DoctrineDocsFeature } from "@/features/doctrine/doctrine-docs-feature";

export const metadata: Metadata = { title: "Doctrine · Codependent Coding™" };

export default async function Page() {
  "use cache";

  return <DoctrineDocsFeature slug="" />;
}
