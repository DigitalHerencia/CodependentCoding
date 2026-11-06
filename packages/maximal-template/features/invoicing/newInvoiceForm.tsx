"use client";

import {
  InvoicingFormButtonBlock as Button,
  InvoicingFormFieldBlock as Field,
  InvoicingFormFieldErrorBlock as FieldError,
  InvoicingFormFieldLabelBlock as FieldLabel,
  InvoicingFormInputBlock as Input,
} from "@/components/blocks/invoicing-form-blocks";
import {
  invoicingPresentationCopy,
  invoicingRemainingCopy,
} from "@/content/invoicing";
import { createInvoice, updateInvoice } from "@/lib/actions/invoicingActions";
import { createInvoiceSchema } from "@/schemas/invoicingSchemas";
import type { InvoiceDTO } from "@/types/invoicingTypes";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { FieldPath } from "react-hook-form";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import type { z } from "zod";

export function NewInvoiceForm({ invoice }: { invoice?: InvoiceDTO }) {
  const router = useRouter();
  const [error, setError] = useState("");
  const {
    setError: setFieldError,
    handleSubmit,
    control,
    formState: { isSubmitting },
  } = useForm<
    z.input<typeof createInvoiceSchema>,
    unknown,
    z.output<typeof createInvoiceSchema>
  >({
    resolver: zodResolver(createInvoiceSchema),
    defaultValues: {
      customerName: invoice?.customerName ?? "",
      customerEmail: invoice?.customerEmail ?? "",
      currency: invoice?.currency ?? "USD",
      issuedAt: invoice?.issuedAt?.slice(0, 10) ?? "",
      dueAt: invoice?.dueAt?.slice(0, 10) ?? "",
      lines: invoice?.lines.map((line) => ({
        description: line.description,
        quantity: line.quantity,
        unitPrice: line.unitPrice,
        taxRate: line.taxRate,
      })) ?? [{ description: "", quantity: "1", unitPrice: "0", taxRate: "0" }],
    },
  });
  const { fields, append, remove } = useFieldArray({ control, name: "lines" });
  const locked = Boolean(
    invoice && (invoice.status !== "DRAFT" || invoice.approvedAt),
  );
  return (
    <form
      className="mx-auto max-w-5xl space-y-5 surface-card p-5"
      onSubmit={handleSubmit(async (values) => {
        setError("");
        try {
          const input = {
            ...values,
            customerEmail: values.customerEmail || null,
            issuedAt: values.issuedAt || null,
            dueAt: values.dueAt || null,
          };
          const saved = invoice
            ? await updateInvoice({
                ...input,
                invoiceId: invoice.id,
                expectedVersion: invoice.version,
              })
            : await createInvoice(input);
          if (!saved.ok) {
            for (const [name, messages] of Object.entries(
              saved.error.fieldErrors ?? {},
            ))
              setFieldError(
                name as FieldPath<z.input<typeof createInvoiceSchema>>,
                { message: messages[0] ?? saved.error.message },
              );
            setError(saved.error.message);
            return;
          }
          router.push(`/invoices/${saved.data.id}`);
          router.refresh();
        } catch {
          setError(
            invoicingPresentationCopy.invoiceCouldNotBeSavedCheckLineAmountsPermissions,
          );
        }
      })}
      noValidate
    >
      <h1 className="type-title">
        {invoice
          ? invoicingRemainingCopy.editInvoice(invoice.number)
          : invoicingPresentationCopy.draftAnInvoice}
      </h1>
      <div className="grid gap-4 sm:grid-cols-2">
        {(
          [
            "customerName",
            "customerEmail",
            "currency",
            "issuedAt",
            "dueAt",
          ] as const
        ).map((field) => (
          <Controller
            key={field}
            name={field}
            control={control}
            render={({ field: controllerField, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={`invoice-${field}`}>
                  {
                    {
                      customerName: invoicingRemainingCopy.customerName,
                      customerEmail: invoicingRemainingCopy.customerEmail,
                      currency: invoicingRemainingCopy.currencyISOCode,
                      issuedAt: invoicingRemainingCopy.issueDate,
                      dueAt: invoicingRemainingCopy.dueDate,
                    }[field]
                  }
                </FieldLabel>
                <Input
                  id={`invoice-${field}`}
                  required={field === "customerName" || field === "currency"}
                  type={
                    field.endsWith("At")
                      ? "date"
                      : field === "customerEmail"
                        ? "email"
                        : "text"
                  }
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
      </div>
      <fieldset className="space-y-3">
        <legend className="type-label">
          {invoicingPresentationCopy.lineItems}
        </legend>
        {fields.map((field, index) => (
          <div
            key={field.id}
            className="grid gap-3 surface-inset p-4 sm:grid-cols-2 lg:grid-cols-5"
          >
            {(["description", "quantity", "unitPrice", "taxRate"] as const).map(
              (key) => (
                <Controller
                  key={key}
                  name={`lines.${index}.${key}`}
                  control={control}
                  render={({ field: controllerField, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor={`line-${index}-${key}`}>
                        {
                          {
                            description: invoicingRemainingCopy.description,
                            quantity: invoicingRemainingCopy.quantity,
                            unitPrice: invoicingRemainingCopy.unitPrice,
                            taxRate: invoicingRemainingCopy.taxRate01,
                          }[key]
                        }
                      </FieldLabel>
                      <Input
                        id={`line-${index}-${key}`}
                        required
                        inputMode={key === "description" ? "text" : "decimal"}
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
              ),
            )}
            <Button
              type="button"
              variant="outline"
              disabled={fields.length === 1}
              onClick={() => remove(index)}
            >
              {invoicingPresentationCopy.removeLine}
              {index + 1}
            </Button>
          </div>
        ))}
        <Button
          type="button"
          variant="outline"
          disabled={fields.length >= 500}
          onClick={() =>
            append({
              description: "",
              quantity: "1",
              unitPrice: "0",
              taxRate: "0",
            })
          }
        >
          {invoicingPresentationCopy.addLine}
        </Button>
      </fieldset>
      {locked && (
        <p role="alert">
          {invoicingPresentationCopy.onlyUnapprovedDraftInvoicesCanBeEdited}
        </p>
      )}
      {error && <p role="alert">{error}</p>}
      <Button disabled={isSubmitting || locked} type="submit">
        {isSubmitting
          ? invoicingPresentationCopy.saving
          : invoicingPresentationCopy.saveDraftInvoice}
      </Button>
    </form>
  );
}
