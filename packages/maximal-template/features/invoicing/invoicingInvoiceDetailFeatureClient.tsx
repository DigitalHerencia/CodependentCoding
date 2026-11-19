"use client";
import { InvoicingCommandsTemplate } from "@/components/templates/invoicing-templates";
import {
  approveInvoiceWorkflow,
  issueApprovedInvoiceWorkflow,
} from "@/lib/workflows/invoicingWorkflows";
import type { InvoiceDTO } from "@/types/invoicingTypes";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
/** Browser command state; each action independently rechecks authority and concurrency. */
export function InvoicingInvoiceDetailFeatureClient({
  invoice,
  canUpdate,
}: {
  invoice: InvoiceDTO;
  canUpdate: boolean;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState("");
  if (!canUpdate) return null;
  return (
    <InvoicingCommandsTemplate
      canApprove={invoice.status === "DRAFT" && !invoice.approvedAt}
      canIssue={invoice.status === "DRAFT" && Boolean(invoice.approvedAt)}
      pending={pending}
      message={message}
      onCommand={(command) =>
        startTransition(async () => {
          setMessage("");
          try {
            const input = {
              invoiceId: invoice.id,
              expectedVersion: invoice.version,
            };
            const result =
              command === "approve"
                ? await approveInvoiceWorkflow(input)
                : await issueApprovedInvoiceWorkflow(input);
            setMessage(result.ok ? "updated" : result.error.message);
            if (result.ok) router.refresh();
          } catch {
            setMessage("error");
          }
        })
      }
    />
  );
}
