import type { Metadata } from "next";
import { HipsterBuilderFeature } from "@/features/cli/hipsterBuilderFeature";

export const metadata: Metadata = {
  title: "Hipster Stack™ · Codependent Coding™",
};

export default async function Page() {
  "use cache";

  return <HipsterBuilderFeature />;
}
