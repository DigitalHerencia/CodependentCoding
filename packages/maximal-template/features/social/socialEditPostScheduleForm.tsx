"use client";

import {
  SocialFieldTemplate,
  SocialSubmitTemplate,
} from "@/components/templates/social-templates";
import {
  approveSocialPostWorkflow,
  scheduleSocialPostWorkflow,
} from "@/lib/workflows/socialWorkflows";
import {
  approveSocialPostSchema,
  scheduleSocialPostFormSchema,
} from "@/schemas/socialSchemas";
import type {
  SocialPostControlProps,
  SocialApprovalValues,
  SocialScheduleValues,
  SocialScheduleCommand,
} from "@/types/socialTypes";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";

/** Submit approval for the displayed revision without changing its reviewed payload. */
function SocialApprovalForm({ post }: SocialPostControlProps) {
  const router = useRouter();
  const [saved, setSaved] = useState(false);
  const form = useForm<SocialApprovalValues>({
    resolver: zodResolver(approveSocialPostSchema),
    defaultValues: { postId: post.id, expectedVersion: post.version },
  });
  return (
    <form
      noValidate
      onSubmit={form.handleSubmit(async (input) => {
        try {
          const result = await approveSocialPostWorkflow(input);
          if (!result.ok) {
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
      <SocialSubmitTemplate
        kind="approval"
        pending={form.formState.isSubmitting}
        saved={saved}
        disabled={saved}
        error={form.formState.errors.root?.message}
      />
    </form>
  );
}
/** Normalize the explicitly labeled UTC input and persist scheduling intent for an approved revision. */
function SocialScheduleForm({ post }: SocialPostControlProps) {
  const router = useRouter();
  const [saved, setSaved] = useState(false);
  const form = useForm<SocialScheduleValues, unknown, SocialScheduleCommand>({
    resolver: zodResolver(scheduleSocialPostFormSchema),
    defaultValues: {
      postId: post.id,
      expectedVersion: post.version,
      scheduledAt: "",
    },
  });
  return (
    <form
      className="space-y-3"
      noValidate
      onSubmit={form.handleSubmit(async (input) => {
        try {
          const result = await scheduleSocialPostWorkflow(input);
          if (!result.ok) {
            const message = result.error.fieldErrors?.scheduledAt?.[0];
            if (message) form.setError("scheduledAt", { message });
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
        name="scheduledAt"
        control={form.control}
        render={({ field, fieldState }) => (
          <SocialFieldTemplate
            kind="schedule"
            id={`${post.id}-time`}
            inputProps={{
              ...field,
              value: String(field.value ?? ""),
              type: "datetime-local",
            }}
            error={fieldState.error?.message}
          />
        )}
      />
      <SocialSubmitTemplate
        kind="schedule"
        pending={form.formState.isSubmitting}
        saved={saved}
        disabled={saved}
        error={form.formState.errors.root?.message}
      />
    </form>
  );
}
/** Select the existing approval or scheduling command while server authorization mediates every submission. */
export function SocialEditPostScheduleForm({ post }: SocialPostControlProps) {
  if (post.status !== "DRAFT" && post.status !== "FAILED") return null;
  if (post.approvedAt && post.approvedBy)
    return <SocialScheduleForm post={post} />;
  return post.status === "DRAFT" ? <SocialApprovalForm post={post} /> : null;
}
