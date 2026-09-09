import { getKnowledgeArticles } from "@/lib/fetchers/supportFetchers";
import { KnowledgeBaseFeatureClient } from "./knowledgeBaseFeature.client";
export async function KnowledgeBaseFeature() {
  return <KnowledgeBaseFeatureClient articles={await getKnowledgeArticles()} />;
}
