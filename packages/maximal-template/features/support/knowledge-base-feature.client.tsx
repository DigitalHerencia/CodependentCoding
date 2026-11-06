"use client";

import { SupportKnowledgeBaseTemplate } from "@/components/templates/support-templates";
import { selectKnowledgeBaseWorkflow } from "@/lib/workflows/supportClientWorkflows";
import type { KnowledgeArticleDTO } from "@/types/supportTypes";
import { useState } from "react";

export function KnowledgeBaseFeatureClient({
  articles,
}: {
  articles: KnowledgeArticleDTO[];
}) {
  const [query, setQuery] = useState("");
  return (
    <SupportKnowledgeBaseTemplate
      articles={selectKnowledgeBaseWorkflow(articles, query)}
      toolbarProps={{ query: query, onQueryChange: setQuery }}
    />
  );
}
