import { getSocialAccounts } from "@/lib/fetchers/socialFetchers";
import { ComposerFeatureClient } from "./composerFeature.client";
export async function ComposerFeature() {
  return <ComposerFeatureClient accounts={await getSocialAccounts()} />;
}
