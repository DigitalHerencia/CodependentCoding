"use client";

import {
  MarketingFormButtonBlock as Button,
  MarketingFormFieldBlock as Field,
  MarketingFormFieldErrorBlock as FieldError,
  MarketingFormFieldLabelBlock as FieldLabel,
  MarketingFormNativeSelectBlock,
  MarketingFormNativeSelectOptionBlock,
} from "@/components/blocks/marketing-form-blocks";
import { formResultCopy } from "@/content/application";
import { marketingControlCopy } from "@/content/marketing";
import { updateCampaignStatus } from "@/lib/actions/marketingActions";
import {
  CampaignStatus,
  updateCampaignStatusSchema,
} from "@/schemas/marketingSchemas";
import type { CampaignDTO } from "@/types/marketingTypes";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useId, useState } from "react";
import { Controller, useForm, type FieldPath } from "react-hook-form";
import type { z } from "zod";

export function EditCampaignStatusForm({
  campaign,
}: {
  campaign: CampaignDTO;
}) {
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
            <MarketingFormNativeSelectBlock
              {...field}
              value={String(field.value ?? "")}
              id={id + "-status"}
              className="control-field"
              aria-invalid={fieldState.invalid}
            >
              {Object.values(CampaignStatus).map((status) => (
                <MarketingFormNativeSelectOptionBlock key={status}>
                  {status}
                </MarketingFormNativeSelectOptionBlock>
              ))}
            </MarketingFormNativeSelectBlock>
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
