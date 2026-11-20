"use client";

import { useEffect, useId, useState } from "react";
import { useRouter } from "next/navigation";
import { Controller, useForm, type FieldPath } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { MarketingLifecycleTemplate } from "@/components/templates/marketing-templates";
import { updateCampaignStatusWorkflow } from "@/lib/workflows/marketingWorkflows";
import { campaignLifecycleEditorSchema } from "@/schemas/marketingSchemas";
import type { MarketingLifecycleFormProps, MarketingLifecycleValues, MarketingSubmissionState } from "@/types/marketingTypes";

/** Own the lifecycle form; commands remain independently authorized and version checked. */
export function EditCampaignStatusForm({ campaign, transitions }: MarketingLifecycleFormProps) {
  const router = useRouter();
  const id = useId();
  const [state, setState] = useState<MarketingSubmissionState>({ error: null, saved: false });
  const form = useForm<MarketingLifecycleValues>({ resolver: zodResolver(campaignLifecycleEditorSchema), defaultValues: { campaignId: campaign.id, expectedVersion: campaign.version, status: "" } });
  useEffect(() => {
    if (state.error) document.querySelector<HTMLElement>("[data-marketing-form-error]")?.focus();
  }, [state.error]);
  return <Controller name="status" control={form.control} render={({ field, fieldState }) => <MarketingLifecycleTemplate id={id} field={field} transitions={transitions} pending={form.formState.isSubmitting} error={fieldState.error?.message ?? state.error?.message} conflict={state.error?.code === "CONFLICT"} onReload={() => location.reload()} message={state.saved} onSubmit={form.handleSubmit(async (values) => {
    setState({ error: null, saved: false });
    try {
      const result = await updateCampaignStatusWorkflow(values);
      if (!result.ok) {
        for (const [name, messages] of Object.entries(result.error.fieldErrors ?? {})) if (name === "status") form.setError(name as FieldPath<MarketingLifecycleValues>, { message: messages[0] ?? result.error.message }, { shouldFocus: true });
        setState({ error: result.error, saved: false });
        return;
      }
      form.reset({ campaignId: result.data.id, expectedVersion: result.data.version, status: "" });
      setState({ error: null, saved: true });
      router.refresh();
    } catch {
      setState({ error: { code: "INTERNAL", message: "" }, saved: false });
    }
  })} />} />;
}

