import type { Metadata } from "next";
import { HipsterBuilderFeature } from "@/features/cli/hipster-builder-feature";

export const metadata: Metadata = {
  title: "Hipster Stack™ · Codependent Coding™",
};

export default async function Page() {
  "use cache";

  return <HipsterBuilderFeature />;
}
