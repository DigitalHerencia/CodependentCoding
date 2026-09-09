import Link from "next/link";
import type { KnowledgeArticleDTO } from "@/types/supportTypes";
export function SupportKnowledgeArticleTemplate({
  article,
}: {
  article: KnowledgeArticleDTO;
}) {
  return (
    <article className="mx-auto max-w-4xl space-y-6 p-5">
      <Link className="type-link" href="/support/knowledge-base">
        Knowledge base
      </Link>
      <header className="space-y-3 border-b border-border pb-5">
        <h1 className="type-title">{article.title}</h1>
        <p>Updated {article.updatedAt.slice(0, 10)}</p>
        <Link
          className="type-link"
          href={`/support/knowledge-base/${article.id}/edit`}
        >
          Edit article
        </Link>
      </header>
      <div className="reading-copy whitespace-pre-wrap">{article.body}</div>
    </article>
  );
}
