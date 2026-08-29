import { PageHeaderBlock } from "@/components/blocks/application-sections";
import { getConfiguredHuggingFaceModel } from "@/lib/integrations/hugging-face/inference";
import { isHuggingFaceConfigured } from "@/lib/integrations/hugging-face/client";

import { PlaygroundFeatureClient } from "./playgroundFeature.client";

// Features orchestrate blocks and lib helpers; they never import raw UI primitives.
export function PlaygroundFeature() {
  return (
    <div className="space-y-6">
      <PageHeaderBlock
        eyebrow="AI"
        title="Hugging Face playground"
        description="Run an authorized, metered generation without sharing personalized output through cache."
      />
      <PlaygroundFeatureClient
        configured={isHuggingFaceConfigured()}
        model={getConfiguredHuggingFaceModel()}
      />
    </div>
  );
}
