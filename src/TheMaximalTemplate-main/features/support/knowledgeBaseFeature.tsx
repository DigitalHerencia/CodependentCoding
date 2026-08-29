import {
  DataTableBlock,
  PageHeaderBlock,
} from "@/components/blocks/application-sections";
import { getKnowledgeArticles } from "@/lib/fetchers/supportFetchers";

export async function KnowledgeBaseFeature() {
  const articles = await getKnowledgeArticles();
  return (
    <div className="space-y-6">
      <PageHeaderBlock eyebrow="Support" title="Knowledge base" />
      <DataTableBlock
        columns={[
          { key: "title", label: "Article" },
          { key: "status", label: "Status" },
          { key: "updated", label: "Updated" },
        ]}
        rows={articles.map((article) => ({
          id: article.id,
          cells: {
            title: article.title,
            status: article.status,
            updated: new Date(article.updatedAt).toLocaleDateString(),
          },
        }))}
      />
    </div>
  );
}
