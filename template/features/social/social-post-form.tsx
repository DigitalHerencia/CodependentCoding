"use client";
import { socialRemainingCopy } from "@/content/social";

import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";
import {
  approveSocialPost,
  scheduleSocialPost,
} from "@/lib/actions/socialActions";
import {
  approveSocialPostSchema,
  scheduleSocialPostSchema,
} from "@/schema/socialSchemas";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import { socialPresentationCopy } from "@/content/social";
import { formResultCopy } from "@/content/application";
import type { SocialPostDTO } from "@/types/socialTypes";
function ApprovePostForm({ post }: { post: SocialPostDTO }) {
  const router = useRouter();
  const form = useForm<z.input<typeof approveSocialPostSchema>>({
    resolver: zodResolver(approveSocialPostSchema),
    defaultValues: { postId: post.id, expectedVersion: post.version },
  });
  return (
    <form
      onSubmit={form.handleSubmit(async (values) => {
        try {
          const result = await approveSocialPost(values);
          if (!result.ok) {
            form.setError("root", { message: result.error.message });
            return;
          }
          router.refresh();
        } catch {
          form.setError("root", { message: formResultCopy.failed });
        }
      })}
      noValidate
    >
      <Button type="submit" disabled={form.formState.isSubmitting}>
        {socialPresentationCopy.approveDraft}
      </Button>
      {form.formState.errors.root && (
        <FieldError>{form.formState.errors.root.message}</FieldError>
      )}
    </form>
  );
}
function SchedulePostForm({ post }: { post: SocialPostDTO }) {
  const router = useRouter();
  const form = useForm<
    z.input<typeof scheduleSocialPostSchema>,
    unknown,
    z.output<typeof scheduleSocialPostSchema>
  >({
    resolver: zodResolver(scheduleSocialPostSchema),
    defaultValues: {
      postId: post.id,
      expectedVersion: post.version,
      scheduledAt: "",
    },
  });
  return (
    <form
      className="space-y-3"
      onSubmit={form.handleSubmit(async (values) => {
        try {
          const result = await scheduleSocialPost(values);
          if (!result.ok) {
            if (result.error.fieldErrors?.scheduledAt?.[0])
              form.setError("scheduledAt", {
                message: result.error.fieldErrors.scheduledAt[0],
              });
            form.setError("root", { message: result.error.message });
            return;
          }
          router.refresh();
        } catch {
          form.setError("root", { message: formResultCopy.failed });
        }
      })}
      noValidate
    >
      <Controller
        name="scheduledAt"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={post.id + "-time"}>
              {socialRemainingCopy.publishTimeInUTC}
            </FieldLabel>
            <Input
              {...field}
              value={String(field.value ?? "")}
              id={post.id + "-time"}
              type="datetime-local"
              aria-invalid={fieldState.invalid}
            />
            {fieldState.error && (
              <FieldError>{fieldState.error.message}</FieldError>
            )}
          </Field>
        )}
      />
      <Button type="submit" disabled={form.formState.isSubmitting}>
        {socialPresentationCopy.scheduleUTC}
      </Button>
      {form.formState.errors.root && (
        <FieldError>{form.formState.errors.root.message}</FieldError>
      )}
    </form>
  );
}
export function SchedulePost({ post }: { post: SocialPostDTO }) {
  if (!["DRAFT", "FAILED"].includes(post.status)) return null;
  return post.approvedAt ? (
    <SchedulePostForm post={post} />
  ) : (
    <ApprovePostForm post={post} />
  );
}
