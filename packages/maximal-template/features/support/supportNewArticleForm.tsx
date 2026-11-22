"use client";

import { SupportNewArticleTemplate } from "@/components/templates/support-templates";
import { useSupportSubmission } from "@/features/support/useSupportSubmission";
import { createKnowledgeArticleWorkflow } from "@/lib/workflows/supportWorkflows";
import { knowledgeArticleFormSchema } from "@/schemas/supportSchemas";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import type { z } from "zod";

/** Collect article fields for immediate publication. */
export function SupportNewArticleForm() {
  const router = useRouter();
  const form = useForm<
    z.input<typeof knowledgeArticleFormSchema>,
    unknown,
    z.output<typeof knowledgeArticleFormSchema>
  >({
    resolver: zodResolver(knowledgeArticleFormSchema),
    defaultValues: { title: "", slug: "", body: "" },
  });
  const state = useSupportSubmission(
    form,
    createKnowledgeArticleWorkflow,
    (result) => {
      router.push(`/support/knowledge-base/${result.id}`);
      router.refresh();
    },
  );
  return (
    <SupportNewArticleTemplate
      kind="newArticle"
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
