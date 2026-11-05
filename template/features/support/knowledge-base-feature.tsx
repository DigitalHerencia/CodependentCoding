import { getKnowledgeArticles } from "@/lib/fetchers/supportFetchers";
import { KnowledgeBaseFeatureClient } from "./knowledge-base-feature.client";
export async function KnowledgeBaseFeature() {
  return <KnowledgeBaseFeatureClient articles={await getKnowledgeArticles()} />;
}
