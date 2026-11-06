import { loadKnowledgeBaseWorkflow } from "@/lib/workflows/supportWorkflows";
import { KnowledgeBaseFeatureClient } from "./knowledge-base-feature.client";

export async function KnowledgeBaseFeature() {
  const { articles } = await loadKnowledgeBaseWorkflow();
  return <KnowledgeBaseFeatureClient articles={articles} />;
}
