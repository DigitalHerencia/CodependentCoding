import { notFound } from "next/navigation";
import {
  getPortalAssets,
  getPortalDocument,
  getPortalWriteAccess,
} from "@/lib/fetchers/portalFetchers";
import { PortalDocumentDetailTemplate } from "@/components/templates/portal-templates";
import { PortalDocumentControls } from "./portal-document-controls.client";
import { WorkspaceFileUpload } from "@/features/uploads/workspace-file-upload-form.client";
import { DocumentFeatureClient } from "./document-version-form.client";
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
