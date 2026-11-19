"use client";

import {
  InvoicingEditExpenseTemplate,
  InvoicingFieldTemplate,
  InvoicingNewExpenseTemplate,
} from "@/components/templates/invoicing-templates";
import {
  createExpenseWorkflow,
  updateExpenseWorkflow,
} from "@/lib/workflows/invoicingWorkflows";
import { expenseFormSchema } from "@/schemas/invoicingSchemas";
import type { ExpenseDTO } from "@/types/invoicingTypes";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import type { FieldPath } from "react-hook-form";
import type { z } from "zod";

/** Expense RHF owner shared by create and edit, with calendar-day transport. */
export function InvoicingExpenseForm({ expense }: { expense?: ExpenseDTO }) {
  const router = useRouter();
  const form = useForm<
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
      incurredAt: expense?.incurredAt ?? "",
    },
  });
  const Template = expense
    ? InvoicingEditExpenseTemplate
    : InvoicingNewExpenseTemplate;
  return (
    <Template
      pending={form.formState.isSubmitting}
      error={form.formState.errors.root?.message}
      locked={Boolean(
        expense && !["DRAFT", "SUBMITTED"].includes(expense.status),
      )}
      fields={(
        ["vendor", "description", "amount", "currency", "incurredAt"] as const
      ).map((name) => (
        <Controller
          key={name}
          name={name}
          control={form.control}
          render={({ field, fieldState }) => (
            <InvoicingFieldTemplate
              name={name}
              binding={field}
              invalid={fieldState.invalid}
              error={fieldState.error?.message}
            />
          )}
        />
      ))}
      onSubmit={form.handleSubmit(async (values) => {
        form.clearErrors("root");
        try {
          const result = expense
            ? await updateExpenseWorkflow({
                ...values,
                expenseId: expense.id,
                expectedUpdatedAt: expense.updatedAt,
              })
            : await createExpenseWorkflow(values);
          if (!result.ok) {
            for (const [name, messages] of Object.entries(
              result.error.fieldErrors ?? {},
            ))
              form.setError(
                name as FieldPath<z.input<typeof expenseFormSchema>>,
                { message: messages[0] ?? result.error.message },
              );
            form.setError("root", { message: result.error.message });
            return;
          }
          router.push(`/expenses/${result.data.id}`);
          router.refresh();
        } catch {
          form.setError("root", { message: "error" });
        }
      })}
    />
  );
}
/** New expense form preserves existing submission capability. */
export function InvoicingNewExpenseForm() {
  return <InvoicingExpenseForm />;
}
