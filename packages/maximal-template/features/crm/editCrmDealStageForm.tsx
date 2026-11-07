"use client";

import { formResultCopy } from "@/content/application";
import { Button } from "@/components/ui/button";
import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { crmControlCopy } from "@/content/crm";
import { updateCrmDealStage } from "@/lib/actions/crmActions";
import { CrmDealStage, updateCrmDealStageSchema } from "@/schemas/crmSchemas";
import type { CrmDealSummaryDTO } from "@/types/crmTypes";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useId, useState } from "react";
import { Controller, useForm, type FieldPath } from "react-hook-form";
import type { z } from "zod";

export function EditCrmDealStageForm({ deal }: { deal: CrmDealSummaryDTO }) {
  const router = useRouter();
  const id = useId();
  const [message, setMessage] = useState("");
  const form = useForm<
    z.input<typeof updateCrmDealStageSchema>,
    unknown,
    z.output<typeof updateCrmDealStageSchema>
  >({
    resolver: zodResolver(updateCrmDealStageSchema),
    defaultValues: {
      dealId: deal.id,
      expectedVersion: deal.version,
      stage: deal.stage,
    },
  });
  return (
    <form
      className="space-y-4"
      onSubmit={form.handleSubmit(async (values) => {
        setMessage("");
        try {
          const result = await updateCrmDealStage(values);
          if (!result.ok) {
            for (const [name, messages] of Object.entries(
              result.error.fieldErrors ?? {},
            ))
              form.setError(
                name as FieldPath<z.input<typeof updateCrmDealStageSchema>>,
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
        name="stage"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={id + "-stage"}>
              {crmControlCopy.opportunityStage}
            </FieldLabel>
            <NativeSelect
              {...field}
              value={String(field.value ?? "")}
              id={id + "-stage"}
              className="control-field"
              aria-invalid={fieldState.invalid}
            >
              {Object.values(CrmDealStage).map((stage) => (
                <NativeSelectOption key={stage}>{stage}</NativeSelectOption>
              ))}
            </NativeSelect>
            {fieldState.error && (
              <FieldError>{fieldState.error.message}</FieldError>
            )}
          </Field>
        )}
      />

      {form.formState.errors.root && (
        <FieldError>{form.formState.errors.root.message}</FieldError>
      )}
      <Button type="submit" disabled={form.formState.isSubmitting}>
        {crmControlCopy.moveOpportunity}
      </Button>
      <p role="status">{message}</p>
    </form>
  );
}
