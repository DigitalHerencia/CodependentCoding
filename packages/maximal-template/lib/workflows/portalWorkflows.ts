import {
  getPortalAssets,
  getPortalBilling,
  getPortalDocument,
  getPortalDocuments,
  getPortalWriteAccess,
} from "@/lib/fetchers/portalFetchers";
import { type PortalApprovalDecision } from "@/types/portalTypes";
import { notFound } from "next/navigation";
import "server-only";

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

export async function loadBillingWorkflow() {
  const billing = await getPortalBilling();
  return { billing };
}

export async function loadDocumentWorkflow({
  documentId,
}: {
  documentId: string;
}) {
  const [document, canWrite] = await Promise.all([
    getPortalDocument(documentId),
    getPortalWriteAccess(),
  ]);
  if (!document) notFound();
  const assets = canWrite ? await getPortalAssets() : [];
  return { document, canWrite, assets };
}

export async function loadDocumentsWorkflow() {
  const [documents, canWrite] = await Promise.all([
    getPortalDocuments(),
    getPortalWriteAccess(),
  ]);
  return { documents, canWrite };
}

export async function loadPortalWorkflow() {
  const documents = await getPortalDocuments();
  return { documents };
}
