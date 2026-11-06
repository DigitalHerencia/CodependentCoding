import { loadMediaLibraryWorkflow } from "@/lib/workflows/socialWorkflows";
import { MediaLibraryFeatureClient } from "./media-library-feature.client";

export async function MediaLibraryFeature() {
  const { assets } = await loadMediaLibraryWorkflow();
  return <MediaLibraryFeatureClient assets={assets} />;
}
