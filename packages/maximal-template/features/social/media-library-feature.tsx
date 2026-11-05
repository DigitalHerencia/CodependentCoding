import { getMediaAssets } from "@/lib/fetchers/socialFetchers";
import { MediaLibraryFeatureClient } from "./media-library-feature.client";
export async function MediaLibraryFeature() {
  return <MediaLibraryFeatureClient assets={await getMediaAssets()} />;
}
