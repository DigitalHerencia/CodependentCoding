"use client";

import { useEffect, useId, useState } from "react";
import { useRouter } from "next/navigation";
import { Controller, useForm, type FieldPath } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  MarketingAudienceNewTemplate,
  MarketingAudienceEditTemplate,
  MarketingFieldTemplate,
} from "@/components/templates/marketing-templates";
import { saveAudienceWorkflow } from "@/lib/workflows/marketingWorkflows";
import { audienceFormSchema } from "@/schemas/marketingSchemas";
import type {
  AudienceEditorValues,
  MarketingAudienceFormProps,
  MarketingSubmissionState,
} from "@/types/marketingTypes";

/** Own audience RHF bindings while preserving definitions outside the supported editor. */
export function NewAudienceForm({
  audience,
  canSave,
}: MarketingAudienceFormProps) {
  const router = useRouter();
  const id = useId();
  const [state, setState] = useState<MarketingSubmissionState>({
    error: null,
    saved: false,
  });
  const form = useForm<AudienceEditorValues>({
    resolver: zodResolver(audienceFormSchema),
    defaultValues: {
      name: audience?.name ?? "",
      status: audience?.status ?? "DRAFT",
      definition: {
        operator: "and",
        rules: [
          {
            field: "status",
            operator: "equals",
            value: audience?.relationship ?? "active",
          },
        ],
      },
    },
  });
  useEffect(() => {
    if (state.error)
      document
        .querySelector<HTMLElement>("[data-marketing-form-error]")
        ?.focus();
  }, [state.error]);
  const Template = audience
    ? MarketingAudienceEditTemplate
    : MarketingAudienceNewTemplate;
  return (
    <Template
      kind="audience"
      pending={form.formState.isSubmitting}
      unavailable={!canSave}
      customDefinition={Boolean(audience && !audience.editableDefinition)}
      conflict={state.error?.code === "CONFLICT"}
      error={state.error?.message}
      onReload={() => location.reload()}
      cancelHref={
        audience
          ? `/marketing/audiences/${audience.id}`
          : "/marketing/audiences"
      }
      onSubmit={form.handleSubmit(async (values) => {
        setState({ error: null, saved: false });
        try {
          const result = await saveAudienceWorkflow({
            values,
            record: audience
              ? { id: audience.id, updatedAt: audience.updatedAt }
              : null,
          });
          if (!result.ok) {
            for (const [name, messages] of Object.entries(
              result.error.fieldErrors ?? {},
            )) {
              const path = name.replace(/^values\./, "");
              if (["name", "status", "definition.rules.0.value"].includes(path))
                form.setError(
                  path as FieldPath<AudienceEditorValues>,
                  { message: messages[0] ?? result.error.message },
                  { shouldFocus: true },
                );
            }
            setState({ error: result.error, saved: false });
            return;
          }
          router.push(`/marketing/audiences/${result.data.id}`);
          router.refresh();
        } catch {
          setState({ error: { code: "INTERNAL", message: "" }, saved: false });
        }
      })}
    >
      <Controller
        name="name"
        control={form.control}
        render={({ field, fieldState }) => (
          <MarketingFieldTemplate
            id={`${id}-name`}
            kind="name"
            field={field}
            error={fieldState.error?.message}
          />
        )}
      />
      <Controller
        name="status"
        control={form.control}
        render={({ field, fieldState }) => (
          <MarketingFieldTemplate
            id={`${id}-status`}
            kind="status"
            field={field}
            error={fieldState.error?.message}
          />
        )}
      />
      {(!audience || audience.editableDefinition) && (
        <Controller
          name="definition.rules.0.value"
          control={form.control}
          render={({ field, fieldState }) => (
            <MarketingFieldTemplate
              id={`${id}-relationship`}
              kind="relationship"
              field={field}
              error={fieldState.error?.message}
            />
          )}
        />
      )}
    </Template>
  );
}
