import { getSocialAccounts } from "@/lib/fetchers/socialFetchers";
import { ComposerFeatureClient } from "./composer-feature.client";
export async function ComposerFeature() {
  return <ComposerFeatureClient accounts={await getSocialAccounts()} />;
}
