import type { Metadata } from "next";
import { PluginProductFeature } from "@/features/plugin/plugin-product-feature";

export const metadata: Metadata = {
  title: "Loaded Vibes™ · Codependent Coding™",
};

export default async function Page() {
  "use cache";

  return <PluginProductFeature />;
}
