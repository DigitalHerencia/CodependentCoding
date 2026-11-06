"use client";

import {
  MarketingFormButtonBlock as Button,
  MarketingFormFieldBlock as Field,
  MarketingFormFieldErrorBlock as FieldError,
  MarketingFormFieldLabelBlock as FieldLabel,
  MarketingFormInputBlock as Input,
  MarketingFormNativeSelectBlock,
  MarketingFormNativeSelectOptionBlock,
  MarketingFormTextareaBlock,
} from "@/components/blocks/marketing-form-blocks";
import {
  marketingPresentationCopy,
  marketingRemainingCopy,
} from "@/content/marketing";
import { createCampaign, updateCampaign } from "@/lib/actions/marketingActions";
import { createCampaignSchema } from "@/schemas/marketingSchemas";
import type { AudienceDTO, CampaignDTO } from "@/types/marketingTypes";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { FieldPath } from "react-hook-form";
import { Controller, useForm } from "react-hook-form";
import type { z } from "zod";

export function NewCampaignForm({
  campaign,
  audiences,
}: {
  campaign?: CampaignDTO;
  audiences: AudienceDTO[];
}) {
  const router = useRouter();
  const [error, setError] = useState("");
  const {
    setError: setFieldError,
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<
    z.input<typeof createCampaignSchema>,
    unknown,
    z.output<typeof createCampaignSchema>
  >({
    resolver: zodResolver(createCampaignSchema),
    defaultValues: {
      name: campaign?.name ?? "",
      description: campaign?.description ?? "",
      audienceId: campaign?.audience?.id ?? "",
      scheduledAt: campaign?.scheduledAt?.slice(0, 16) ?? "",
    },
  });
  return (
    <form
      className="mx-auto max-w-3xl space-y-5 surface-card p-5"
      onSubmit={handleSubmit(async (values) => {
        setError("");
        try {
          const input = {
            ...values,
            audienceId: values.audienceId || null,
            scheduledAt: values.scheduledAt ?? null,
          };
          const saved = campaign
            ? await updateCampaign({
                ...input,
                campaignId: campaign.id,
                expectedVersion: campaign.version,
              })
            : await createCampaign(input);
          if (!saved.ok) {
            for (const [name, messages] of Object.entries(
              saved.error.fieldErrors ?? {},
            ))
              setFieldError(
                name as FieldPath<z.input<typeof createCampaignSchema>>,
                { message: messages[0] ?? saved.error.message },
              );
            setError(saved.error.message);
            return;
          }
          router.push(`/marketing/campaigns/${saved.data.id}`);
          router.refresh();
        } catch {
          setError(
            marketingPresentationCopy.campaignCouldNotBeSavedCheckAccessAudienceOr,
          );
        }
      })}
      noValidate
    >
      <h1 className="type-title">
        {campaign
          ? marketingPresentationCopy.editCampaign
          : marketingPresentationCopy.planACampaign}
      </h1>
      <Controller
        name={"name"}
        control={control}
        render={({ field: controllerField, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor="campaign-name">
              {marketingRemainingCopy.campaignName}
            </FieldLabel>
            <Input
              id="campaign-name"
              required
              {...controllerField}
              value={String(controllerField.value ?? "")}
              aria-invalid={fieldState.invalid}
            />
            {fieldState.error && (
              <FieldError>{fieldState.error.message}</FieldError>
            )}
          </Field>
        )}
      />
      <Controller
        name={"description"}
        control={control}
        render={({ field: controllerField, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor="campaign-brief">
              {marketingRemainingCopy.campaignBrief}
            </FieldLabel>
            <MarketingFormTextareaBlock
              id="campaign-brief"
              className="control-field min-h-40"
              {...controllerField}
              value={String(controllerField.value ?? "")}
              aria-invalid={fieldState.invalid}
            />
            {fieldState.error && (
              <FieldError>{fieldState.error.message}</FieldError>
            )}
          </Field>
        )}
      />
      <Controller
        name={"audienceId"}
        control={control}
        render={({ field: controllerField, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor="campaign-audience">
              {marketingRemainingCopy.targetAudience}
            </FieldLabel>
            <MarketingFormNativeSelectBlock
              id="campaign-audience"
              className="control-field"
              {...controllerField}
              value={String(controllerField.value ?? "")}
              aria-invalid={fieldState.invalid}
            >
              <MarketingFormNativeSelectOptionBlock value="">
                {marketingRemainingCopy.noAudienceSelected}
              </MarketingFormNativeSelectOptionBlock>
              {audiences.map((audience) => (
                <MarketingFormNativeSelectOptionBlock
                  key={audience.id}
                  value={audience.id}
                >
                  {audience.name}
                </MarketingFormNativeSelectOptionBlock>
              ))}
            </MarketingFormNativeSelectBlock>
            {fieldState.error && (
              <FieldError>{fieldState.error.message}</FieldError>
            )}
          </Field>
        )}
      />
      <Controller
        name={"scheduledAt"}
        control={control}
        render={({ field: controllerField, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor="campaign-date">
              {marketingRemainingCopy.plannedStartUTC}
            </FieldLabel>
            <Input
              id="campaign-date"
              type="datetime-local"
              {...controllerField}
              value={String(controllerField.value ?? "")}
              aria-invalid={fieldState.invalid}
            />
            {fieldState.error && (
              <FieldError>{fieldState.error.message}</FieldError>
            )}
          </Field>
        )}
      />
      {error && <p role="alert">{error}</p>}
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting
          ? marketingPresentationCopy.saving
          : marketingPresentationCopy.saveCampaign}
      </Button>
    </form>
  );
}
