import { notFound } from "next/navigation";
import {
  getPortalAssets,
  getPortalDocument,
  getPortalWriteAccess,
} from "@/lib/fetchers/portalFetchers";
import { PortalDocumentDetailTemplate } from "@/components/templates/portalDocumentDetailTemplate";
import { PortalDocumentControls } from "./portalDocumentControls.client";
import { WorkspaceFileUpload } from "@/features/uploads/workspaceFileUpload.client";
import { DocumentFeatureClient } from "./documentFeature.client";
export async function DocumentFeature({ documentId }: { documentId: string }) {
  const document = await getPortalDocument(documentId);
  if (!document) notFound();
  const canWrite = await getPortalWriteAccess();
  return (
    <PortalDocumentDetailTemplate document={document}>
      <PortalDocumentControls document={document} canWrite={canWrite} />
      {canWrite && <WorkspaceFileUpload domain="portal" />}
      {canWrite && (
        <DocumentFeatureClient
          key={document.version}
          document={document}
          assets={await getPortalAssets()}
        />
      )}
    </PortalDocumentDetailTemplate>
  );
}
