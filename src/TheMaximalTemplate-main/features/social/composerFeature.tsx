import { PageHeaderBlock } from "@/components/blocks/application-sections";
import { getSocialAccounts } from "@/lib/fetchers/socialFetchers";

import { ComposerFeatureClient } from "./composerFeature.client";

export async function ComposerFeature() {
  const accounts = await getSocialAccounts();
  return (
    <div className="space-y-6">
      <PageHeaderBlock
        eyebrow="Social"
        title="Compose"
        description="Create platform-aware variants and schedule publication."
      />
      <ComposerFeatureClient accounts={accounts} />
    </div>
  );
}
