import { PluginProduct } from "@/components/blocks/plugin-product";
import { getPluginManifest } from "@/lib/fetchers/pluginFetchers";

export async function PluginProductFeature() {
  return <PluginProduct plugin={await getPluginManifest()} />;
}
