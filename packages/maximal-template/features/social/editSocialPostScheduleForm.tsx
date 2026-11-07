"use client";

import { formResultCopy } from "@/content/application";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { socialPresentationCopy, socialRemainingCopy } from "@/content/social";
import {
  approveSocialPost,
  scheduleSocialPost,
} from "@/lib/actions/socialActions";
import {
  approveSocialPostSchema,
  scheduleSocialPostSchema,
} from "@/schemas/socialSchemas";
import type { SocialPostDTO } from "@/types/socialTypes";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import type { z } from "zod";

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
export function EditSocialPostScheduleForm({ post }: { post: SocialPostDTO }) {
  if (!["DRAFT", "FAILED"].includes(post.status)) return null;
  return post.approvedAt ? (
    <SchedulePostForm post={post} />
  ) : (
    <ApprovePostForm post={post} />
  );
}
