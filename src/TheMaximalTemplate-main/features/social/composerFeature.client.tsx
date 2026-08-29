"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  createSocialPost,
  scheduleSocialPost,
} from "@/lib/actions/socialActions";
import type { SocialAccountDTO } from "@/types/socialTypes";

type ComposerForm = { title: string; content: string; scheduledAt: string };

export function ComposerFeatureClient({
  accounts,
}: {
  accounts: SocialAccountDTO[];
}) {
  const [selectedAccountIds, setSelectedAccountIds] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<ComposerForm>();

  const submit = handleSubmit(async (values) => {
    setError(null);
    setSuccess(null);
    if (!selectedAccountIds.length) {
      setError("Select at least one social account.");
      return;
    }
    try {
      const post = await createSocialPost({
        title: values.title || null,
        content: values.content,
        variants: selectedAccountIds.map((socialAccountId) => ({
          socialAccountId,
          content: values.content,
        })),
      });
      await scheduleSocialPost({
        postId: post.id,
        scheduledAt: values.scheduledAt,
        expectedVersion: post.version,
      });
      reset();
      setSelectedAccountIds([]);
      setSuccess("The post was scheduled.");
    } catch (cause) {
      setError(
        cause instanceof Error ? cause.message : "Unable to schedule the post.",
      );
    }
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Compose a scheduled post</CardTitle>
      </CardHeader>
      <CardContent>
        <form className="space-y-5" onSubmit={(event) => void submit(event)}>
          <Input
            aria-label="Post title"
            placeholder="Post title (optional)"
            {...register("title")}
          />
          <Textarea
            aria-label="Post content"
            placeholder="What should be published?"
            rows={8}
            {...register("content", { required: true })}
          />
          <fieldset className="space-y-2">
            <legend className="text-sm font-black uppercase tracking-wider">
              Accounts
            </legend>
            {accounts.length ? (
              accounts.map((account) => (
                <label
                  key={account.id}
                  className="flex items-center gap-2 text-sm"
                >
                  <input
                    type="checkbox"
                    checked={selectedAccountIds.includes(account.id)}
                    onChange={() =>
                      setSelectedAccountIds((current) =>
                        current.includes(account.id)
                          ? current.filter((id) => id !== account.id)
                          : [...current, account.id],
                      )
                    }
                  />
                  {account.displayName} · {account.provider}
                </label>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">
                No active social accounts are configured.
              </p>
            )}
          </fieldset>
          <Input
            aria-label="Publication time"
            type="datetime-local"
            {...register("scheduledAt", { required: true })}
          />
          {error ? (
            <p role="alert" className="text-sm text-destructive">
              {error}
            </p>
          ) : null}
          {success ? (
            <p role="status" className="text-sm text-success">
              {success}
            </p>
          ) : null}
          <Button
            type="submit"
            disabled={isSubmitting || accounts.length === 0}
          >
            {isSubmitting ? "Scheduling…" : "Create and schedule"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
