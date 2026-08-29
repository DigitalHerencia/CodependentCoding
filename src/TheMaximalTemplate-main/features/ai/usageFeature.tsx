import {
  MetricGridBlock,
  PageHeaderBlock,
} from "@/components/blocks/application-sections";
import { getMyAiUsage } from "@/lib/fetchers/aiFetchers";

// Features orchestrate blocks and lib helpers; they never import raw UI primitives.
export async function UsageFeature() {
  const usage = await getMyAiUsage();
  return (
    <div className="space-y-6">
      <PageHeaderBlock
        eyebrow="AI"
        title="Usage"
        description="Provider-reported usage for your identity in the active organization."
      />
      <MetricGridBlock
        metrics={[
          { label: "Generations", value: usage.generationCount.toString() },
          { label: "Input tokens", value: usage.inputTokens.toLocaleString() },
          {
            label: "Output tokens",
            value: usage.outputTokens.toLocaleString(),
          },
          { label: "Provider cost", value: `$${usage.cost}` },
        ]}
      />
    </div>
  );
}
