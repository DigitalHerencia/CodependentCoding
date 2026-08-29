import {
  DataTableBlock,
  PageHeaderBlock,
  RecordDetailBlock,
} from "@/components/blocks/application-sections";
import { getPortalBilling } from "@/lib/fetchers/portalFetchers";

// Features orchestrate blocks and lib helpers; they never import raw UI primitives.
export async function BillingFeature() {
  const billing = await getPortalBilling();
  return (
    <div className="space-y-6">
      <PageHeaderBlock
        eyebrow="Client portal"
        title="Billing"
        description="Billing access is separately authorized from general portal access."
      />
      {billing.subscription ? (
        <RecordDetailBlock
          title={billing.subscription.planKey}
          status={billing.subscription.status}
          items={[
            {
              label: "Period end",
              value: billing.subscription.currentPeriodEnd
                ? new Date(
                    billing.subscription.currentPeriodEnd,
                  ).toLocaleDateString()
                : "Not set",
            },
            {
              label: "Cancels at period end",
              value: billing.subscription.cancelAtPeriodEnd ? "Yes" : "No",
            },
          ]}
        />
      ) : null}
      <DataTableBlock
        columns={[
          { key: "number", label: "Invoice" },
          { key: "customer", label: "Customer" },
          { key: "status", label: "Status" },
          { key: "total", label: "Total" },
          { key: "due", label: "Due" },
        ]}
        rows={billing.invoices.map((invoice) => ({
          id: invoice.id,
          href: `/invoices/${invoice.id}`,
          cells: {
            number: `#${invoice.number}`,
            customer: invoice.customerName,
            status: invoice.status,
            total: `${invoice.currency} ${invoice.total}`,
            due: invoice.dueAt
              ? new Date(invoice.dueAt).toLocaleDateString()
              : null,
          },
        }))}
        emptyMessage="No invoices are available for this organization."
      />
    </div>
  );
}
