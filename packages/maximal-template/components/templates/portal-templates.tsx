import { portalPresentationCopy } from "@/content/portal";
// Why: Templates: pure presentation for the portal pages, laid out from DTOs; data and slots come from features.
import type { PortalBillingDTO, PortalDocumentDTO } from "@/types/portalTypes";
import {
  DashboardLayout,
  DashboardPanel,
  DashboardTable,
} from "@/components/blocks/shared-blocks";
import Link from "next/link";
import type { ReactNode } from "react";

export function PortalBillingTemplate({
  billing,
}: {
  billing: PortalBillingDTO;
}) {
  return (
    <DashboardLayout title={portalPresentationCopy.billingOverview} nav={[]}>
      <DashboardPanel title={portalPresentationCopy.subscription}>
        {billing.subscription ? (
          <dl className="grid gap-3 sm:grid-cols-2">
            <dt>{portalPresentationCopy.plan}</dt>
            <dd>{billing.subscription.planKey}</dd>
            <dt>{portalPresentationCopy.status}</dt>
            <dd>{billing.subscription.status}</dd>
            <dt>{portalPresentationCopy.currentPeriodEnds}</dt>
            <dd>
              {billing.subscription.currentPeriodEnd?.slice(0, 10) ??
                portalPresentationCopy.notRecorded}
            </dd>
            <dt>{portalPresentationCopy.renewal}</dt>
            <dd>
              {billing.subscription.cancelAtPeriodEnd
                ? portalPresentationCopy.cancelsAtPeriodEnd
                : portalPresentationCopy.continues}
            </dd>
          </dl>
        ) : (
          <p>
            {portalPresentationCopy.noSubscriptionIsRecordedForThisWorkspace}
          </p>
        )}
      </DashboardPanel>
      <DashboardPanel title={portalPresentationCopy.recentInvoices}>
        <DashboardTable
          columns={[
            { key: "number", label: portalPresentationCopy.invoice },
            { key: "customer", label: portalPresentationCopy.customer },
            { key: "amount", label: portalPresentationCopy.amount },
            { key: "status", label: portalPresentationCopy.status },
            { key: "due", label: portalPresentationCopy.due },
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
        {portalPresentationCopy.documentVault}
      </Link>
      <div className="grid gap-4 lg:grid-cols-[2fr_1fr]">
        <DashboardPanel title={portalPresentationCopy.document}>
          <p className="whitespace-pre-wrap">
            {document.description ?? portalPresentationCopy.noDescription}
          </p>
          {document.latestVersion ? (
            <dl className="mt-6 space-y-2">
              <dt>{portalPresentationCopy.currentFile}</dt>
              <dd>{document.latestVersion.filename}</dd>
              <dt>{portalPresentationCopy.format}</dt>
              <dd>{document.latestVersion.contentType}</dd>
              <dt>{portalPresentationCopy.size}</dt>
              <dd>
                {document.latestVersion.byteSize}
                {portalPresentationCopy.bytes}
              </dd>
              <dt>{portalPresentationCopy.added}</dt>
              <dd>{document.latestVersion.createdAt.slice(0, 10)}</dd>
            </dl>
          ) : (
            <p className="mt-5">
              {portalPresentationCopy.thisDocumentDoesNotHaveAFileVersionYet}
            </p>
          )}
        </DashboardPanel>
        <DashboardPanel title={portalPresentationCopy.versionAndReview}>
          <p>
            {portalPresentationCopy.version}
            {document.currentVersionNumber}
          </p>
          <p>
            {portalPresentationCopy.status2}
            {document.status}
          </p>
          <p>
            {portalPresentationCopy.clientVisible}
            {document.clientVisible
              ? portalPresentationCopy.yes
              : portalPresentationCopy.no}
          </p>
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
    <DashboardLayout
      title={portalPresentationCopy.documentVault}
      nav={[]}
      toolbar={toolbar}
    >
      {children}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {documents.map((document) => (
          <article key={document.id} className="space-y-3 surface-card p-5">
            <p className="type-caption">
              {document.latestVersion?.contentType ??
                portalPresentationCopy.documentFolder}
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
              {portalPresentationCopy.version}
              {document.currentVersionNumber}
              {portalPresentationCopy.separator}
              {document.status}
            </p>
            <p className="text-sm">
              {document.latestVersion?.filename ??
                portalPresentationCopy.noFileVersionYet}
            </p>
          </article>
        ))}
      </div>
      {!documents.length && <p>{portalPresentationCopy.noMatchingDocuments}</p>}
    </DashboardLayout>
  );
}

export function PortalHomeTemplate({
  documents,
}: {
  documents: PortalDocumentDTO[];
}) {
  return (
    <DashboardLayout title={portalPresentationCopy.clientWorkspace} nav={[]}>
      <div className="grid gap-5 lg:grid-cols-[2fr_1fr]">
        <DashboardPanel title={portalPresentationCopy.recentDocuments}>
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
                  {portalPresentationCopy.version}
                  {document.currentVersionNumber}
                  {portalPresentationCopy.separator}
                  {document.status}
                </span>
              </li>
            ))}
          </ul>
          {!documents.length && (
            <p>{portalPresentationCopy.noDocumentsHaveBeenSharedWithYou}</p>
          )}
        </DashboardPanel>
        <DashboardPanel title={portalPresentationCopy.workspaceServices}>
          <nav className="flex flex-col gap-4">
            <Link className="type-link" href="/portal/documents">
              {portalPresentationCopy.browseDocumentVault}
            </Link>
            <Link className="type-link" href="/portal/billing">
              {portalPresentationCopy.billingOverview}
            </Link>
            <Link className="type-link" href="/support/tickets/new">
              {portalPresentationCopy.requestSupport}
            </Link>
          </nav>
        </DashboardPanel>
      </div>
    </DashboardLayout>
  );
}
