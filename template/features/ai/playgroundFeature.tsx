import { PageHeaderBlock } from "@/components/blocks/application-sections";
import { getAiPlaygroundConfiguration } from "@/lib/fetchers/aiFetchers";

import { PlaygroundFeatureClient } from "./playgroundFeature.client";

// Features orchestrate blocks and lib helpers; they never import raw UI primitives.
export function PlaygroundFeature() {
  const configuration = getAiPlaygroundConfiguration();
  return (
    <div className="space-y-6">
      <PageHeaderBlock
        eyebrow="AI"
        title="Hugging Face playground"
        description="Run an authorized, metered generation without sharing personalized output through cache."
      />
      <PlaygroundFeatureClient
        configured={configuration.configured}
        model={configuration.model}
      />
    </div>
  );
}
