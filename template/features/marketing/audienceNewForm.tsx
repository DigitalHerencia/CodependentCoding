"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { createAudience, updateAudience } from "@/lib/actions/marketingActions";
import { audienceFormSchema } from "@/schemas/marketingSchemas";
import type { AudienceDTO } from "@/types/marketingTypes";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
export function AudienceNewForm({ audience }: { audience?: AudienceDTO }) {
  const router = useRouter();
  const [error, setError] = useState("");
  const existing = audience ? audienceFormSchema.safeParse(audience) : null;
  const unsupported = Boolean(existing && !existing.success);
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<{ name: string; status: string; contactStatus: string }>({
    defaultValues: {
      name: audience?.name ?? "",
      status: audience?.status ?? "DRAFT",
      contactStatus: existing?.success
        ? existing.data.definition.rules[0]!.value
        : "active",
    },
  });
  return (
    <form
      className="mx-auto max-w-3xl space-y-5 surface-card p-5"
      onSubmit={handleSubmit(async (values) => {
        setError("");
        try {
          const input = {
            name: values.name,
            status: values.status,
            definition: {
              operator: "and",
              rules: [
                {
                  field: "status",
                  operator: "equals",
                  value: values.contactStatus,
                },
              ],
            },
          };
          const saved = audience
            ? await updateAudience({
                ...input,
                audienceId: audience.id,
                expectedUpdatedAt: audience.updatedAt,
              })
            : await createAudience(input);
          router.push(`/marketing/audiences/${saved.id}`);
          router.refresh();
        } catch {
          setError(
            "Audience could not be saved. Check permissions or reload if it changed.",
          );
        }
      })}
    >
      <h1 className="type-title">
        {audience ? "Edit audience" : "Define an audience"}
      </h1>
      <div className="form-field">
        <Label htmlFor="audience-name">Audience name</Label>
        <Input id="audience-name" required {...register("name")} />
      </div>
      <fieldset className="space-y-3 surface-inset p-5">
        <legend>Include contacts matching</legend>
        <Label htmlFor="audience-rule">Contact relationship equals</Label>
        <select
          id="audience-rule"
          className="control-field"
          {...register("contactStatus")}
        >
          <option value="active">Active</option>
          <option value="lead">Lead</option>
          <option value="inactive">Inactive</option>
        </select>
      </fieldset>
      <div className="form-field">
        <Label htmlFor="audience-status">Audience status</Label>
        <select
          id="audience-status"
          className="control-field"
          {...register("status")}
        >
          <option>DRAFT</option>
          <option>ACTIVE</option>
          <option>ARCHIVED</option>
        </select>
      </div>
      {unsupported && (
        <p role="alert">
          This audience uses rules this editor does not support. Its definition
          has been preserved.
        </p>
      )}
      {error && <p role="alert">{error}</p>}
      <Button type="submit" disabled={isSubmitting || unsupported}>
        {isSubmitting ? "Saving…" : "Save audience"}
      </Button>
    </form>
  );
}
