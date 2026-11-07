"use client";

import { formResultCopy } from "@/content/application";
import { Button } from "@/components/ui/button";
import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { crmControlCopy } from "@/content/crm";
import { createCrmDeal } from "@/lib/actions/crmActions";
import { createCrmDealSchema } from "@/schemas/crmSchemas";
import type { CrmAccountDTO } from "@/types/crmTypes";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useId, useState } from "react";
import { Controller, useForm, type FieldPath } from "react-hook-form";
import type { z } from "zod";

export function NewCrmOpportunityForm({
  accounts,
}: {
  accounts: CrmAccountDTO[];
}) {
  const router = useRouter();
  const id = useId();
  const [message, setMessage] = useState("");
  const form = useForm<
    z.input<typeof createCrmDealSchema>,
    unknown,
    z.output<typeof createCrmDealSchema>
  >({
    resolver: zodResolver(createCrmDealSchema),
    defaultValues: {
      name: "",
      accountId: "",
      value: "0",
      currency: "USD",
      probability: 0,
      expectedCloseDate: "",
    },
  });
  return (
    <details className="surface-card p-4">
      <summary>{crmControlCopy.createOpportunity}</summary>
      <form
        className="space-y-4"
        onSubmit={form.handleSubmit(async (values) => {
          setMessage("");
          try {
            const result = await createCrmDeal(values);
            if (!result.ok) {
              for (const [name, messages] of Object.entries(
                result.error.fieldErrors ?? {},
              ))
                form.setError(
                  name as FieldPath<z.input<typeof createCrmDealSchema>>,
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
        <h2 className="type-title">{crmControlCopy.createOpportunity}</h2>
        <Controller
          name="name"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={id + "-name"}>
                {crmControlCopy.opportunityName}
              </FieldLabel>
              <Input
                {...field}
                value={String(field.value ?? "")}
                id={id + "-name"}
                type="text"
                aria-invalid={fieldState.invalid}
              />
              {fieldState.error && (
                <FieldError>{fieldState.error.message}</FieldError>
              )}
            </Field>
          )}
        />
        <Controller
          name="accountId"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={id + "-accountId"}>
                {crmControlCopy.account}
              </FieldLabel>
              <NativeSelect
                {...field}
                value={String(field.value ?? "")}
                id={id + "-accountId"}
                className="control-field"
                aria-invalid={fieldState.invalid}
              >
                <NativeSelectOption value="">
                  {crmControlCopy.chooseAccount}
                </NativeSelectOption>
                {accounts.map((account) => (
                  <NativeSelectOption key={account.id} value={account.id}>
                    {account.name}
                  </NativeSelectOption>
                ))}
              </NativeSelect>
              {fieldState.error && (
                <FieldError>{fieldState.error.message}</FieldError>
              )}
            </Field>
          )}
        />
        <Controller
          name="value"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={id + "-value"}>
                {crmControlCopy.opportunityValue}
              </FieldLabel>
              <Input
                {...field}
                value={String(field.value ?? "")}
                id={id + "-value"}
                type="text"
                aria-invalid={fieldState.invalid}
                inputMode="decimal"
              />
              {fieldState.error && (
                <FieldError>{fieldState.error.message}</FieldError>
              )}
            </Field>
          )}
        />
        <Controller
          name="currency"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={id + "-currency"}>
                {crmControlCopy.currency}
              </FieldLabel>
              <Input
                {...field}
                value={String(field.value ?? "")}
                id={id + "-currency"}
                type="text"
                aria-invalid={fieldState.invalid}
              />
              {fieldState.error && (
                <FieldError>{fieldState.error.message}</FieldError>
              )}
            </Field>
          )}
        />
        <Controller
          name="probability"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={id + "-probability"}>
                {crmControlCopy.probability}
              </FieldLabel>
              <Input
                {...field}
                value={String(field.value ?? "")}
                id={id + "-probability"}
                type="number"
                aria-invalid={fieldState.invalid}
                min={0}
                max={100}
                onChange={(event) => field.onChange(Number(event.target.value))}
              />
              {fieldState.error && (
                <FieldError>{fieldState.error.message}</FieldError>
              )}
            </Field>
          )}
        />
        <Controller
          name="expectedCloseDate"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={id + "-expectedCloseDate"}>
                {crmControlCopy.expectedClose}
              </FieldLabel>
              <Input
                {...field}
                value={String(field.value ?? "")}
                id={id + "-expectedCloseDate"}
                type="date"
                aria-invalid={fieldState.invalid}
              />
              {fieldState.error && (
                <FieldError>{fieldState.error.message}</FieldError>
              )}
            </Field>
          )}
        />

        {form.formState.errors.root && (
          <FieldError>{form.formState.errors.root.message}</FieldError>
        )}
        <Button
          type="submit"
          disabled={form.formState.isSubmitting || !accounts.length}
        >
          {crmControlCopy.createOpportunity}
        </Button>
        <p role="status">{message}</p>
      </form>
    </details>
  );
}
