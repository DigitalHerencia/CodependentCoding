"use client";
import { invoicingPresentationCopy } from "@/content/invoicing";
import { InvoiceControlsBlock } from "@/components/blocks/invoicing-blocks";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  approveInvoice,
  issueApprovedInvoice,
} from "@/lib/actions/invoicingActions";
import type { InvoiceDTO } from "@/types/invoicingTypes";
export function InvoiceFeatureClient({ invoice }: { invoice: InvoiceDTO }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState("");
  if (invoice.status !== "DRAFT") return null;
  return (
    <InvoiceControlsBlock
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
            if (invoice.approvedAt) {
              const result = await issueApprovedInvoice(command);
              if (!result.ok) {
                setMessage(result.error.message);
                return;
              }
            } else {
              const result = await approveInvoice(command);
              if (!result.ok) {
                setMessage(result.error.message);
                return;
              }
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
