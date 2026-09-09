import Link from "next/link";
import type { ReactNode } from "react";
import type { KnowledgeArticleDTO } from "@/types/supportTypes";
import { DashboardLayout } from "@/components/blocks/dashboard-layout";
export function SupportKnowledgeBaseTemplate({
  articles,
  toolbar,
}: {
  articles: KnowledgeArticleDTO[];
  toolbar: ReactNode;
}) {
  return (
    <DashboardLayout title="Knowledge base" nav={[]} toolbar={toolbar}>
      <div className="grid gap-4 md:grid-cols-2">
        {articles.map((article) => (
          <article key={article.id} className="space-y-3 surface-card p-5">
            <Link
              className="type-title hover:underline"
              href={`/support/knowledge-base/${article.id}`}
            >
              {article.title}
            </Link>
            <p className="line-clamp-3 whitespace-pre-wrap text-muted-primary">
              {article.body}
            </p>
            <p className="text-xs">Updated {article.updatedAt.slice(0, 10)}</p>
          </article>
        ))}
      </div>
      {!articles.length && <p>No matching articles.</p>}
    </DashboardLayout>
  );
}
