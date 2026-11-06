"use client";

import { InvoiceControlsTemplate } from "@/components/templates/invoicing-templates";
import { invoicingPresentationCopy } from "@/content/invoicing";
import { getInvoiceCommandsWorkflow } from "@/lib/workflows/invoicingClientWorkflows";
import type { InvoiceDTO } from "@/types/invoicingTypes";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

export function InvoiceFeatureClient({ invoice }: { invoice: InvoiceDTO }) {
  const { canUpdate, updateInvoice } = getInvoiceCommandsWorkflow(invoice);
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState("");
  if (!canUpdate) return null;
  return (
    <InvoiceControlsTemplate
      invoice={invoice}
      pending={pending}
      message={message}
      onApproveOrIssue={() =>
        startTransition(async () => {
          try {
            const command = {
              invoiceId: invoice.id,
              expectedVersion: invoice.version,
            };
            const result = await updateInvoice(command);
            if (!result.ok) {
              setMessage(result.error.message);
              return;
            }
            setMessage(invoicingPresentationCopy.invoiceUpdated);
            router.refresh();
          } catch {
            setMessage(
              invoicingPresentationCopy.invoiceCouldNotBeUpdatedCheckPermissionsAndReload,
            );
          }
        })
      }
    />
  );
}
