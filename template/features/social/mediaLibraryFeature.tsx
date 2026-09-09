import { getMediaAssets } from "@/lib/fetchers/socialFetchers";
import { MediaLibraryFeatureClient } from "./mediaLibraryFeature.client";
export async function MediaLibraryFeature() {
  return <MediaLibraryFeatureClient assets={await getMediaAssets()} />;
}
