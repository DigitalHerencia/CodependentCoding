"use client";
import { invoicingRemainingCopy } from "@/content/invoicing";

import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";
import type { FieldPath } from "react-hook-form";
import { expenseFormSchema } from "@/schema/invoicingSchemas";

import { invoicingPresentationCopy } from "@/content/invoicing";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { createExpense, updateExpense } from "@/lib/actions/invoicingActions";
import type { ExpenseDTO } from "@/types/invoicingTypes";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";
export function ExpenseNewForm({ expense }: { expense?: ExpenseDTO }) {
  const router = useRouter();
  const [error, setError] = useState("");
  const {
    setError: setFieldError,
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<
    z.input<typeof expenseFormSchema>,
    unknown,
    z.output<typeof expenseFormSchema>
  >({
    resolver: zodResolver(expenseFormSchema),
    defaultValues: {
      vendor: expense?.vendor ?? "",
      description: expense?.description ?? "",
      amount: expense?.amount ?? "",
      currency: expense?.currency ?? "USD",
      incurredAt: expense?.incurredAt.slice(0, 10) ?? "",
    },
  });
  return (
    <form
      className="mx-auto max-w-3xl space-y-5 surface-card p-5"
      onSubmit={handleSubmit(async (values) => {
        setError("");
        try {
          const saved = expense
            ? await updateExpense({
                ...values,
                expenseId: expense.id,
                expectedUpdatedAt: expense.updatedAt,
              })
            : await createExpense(values);
          if (!saved.ok) {
            for (const [name, messages] of Object.entries(
              saved.error.fieldErrors ?? {},
            ))
              setFieldError(
                name as FieldPath<z.input<typeof expenseFormSchema>>,
                { message: messages[0] ?? saved.error.message },
              );
            setError(saved.error.message);
            return;
          }
          router.push(`/expenses/${saved.data.id}`);
          router.refresh();
        } catch {
          setError(
            invoicingPresentationCopy.expenseCouldNotBeSavedCheckFieldsAccessOr,
          );
        }
      })}
      noValidate
    >
      <h1 className="type-title">
        {expense
          ? invoicingPresentationCopy.editExpense
          : invoicingPresentationCopy.submitExpense}
      </h1>
      {(
        ["vendor", "description", "amount", "currency", "incurredAt"] as const
      ).map((field) => (
        <Controller
          key={field}
          name={field}
          control={control}
          render={({ field: controllerField, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={`expense-${field}`}>
                {
                  {
                    vendor: invoicingRemainingCopy.vendor,
                    description: invoicingRemainingCopy.businessPurpose,
                    amount: invoicingRemainingCopy.amount,
                    currency: invoicingRemainingCopy.currencyISOCode,
                    incurredAt: invoicingRemainingCopy.expenseDate,
                  }[field]
                }
              </FieldLabel>
              <Input
                id={`expense-${field}`}
                required={field !== "description"}
                type={field === "incurredAt" ? "date" : "text"}
                inputMode={field === "amount" ? "decimal" : "text"}
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
      ))}
      {error && <p role="alert">{error}</p>}
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting
          ? invoicingPresentationCopy.saving
          : invoicingPresentationCopy.saveExpense}
      </Button>
    </form>
  );
}
