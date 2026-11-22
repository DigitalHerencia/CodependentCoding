"use client";

import {
  SocialComposeTemplate,
  SocialFieldTemplate,
  SocialTargetsTemplate,
  SocialSubmitTemplate,
} from "@/components/templates/social-templates";
import {
  createSocialPostWorkflow,
  loadComposerWorkflow,
} from "@/lib/workflows/socialWorkflows";
import { createSocialPostSchema } from "@/schemas/socialSchemas";
import type {
  SocialComposerProps,
  SocialNewPostValues,
} from "@/types/socialTypes";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Controller, useForm, useWatch, type FieldPath } from "react-hook-form";

/** Own draft fields and submit exactly the parent and per-account payloads shown in previews. */
export function SocialNewPostForm({ initialPage }: SocialComposerProps) {
  const router = useRouter();
  const [saved, setSaved] = useState(false);
  const [{ accounts, nextCursor }, setAccountPage] = useState(initialPage);
  const [loadingAccounts, startAccountTransition] = useTransition();
  const [pageUnavailable, setPageUnavailable] = useState(false);
  const form = useForm<SocialNewPostValues>({
    resolver: zodResolver(createSocialPostSchema),
    defaultValues: { title: "", content: "", variants: [] },
  });
  const title = useWatch({ control: form.control, name: "title" });
  const content = useWatch({ control: form.control, name: "content" });
  const variants = useWatch({ control: form.control, name: "variants" });

  /** Append the next authorized page without changing existing form selections. */
  function loadMoreAccounts() {
    if (!nextCursor) return;
    setPageUnavailable(false);
    startAccountTransition(async () => {
      try {
        const page = await loadComposerWorkflow(nextCursor);
        setAccountPage((current) => {
          const loaded = new Map(
            current.accounts.map((account) => [account.id, account]),
          );
          for (const account of page.accounts) loaded.set(account.id, account);
          return {
            accounts: [...loaded.values()],
            nextCursor: page.nextCursor,
          };
        });
      } catch {
        setPageUnavailable(true);
      }
    });
  }
  return (
    <SocialComposeTemplate
      title={title ?? ""}
      content={content}
      variants={variants.map((variant) => ({
        ...variant,
        content: variant.content.trim(),
      }))}
      accounts={accounts}
    >
      <form
        className="space-y-4"
        noValidate
        onChange={() => setSaved(false)}
        onSubmit={form.handleSubmit(async (input) => {
          try {
            const result = await createSocialPostWorkflow(input);
            if (!result.ok) {
              for (const [name, errors] of Object.entries(
                result.error.fieldErrors ?? {},
              )) {
                form.setError(name as FieldPath<SocialNewPostValues>, {
                  message: errors[0] ?? result.error.message,
                });
              }
              form.setError("root", { message: result.error.message });
              return;
            }
            setSaved(true);
            router.refresh();
          } catch {
            form.setError("root", { message: "UNAVAILABLE" });
          }
        })}
      >
        <Controller
          name="title"
          control={form.control}
          render={({ field, fieldState }) => (
            <SocialFieldTemplate
              kind="title"
              id="social-title"
              inputProps={{ ...field, value: field.value ?? "" }}
              error={fieldState.error?.message}
            />
          )}
        />
        <Controller
          name="content"
          control={form.control}
          render={({ field, fieldState }) => (
            <SocialFieldTemplate
              kind="content"
              id="social-content"
              textareaProps={field}
              error={fieldState.error?.message}
            />
          )}
        />
        <Controller
          name="variants"
          control={form.control}
          render={({ field, fieldState }) => (
            <SocialTargetsTemplate
              accounts={accounts}
              selected={field.value.map((variant) => variant.socialAccountId)}
              onBlur={field.onBlur}
              error={fieldState.error?.message}
              onLoadMore={nextCursor ? loadMoreAccounts : undefined}
              pending={loadingAccounts}
              pageUnavailable={pageUnavailable}
              onToggle={(id, selected) =>
                field.onChange(
                  selected
                    ? [
                        ...field.value,
                        {
                          socialAccountId: id,
                          content: form.getValues("content"),
                        },
                      ]
                    : field.value.filter(
                        (variant) => variant.socialAccountId !== id,
                      ),
                )
              }
            />
          )}
        />
        {variants.map((variant, index) => (
          <Controller
            key={variant.socialAccountId}
            name={`variants.${index}.content`}
            control={form.control}
            render={({ field, fieldState }) => (
              <SocialFieldTemplate
                kind="variant"
                id={`social-variant-${variant.socialAccountId}`}
                accountName={
                  accounts.find(
                    (account) => account.id === variant.socialAccountId,
                  )?.displayName
                }
                textareaProps={field}
                error={fieldState.error?.message}
              />
            )}
          />
        ))}
        <SocialSubmitTemplate
          kind="draft"
          pending={form.formState.isSubmitting}
          disabled={saved || !variants.length}
          saved={saved}
          error={form.formState.errors.root?.message}
        />
      </form>
    </SocialComposeTemplate>
  );
}
