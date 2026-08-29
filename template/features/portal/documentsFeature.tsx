import {
  FileVaultBlock,
  PageHeaderBlock,
} from "@/components/blocks/application-sections";
import { getPortalDocuments } from "@/lib/fetchers/portalFetchers";

// Features orchestrate blocks and lib helpers; they never import raw UI primitives.
export async function DocumentsFeature() {
  const documents = await getPortalDocuments();
  return (
    <div className="space-y-6">
      <PageHeaderBlock
        eyebrow="Client portal"
        title="Documents"
        description="Versioned files allowed for this organization and membership."
      />
      <FileVaultBlock
        files={documents.map((document) => ({
          id: document.id,
          name: document.title,
          meta: document.latestVersion
            ? `${document.status} · v${document.latestVersion.versionNumber} · ${document.latestVersion.filename}`
            : `${document.status} · No uploaded version`,
        }))}
      />
    </div>
  );
}
