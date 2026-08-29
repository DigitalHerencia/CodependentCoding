import {
  MetricGridBlock,
  PageHeaderBlock,
} from "@/components/blocks/application-sections";
import { getPortalDocuments } from "@/lib/fetchers/portalFetchers";

// Features orchestrate blocks and lib helpers; they never import raw UI primitives.
export async function PortalFeature() {
  const documents = await getPortalDocuments();
  const visible = documents.filter((document) => document.clientVisible).length;
  const approved = documents.filter(
    (document) => document.status === "APPROVED",
  ).length;
  const awaitingReview = documents.filter(
    (document) => document.status === "IN_REVIEW",
  ).length;
  return (
    <div className="space-y-6">
      <PageHeaderBlock
        eyebrow="Client portal"
        title="Workspace overview"
        description="Authorized documents and project handoff state for the active organization."
        action={{ label: "Open documents", href: "/portal/documents" }}
      />
      <MetricGridBlock
        metrics={[
          { label: "Documents", value: documents.length.toString() },
          { label: "Client visible", value: visible.toString() },
          { label: "Approved", value: approved.toString() },
          { label: "In review", value: awaitingReview.toString() },
        ]}
      />
    </div>
  );
}
