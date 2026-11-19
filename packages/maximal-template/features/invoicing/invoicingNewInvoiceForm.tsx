"use client";

import {
  InvoicingEditInvoiceTemplate,
  InvoicingFieldTemplate,
  InvoicingLineTemplate,
  InvoicingNewInvoiceTemplate,
  InvoicingPreviewTemplate,
} from "@/components/templates/invoicing-templates";
import {
  createInvoiceWorkflow,
  updateInvoiceWorkflow,
} from "@/lib/workflows/invoicingWorkflows";
import { calculateInvoiceTotals } from "@/lib/utils/invoicingMoney";
import { createInvoiceSchema } from "@/schemas/invoicingSchemas";
import type { InvoiceDTO } from "@/types/invoicingTypes";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Controller, useFieldArray, useForm, useWatch } from "react-hook-form";
import type { FieldPath } from "react-hook-form";
import type { z } from "zod";

/** Shared RHF implementation for new and edit; never owns presentation markup. */
export function InvoicingInvoiceForm({ invoice }: { invoice?: InvoiceDTO }) {
  const router = useRouter();
  const form = useForm<
    z.input<typeof createInvoiceSchema>,
    unknown,
    z.output<typeof createInvoiceSchema>
  >({
    resolver: zodResolver(createInvoiceSchema),
    defaultValues: {
      customerName: invoice?.customerName ?? "",
      customerEmail: invoice?.customerEmail ?? "",
      currency: invoice?.currency ?? "USD",
      issuedAt: invoice?.issuedAt ?? "",
      dueAt: invoice?.dueAt ?? "",
      lines: invoice?.lines.map((line) => ({
        description: line.description,
        quantity: line.quantity,
        unitPrice: line.unitPrice,
        taxRate: line.taxRate,
      })) ?? [{ description: "", quantity: "1", unitPrice: "0", taxRate: "0" }],
    },
  });
  const array = useFieldArray({ control: form.control, name: "lines" });
  const lines = useWatch({ control: form.control, name: "lines" });
  const currency = useWatch({ control: form.control, name: "currency" });
  let totals: ReturnType<typeof calculateInvoiceTotals> | null = null;
  try {
    totals = calculateInvoiceTotals(
      lines.map((line) => ({
        quantity: line.quantity,
        unitPrice: line.unitPrice,
        taxRate: line.taxRate ?? "0",
      })),
    );
  } catch {
    /* Invalid partial input has no derived preview. */
  }
  const Template = invoice
    ? InvoicingEditInvoiceTemplate
    : InvoicingNewInvoiceTemplate;
  return (
    <Template
      pending={form.formState.isSubmitting}
      locked={Boolean(
        invoice && (invoice.status !== "DRAFT" || invoice.approvedAt),
      )}
      error={
        form.formState.errors.root?.message ||
        form.formState.errors.lines?.root?.message ||
        form.formState.errors.lines?.message
      }
      fields={(
        [
          "customerName",
          "customerEmail",
          "currency",
          "issuedAt",
          "dueAt",
        ] as const
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
      lines={array.fields.map((line, index) => (
        <InvoicingLineTemplate
          key={line.id}
          index={index}
          disabled={array.fields.length <= 1}
          onRemove={() => array.remove(index)}
        >
          {(["description", "quantity", "unitPrice", "taxRate"] as const).map(
            (name) => (
              <Controller
                key={name}
                name={`lines.${index}.${name}`}
                control={form.control}
                render={({ field, fieldState }) => (
                  <InvoicingFieldTemplate
                    name={name}
                    index={index}
                    binding={field}
                    invalid={fieldState.invalid}
                    error={fieldState.error?.message}
                  />
                )}
              />
            ),
          )}
        </InvoicingLineTemplate>
      ))}
      onAddLine={() => {
        if (array.fields.length < 500)
          array.append({
            description: "",
            quantity: "1",
            unitPrice: "0",
            taxRate: "0",
          });
      }}
      preview={
        <InvoicingPreviewTemplate totals={totals} currency={currency ?? ""} />
      }
      onSubmit={form.handleSubmit(async (values) => {
        form.clearErrors("root");
        try {
          const result = invoice
            ? await updateInvoiceWorkflow({
                ...values,
                invoiceId: invoice.id,
                expectedVersion: invoice.version,
              })
            : await createInvoiceWorkflow(values);
          if (!result.ok) {
            for (const [name, messages] of Object.entries(
              result.error.fieldErrors ?? {},
            ))
              form.setError(
                name as FieldPath<z.input<typeof createInvoiceSchema>>,
                { message: messages[0] ?? result.error.message },
              );
            form.setError("root", { message: result.error.message });
            return;
          }
          router.push(`/invoices/${result.data.id}`);
          router.refresh();
        } catch {
          form.setError("root", { message: "error" });
        }
      })}
    />
  );
}

/** New invoice form uses the canonical schema, field array and exact totals. */
export function InvoicingNewInvoiceForm() {
  return <InvoicingInvoiceForm />;
}
