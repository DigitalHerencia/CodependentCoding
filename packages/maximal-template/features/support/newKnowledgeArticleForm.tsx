"use client";

import {
  supportPresentationCopy,
  supportRemainingCopy,
} from "@/content/support";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  createKnowledgeArticle,
  updateKnowledgeArticle,
} from "@/lib/actions/supportActions";
import { knowledgeArticleFormSchema } from "@/schemas/supportSchemas";
import type { KnowledgeArticleDTO } from "@/types/supportTypes";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { FieldPath } from "react-hook-form";
import { Controller, useForm } from "react-hook-form";
import type { z } from "zod";

export function NewKnowledgeArticleForm({
  article,
}: {
  article?: KnowledgeArticleDTO;
}) {
  const router = useRouter();
  const [error, setError] = useState("");
  const {
    setError: setFieldError,
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<
    z.input<typeof knowledgeArticleFormSchema>,
    unknown,
    z.output<typeof knowledgeArticleFormSchema>
  >({
    resolver: zodResolver(knowledgeArticleFormSchema),
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
          if (!saved.ok) {
            for (const [name, messages] of Object.entries(
              saved.error.fieldErrors ?? {},
            ))
              setFieldError(
                name as FieldPath<z.input<typeof knowledgeArticleFormSchema>>,
                { message: messages[0] ?? saved.error.message },
              );
            setError(saved.error.message);
            return;
          }
          router.push(`/support/knowledge-base/${saved.data.id}`);
          router.refresh();
        } catch {
          setError(
            supportPresentationCopy.articleCouldNotBeSavedCheckTheUniqueSlug,
          );
        }
      })}
      noValidate
    >
      <h1 className="type-title">
        {article
          ? supportPresentationCopy.editArticle
          : supportPresentationCopy.writeAKnowledgeArticle}
      </h1>
      <Controller
        name={"title"}
        control={control}
        render={({ field: controllerField, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor="article-title">
              {supportRemainingCopy.title}
            </FieldLabel>
            <Input
              id="article-title"
              required
              maxLength={300}
              {...controllerField}
              value={String(controllerField.value ?? "")}
              aria-invalid={fieldState.invalid}
            />
            {fieldState.error && (
              <FieldError>{fieldState.error.message}</FieldError>
            )}
          </Field>
        )}
      />
      <Controller
        name={"slug"}
        control={control}
        render={({ field: controllerField, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor="article-slug">
              {supportRemainingCopy.slug}
            </FieldLabel>
            <Input
              id="article-slug"
              required
              pattern="[a-z0-9]+(-[a-z0-9]+)*"
              {...controllerField}
              value={String(controllerField.value ?? "")}
              aria-invalid={fieldState.invalid}
            />
            {fieldState.error && (
              <FieldError>{fieldState.error.message}</FieldError>
            )}
          </Field>
        )}
      />
      <Controller
        name={"body"}
        control={control}
        render={({ field: controllerField, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor="article-body">
              {supportRemainingCopy.article}
            </FieldLabel>
            <Textarea
              id="article-body"
              className="control-field min-h-96"
              required
              {...controllerField}
              value={String(controllerField.value ?? "")}
              aria-invalid={fieldState.invalid}
            />
            {fieldState.error && (
              <FieldError>{fieldState.error.message}</FieldError>
            )}
          </Field>
        )}
      />
      <p>
        {
          supportPresentationCopy.articlesAreAvailableToThisWorkspaceSKnowledgeBase
        }
      </p>
      {error && <p role="alert">{error}</p>}
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting
          ? supportPresentationCopy.saving
          : article
            ? supportPresentationCopy.saveArticle
            : supportPresentationCopy.publishArticle}
      </Button>
    </form>
  );
}
