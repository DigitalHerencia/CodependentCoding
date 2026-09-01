import {
  addPortalDocumentVersion,
  createPortalDocument,
} from "@/lib/actions/portalActions";
import {
  getPortalBilling,
  getPortalDocuments,
} from "@/lib/fetchers/portalFetchers";
import type { PortalApprovalDecision } from "@/types/portalTypes";

export const createPortalDocumentWorkflow = createPortalDocument;
export const addPortalDocumentVersionWorkflow = addPortalDocumentVersion;
export const publishDocumentVersionWorkflow = addPortalDocumentVersion;

export async function getPortalWorkspaceWorkflow(limit = 100) {
  const [documents, billing] = await Promise.all([
    getPortalDocuments(limit),
    getPortalBilling(),
  ]);
  return { documents, billing };
}

export function determineApprovalState(decisions: PortalApprovalDecision[]) {
  if (decisions.some((decision) => decision.status === "REJECTED")) {
    return "REJECTED" as const;
  }
  if (
    decisions.length > 0 &&
    decisions.every((decision) => decision.status === "APPROVED")
  ) {
    return "APPROVED" as const;
  }
  return "PENDING" as const;
}
