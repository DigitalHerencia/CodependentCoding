"use client";
import Link from "next/link";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { SupportKnowledgeBaseTemplate } from "@/components/templates/supportKnowledgeBaseTemplate";
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
      toolbar={
        <div className="flex flex-wrap gap-3">
          <Input
            aria-label="Search knowledge base"
            placeholder="Search articles"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
          <Link className="type-link" href="/support/knowledge-base/new">
            Write article
          </Link>
        </div>
      }
    />
  );
}
