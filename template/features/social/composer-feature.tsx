import { getSocialAccounts } from "@/lib/fetchers/socialFetchers";
import { ComposerFeatureClient } from "./social-composer-form.client";
export async function ComposerFeature() {
  return <ComposerFeatureClient accounts={await getSocialAccounts()} />;
}
