"use client";
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
            if (invoice.approvedAt) await issueApprovedInvoice(command);
            else await approveInvoice(command);
            setMessage("Invoice updated.");
            router.refresh();
          } catch {
            setMessage(
              "Invoice could not be updated. Check permissions and reload the current version.",
            );
          }
        })
      }
    />
  );
}
