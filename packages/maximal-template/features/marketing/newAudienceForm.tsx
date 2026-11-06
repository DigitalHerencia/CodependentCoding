"use client";

import {
  MarketingFormButtonBlock as Button,
  MarketingFormFieldBlock as Field,
  MarketingFormFieldErrorBlock as FieldError,
  MarketingFormFieldLabelBlock as FieldLabel,
  MarketingFormInputBlock as Input,
  MarketingFormNativeSelectBlock,
  MarketingFormNativeSelectOptionBlock,
} from "@/components/blocks/marketing-form-blocks";
import {
  marketingPresentationCopy,
  marketingRemainingCopy,
} from "@/content/marketing";
import { createAudience, updateAudience } from "@/lib/actions/marketingActions";
import { audienceFormSchema } from "@/schemas/marketingSchemas";
import type { AudienceDTO } from "@/types/marketingTypes";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { FieldPath } from "react-hook-form";
import { Controller, useForm } from "react-hook-form";
import type { z } from "zod";

export function NewAudienceForm({ audience }: { audience?: AudienceDTO }) {
  const router = useRouter();
  const [error, setError] = useState("");
  const existing = audience ? audienceFormSchema.safeParse(audience) : null;
  const unsupported = Boolean(existing && !existing.success);
  const {
    setError: setFieldError,
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<
    z.input<typeof audienceFormSchema>,
    unknown,
    z.output<typeof audienceFormSchema>
  >({
    resolver: zodResolver(audienceFormSchema),
    defaultValues: {
      name: audience?.name ?? "",
      status: audience?.status ?? "DRAFT",
      definition: existing?.success
        ? existing.data.definition
        : {
            operator: "and",
            rules: [{ field: "status", operator: "equals", value: "active" }],
          },
    },
  });
  return (
    <form
      className="mx-auto max-w-3xl space-y-5 surface-card p-5"
      onSubmit={handleSubmit(async (values) => {
        setError("");
        try {
          const input = values;
          const saved = audience
            ? await updateAudience({
                ...input,
                audienceId: audience.id,
                expectedUpdatedAt: audience.updatedAt,
              })
            : await createAudience(input);
          if (!saved.ok) {
            for (const [name, messages] of Object.entries(
              saved.error.fieldErrors ?? {},
            ))
              setFieldError(
                name as FieldPath<z.input<typeof audienceFormSchema>>,
                { message: messages[0] ?? saved.error.message },
              );
            setError(saved.error.message);
            return;
          }
          router.push(`/marketing/audiences/${saved.data.id}`);
          router.refresh();
        } catch {
          setError(
            marketingPresentationCopy.audienceCouldNotBeSavedCheckPermissionsOrReload,
          );
        }
      })}
      noValidate
    >
      <h1 className="type-title">
        {audience
          ? marketingPresentationCopy.editAudience
          : marketingPresentationCopy.defineAnAudience}
      </h1>
      <Controller
        name={"name"}
        control={control}
        render={({ field: controllerField, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor="audience-name">
              {marketingRemainingCopy.audienceName}
            </FieldLabel>
            <Input
              id="audience-name"
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
      <fieldset className="space-y-3 surface-inset p-5">
        <legend>{marketingPresentationCopy.includeContactsMatching}</legend>
        <Controller
          name="definition.rules.0.value"
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="audience-rule">
                {marketingRemainingCopy.contactRelationshipEquals}
              </FieldLabel>
              <MarketingFormNativeSelectBlock
                {...field}
                id="audience-rule"
                className="control-field"
                aria-invalid={fieldState.invalid}
              >
                <MarketingFormNativeSelectOptionBlock value="active">
                  {marketingRemainingCopy.active}
                </MarketingFormNativeSelectOptionBlock>
                <MarketingFormNativeSelectOptionBlock value="lead">
                  {marketingRemainingCopy.lead}
                </MarketingFormNativeSelectOptionBlock>
                <MarketingFormNativeSelectOptionBlock value="inactive">
                  {marketingRemainingCopy.inactive}
                </MarketingFormNativeSelectOptionBlock>
              </MarketingFormNativeSelectBlock>
              {fieldState.error && (
                <FieldError>{fieldState.error.message}</FieldError>
              )}
            </Field>
          )}
        />
      </fieldset>
      <Controller
        name={"status"}
        control={control}
        render={({ field: controllerField, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor="audience-status">
              {marketingRemainingCopy.audienceStatus}
            </FieldLabel>
            <MarketingFormNativeSelectBlock
              id="audience-status"
              className="control-field"
              {...controllerField}
              value={String(controllerField.value ?? "")}
              aria-invalid={fieldState.invalid}
            >
              <MarketingFormNativeSelectOptionBlock>
                {marketingRemainingCopy.dRAFT}
              </MarketingFormNativeSelectOptionBlock>
              <MarketingFormNativeSelectOptionBlock>
                {marketingRemainingCopy.aCTIVE}
              </MarketingFormNativeSelectOptionBlock>
              <MarketingFormNativeSelectOptionBlock>
                {marketingRemainingCopy.aRCHIVED}
              </MarketingFormNativeSelectOptionBlock>
            </MarketingFormNativeSelectBlock>
            {fieldState.error && (
              <FieldError>{fieldState.error.message}</FieldError>
            )}
          </Field>
        )}
      />
      {unsupported && (
        <p role="alert">
          {
            marketingPresentationCopy.thisAudienceUsesRulesThisEditorDoesNotSupport
          }
        </p>
      )}
      {error && <p role="alert">{error}</p>}
      <Button type="submit" disabled={isSubmitting || unsupported}>
        {isSubmitting
          ? marketingPresentationCopy.saving
          : marketingPresentationCopy.saveAudience}
      </Button>
    </form>
  );
}
