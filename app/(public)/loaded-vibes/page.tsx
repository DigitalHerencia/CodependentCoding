import type { Metadata } from "next";
import { PluginProductFeature } from "@/features/plugin/pluginProductFeature";

export const metadata: Metadata = {
  title: "Loaded Vibes™ · Codependent Coding™",
};

export default function Page() {
  return <PluginProductFeature />;
}
