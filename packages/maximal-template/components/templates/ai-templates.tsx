import {
  AiGenerationContentBlock,
  AiGenerationToolbarBlock,
  AiPlaygroundPageBlock,
  AiUsageContentBlock,
} from "@/components/blocks/ai-page-blocks";
import { DashboardLayout } from "@/components/blocks/shared-blocks";
import { aiPresentationCopy } from "@/content/ai";
import type { ComponentProps } from "react";

export function AiGenerationTemplate(
  props: ComponentProps<typeof AiGenerationContentBlock>,
) {
  return (
    <DashboardLayout
      title={aiPresentationCopy.generationHistory}
      nav={[]}
      toolbar={<AiGenerationToolbarBlock {...props} />}
    >
      <AiGenerationContentBlock {...props} />
    </DashboardLayout>
  );
}
export function AiPlaygroundTemplate(
  props: ComponentProps<typeof AiPlaygroundPageBlock>,
) {
  return <AiPlaygroundPageBlock {...props} />;
}
export function AiUsageTemplate(
  props: ComponentProps<typeof AiUsageContentBlock>,
) {
  return (
    <DashboardLayout title={aiPresentationCopy.myAIUsage} nav={[]}>
      <AiUsageContentBlock {...props} />
    </DashboardLayout>
  );
}
