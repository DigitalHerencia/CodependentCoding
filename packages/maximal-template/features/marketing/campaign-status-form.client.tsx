"use client";

import { useState, useId } from "react";
import { useRouter } from "next/navigation";
import { Controller, useForm, type FieldPath } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";
import { Button } from "@/components/ui/button";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import { formResultCopy } from "@/content/application";
import { marketingControlCopy } from "@/content/marketing";
import { updateCampaignStatus } from "@/lib/actions/marketingActions";
import {
  updateCampaignStatusSchema,
  CampaignStatus,
} from "@/schemas/marketingSchemas";
import type { CampaignDTO } from "@/types/marketingTypes";
export function CampaignFeatureClient({ campaign }: { campaign: CampaignDTO }) {
  const router = useRouter();
  const id = useId();
  const [message, setMessage] = useState("");
  const form = useForm<
    z.input<typeof updateCampaignStatusSchema>,
    unknown,
    z.output<typeof updateCampaignStatusSchema>
  >({
    resolver: zodResolver(updateCampaignStatusSchema),
    defaultValues: {
      campaignId: campaign.id,
      expectedVersion: campaign.version,
      status: campaign.status,
    },
  });
  return (
    <form
      className="space-y-4"
      onSubmit={form.handleSubmit(async (values) => {
        setMessage("");
        try {
          const result = await updateCampaignStatus(values);
          if (!result.ok) {
            for (const [name, messages] of Object.entries(
              result.error.fieldErrors ?? {},
            ))
              form.setError(
                name as FieldPath<z.input<typeof updateCampaignStatusSchema>>,
                { message: messages[0] ?? result.error.message },
              );
            form.setError("root", { message: result.error.message });
            return;
          }
          setMessage(formResultCopy.saved);
          router.refresh();
        } catch {
          form.setError("root", { message: formResultCopy.failed });
        }
      })}
      noValidate
    >
      <Controller
        name="status"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={id + "-status"}>
              {marketingControlCopy.campaignLifecycle}
            </FieldLabel>
            <select
              {...field}
              value={String(field.value ?? "")}
              id={id + "-status"}
              className="control-field"
              aria-invalid={fieldState.invalid}
            >
              {Object.values(CampaignStatus).map((status) => (
                <option key={status}>{status}</option>
              ))}
            </select>
            {fieldState.error && (
              <FieldError>{fieldState.error.message}</FieldError>
            )}
          </Field>
        )}
      />
      <p>{marketingControlCopy.thisUpdatesCampaignPlanningStateItDoesNot}</p>
      {form.formState.errors.root && (
        <FieldError>{form.formState.errors.root.message}</FieldError>
      )}
      <Button type="submit" disabled={form.formState.isSubmitting}>
        {marketingControlCopy.saveLifecycle}
      </Button>
      <p role="status">{message}</p>
    </form>
  );
}
