import {
  DataTableBlock,
  PageHeaderBlock,
} from "@/components/blocks/application-sections";
import { getMyAiGenerations } from "@/lib/fetchers/aiFetchers";

// Features orchestrate blocks and lib helpers; they never import raw UI primitives.
export async function GenerationFeature() {
  const generations = await getMyAiGenerations();
  return (
    <div className="space-y-6">
      <PageHeaderBlock
        eyebrow="AI"
        title="Generations"
        description="Your tenant-scoped generation history."
        action={{ label: "Open playground", href: "/ai/playground" }}
      />
      <DataTableBlock
        columns={[
          { key: "model", label: "Model" },
          { key: "status", label: "Status" },
          { key: "tokens", label: "Tokens" },
          { key: "cost", label: "Cost" },
          { key: "created", label: "Created" },
        ]}
        rows={generations.map((generation) => ({
          id: generation.id,
          cells: {
            model: `${generation.provider} · ${generation.model}`,
            status: generation.status,
            tokens: `${generation.inputTokens + generation.outputTokens}`,
            cost: `$${generation.cost}`,
            created: new Date(generation.createdAt).toLocaleString(),
          },
        }))}
      />
    </div>
  );
}
