"use client";

import { SupportEditArticleTemplate } from "@/components/templates/support-templates";
import { useSupportSubmission } from "@/features/support/useSupportSubmission";
import { updateKnowledgeArticleWorkflow } from "@/lib/workflows/supportWorkflows";
import { knowledgeArticleFormSchema } from "@/schemas/supportSchemas";
import type { KnowledgeArticleDTO } from "@/types/supportTypes";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import type { z } from "zod";

/** Edit the selected article using its observed modification timestamp. */
export function SupportEditArticleForm({
  article,
}: {
  article: KnowledgeArticleDTO;
}) {
  const router = useRouter();
  const form = useForm<
    z.input<typeof knowledgeArticleFormSchema>,
    unknown,
    z.output<typeof knowledgeArticleFormSchema>
  >({
    resolver: zodResolver(knowledgeArticleFormSchema),
    defaultValues: {
      title: article.title,
      slug: article.slug,
      body: article.body,
    },
  });
  const state = useSupportSubmission(
    form,
    (values) =>
      updateKnowledgeArticleWorkflow({
        ...values,
        articleId: article.id,
        expectedUpdatedAt: article.updatedAt,
      }),
    (result) => {
      router.push(
        article.status === "PUBLISHED"
          ? `/support/knowledge-base/${result.id}`
          : "/support/knowledge-base",
      );
      router.refresh();
    },
  );
  return (
    <SupportEditArticleTemplate
      kind="editArticle"
      {...state}
      fields={[
        {
          name: "title",
          registration: form.register("title"),
          error: form.formState.errors.title?.message,
        },
        {
          name: "slug",
          registration: form.register("slug"),
          error: form.formState.errors.slug?.message,
        },
        {
          name: "article",
          registration: form.register("body"),
          error: form.formState.errors.body?.message,
          multiline: 18,
        },
      ]}
    />
  );
}
