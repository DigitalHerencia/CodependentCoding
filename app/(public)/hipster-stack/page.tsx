import type { Metadata } from "next";
import { HipsterBuilderFeature } from "@/features/cli/hipsterBuilderFeature";

export const metadata: Metadata = {
  title: "Hipster Stack™ · Codependent Coding™",
};

export default function Page() {
  return <HipsterBuilderFeature />;
}
