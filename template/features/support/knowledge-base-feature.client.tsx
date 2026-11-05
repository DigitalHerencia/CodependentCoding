"use client";
import { KnowledgeBaseToolbar } from "@/components/blocks/support-blocks";
import { useState } from "react";
import { SupportKnowledgeBaseTemplate } from "@/components/templates/support-templates";
import type { KnowledgeArticleDTO } from "@/types/supportTypes";
export function KnowledgeBaseFeatureClient({
  articles,
}: {
  articles: KnowledgeArticleDTO[];
}) {
  const [query, setQuery] = useState("");
  return (
    <SupportKnowledgeBaseTemplate
      articles={articles.filter((article) =>
        `${article.title} ${article.body}`
          .toLowerCase()
          .includes(query.toLowerCase()),
      )}
      toolbar={<KnowledgeBaseToolbar query={query} onQueryChange={setQuery} />}
    />
  );
}
