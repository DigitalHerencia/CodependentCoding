"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import {
  createKnowledgeArticle,
  updateKnowledgeArticle,
} from "@/lib/actions/supportActions";
import type { KnowledgeArticleDTO } from "@/types/supportTypes";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
export function KnowledgeArticleNewForm({
  article,
}: {
  article?: KnowledgeArticleDTO;
}) {
  const router = useRouter();
  const [error, setError] = useState("");
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<{ title: string; slug: string; body: string }>({
    defaultValues: {
      title: article?.title ?? "",
      slug: article?.slug ?? "",
      body: article?.body ?? "",
    },
  });
  return (
    <form
      className="mx-auto max-w-4xl space-y-5 surface-card p-5"
      onSubmit={handleSubmit(async (values) => {
        setError("");
        try {
          const saved = article
            ? await updateKnowledgeArticle({
                ...values,
                articleId: article.id,
                expectedUpdatedAt: article.updatedAt,
              })
            : await createKnowledgeArticle(values);
          router.push(`/support/knowledge-base/${saved.id}`);
          router.refresh();
        } catch {
          setError(
            "Article could not be saved. Check the unique slug, permissions, or reload if the article changed.",
          );
        }
      })}
    >
      <h1 className="type-title">
        {article ? "Edit article" : "Write a knowledge article"}
      </h1>
      <div className="form-field">
        <Label htmlFor="article-title">Title</Label>
        <Input
          id="article-title"
          required
          maxLength={300}
          {...register("title")}
        />
      </div>
      <div className="form-field">
        <Label htmlFor="article-slug">Slug</Label>
        <Input
          id="article-slug"
          required
          pattern="[a-z0-9]+(-[a-z0-9]+)*"
          {...register("slug")}
        />
      </div>
      <div className="form-field">
        <Label htmlFor="article-body">Article</Label>
        <textarea
          id="article-body"
          className="control-field min-h-96"
          required
          {...register("body")}
        />
      </div>
      <p>Articles are available to this workspace’s knowledge-base readers.</p>
      {error && <p role="alert">{error}</p>}
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting
          ? "Saving…"
          : article
            ? "Save article"
            : "Publish article"}
      </Button>
    </form>
  );
}
