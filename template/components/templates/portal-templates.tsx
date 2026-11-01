// Why: Templates: pure presentation for the portal pages, laid out from DTOs; data and slots come from features.
import type { PortalBillingDTO, PortalDocumentDTO } from "@/types/portalTypes";
import {
  DashboardLayout,
  DashboardPanel,
  DashboardTable,
} from "@/components/blocks/dashboard-layout";
import Link from "next/link";
import type { ReactNode } from "react";

export function PortalBillingTemplate({
  billing,
}: {
  billing: PortalBillingDTO;
}) {
  return (
    <DashboardLayout title="Billing overview" nav={[]}>
      <DashboardPanel title="Subscription">
        {billing.subscription ? (
          <dl className="grid gap-3 sm:grid-cols-2">
            <dt>Plan</dt>
            <dd>{billing.subscription.planKey}</dd>
            <dt>Status</dt>
            <dd>{billing.subscription.status}</dd>
            <dt>Current period ends</dt>
            <dd>
              {billing.subscription.currentPeriodEnd?.slice(0, 10) ??
                "Not recorded"}
            </dd>
            <dt>Renewal</dt>
            <dd>
              {billing.subscription.cancelAtPeriodEnd
                ? "Cancels at period end"
                : "Continues"}
            </dd>
          </dl>
        ) : (
          <p>No subscription is recorded for this workspace.</p>
        )}
      </DashboardPanel>
      <DashboardPanel title="Recent invoices">
        <DashboardTable
          columns={[
            { key: "number", label: "Invoice" },
            { key: "customer", label: "Customer" },
            { key: "amount", label: "Amount" },
            { key: "status", label: "Status" },
            { key: "due", label: "Due" },
          ]}
          rows={billing.invoices.map((invoice) => ({
            id: invoice.id,
            cells: {
              number: `#${invoice.number}`,
              customer: invoice.customerName,
              amount: `${invoice.total} ${invoice.currency}`,
              status: invoice.status,
              due: invoice.dueAt?.slice(0, 10),
            },
          }))}
        />
      </DashboardPanel>
    </DashboardLayout>
  );
}

export function PortalDocumentDetailTemplate({
  document,
  children,
}: {
  document: PortalDocumentDTO;
  children: ReactNode;
}) {
  return (
    <DashboardLayout title={document.title} nav={[]}>
      <Link className="type-link" href="/portal/documents">
        Document vault
      </Link>
      <div className="grid gap-4 lg:grid-cols-[2fr_1fr]">
        <DashboardPanel title="Document">
          <p className="whitespace-pre-wrap">
            {document.description ?? "No description."}
          </p>
          {document.latestVersion ? (
            <dl className="mt-6 space-y-2">
              <dt>Current file</dt>
              <dd>{document.latestVersion.filename}</dd>
              <dt>Format</dt>
              <dd>{document.latestVersion.contentType}</dd>
              <dt>Size</dt>
              <dd>{document.latestVersion.byteSize} bytes</dd>
              <dt>Added</dt>
              <dd>{document.latestVersion.createdAt.slice(0, 10)}</dd>
            </dl>
          ) : (
            <p className="mt-5">
              This document does not have a file version yet.
            </p>
          )}
        </DashboardPanel>
        <DashboardPanel title="Version and review">
          <p>Version {document.currentVersionNumber}</p>
          <p>Status: {document.status}</p>
          <p>Client visible: {document.clientVisible ? "Yes" : "No"}</p>
          {children}
        </DashboardPanel>
      </div>
    </DashboardLayout>
  );
}

export function PortalDocumentsTemplate({
  documents,
  toolbar,
  children,
}: {
  documents: PortalDocumentDTO[];
  toolbar: ReactNode;
  children?: ReactNode;
}) {
  return (
    <DashboardLayout title="Document vault" nav={[]} toolbar={toolbar}>
      {children}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {documents.map((document) => (
          <article key={document.id} className="space-y-3 surface-card p-5">
            <p className="type-caption">
              {document.latestVersion?.contentType ?? "Document folder"}
            </p>
            <Link
              className="type-title hover:underline"
              href={`/portal/documents/${document.id}`}
            >
              {document.title}
            </Link>
            <p className="line-clamp-3 text-muted-primary">
              {document.description}
            </p>
            <p>
              Version {document.currentVersionNumber} · {document.status}
            </p>
            <p className="text-sm">
              {document.latestVersion?.filename ?? "No file version yet"}
            </p>
          </article>
        ))}
      </div>
      {!documents.length && <p>No matching documents.</p>}
    </DashboardLayout>
  );
}

export function PortalHomeTemplate({
  documents,
}: {
  documents: PortalDocumentDTO[];
}) {
  return (
    <DashboardLayout title="Client workspace" nav={[]}>
      <div className="grid gap-5 lg:grid-cols-[2fr_1fr]">
        <DashboardPanel title="Recent documents">
          <ul className="space-y-4">
            {documents.slice(0, 8).map((document) => (
              <li
                key={document.id}
                className="flex flex-wrap justify-between gap-3 border-b border-border pb-3"
              >
                <Link
                  className="type-link"
                  href={`/portal/documents/${document.id}`}
                >
                  {document.title}
                </Link>
                <span>
                  Version {document.currentVersionNumber} · {document.status}
                </span>
              </li>
            ))}
          </ul>
          {!documents.length && <p>No documents have been shared with you.</p>}
        </DashboardPanel>
        <DashboardPanel title="Workspace services">
          <nav className="flex flex-col gap-4">
            <Link className="type-link" href="/portal/documents">
              Browse document vault
            </Link>
            <Link className="type-link" href="/portal/billing">
              Billing overview
            </Link>
            <Link className="type-link" href="/support/tickets/new">
              Request support
            </Link>
          </nav>
        </DashboardPanel>
      </div>
    </DashboardLayout>
  );
}
