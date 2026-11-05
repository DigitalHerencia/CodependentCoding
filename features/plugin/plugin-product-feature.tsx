import { PluginProduct } from "@/components/blocks/plugin-product";
import { getPluginManifest } from "@/lib/content/plugin";

export async function PluginProductFeature() {
  return <PluginProduct plugin={await getPluginManifest()} />;
}
