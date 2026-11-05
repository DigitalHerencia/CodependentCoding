"use client";
import { useState } from "react";
import { PortalDocumentsTemplate } from "@/components/templates/portal-templates";
import { PortalDocumentsToolbar } from "@/components/blocks/portal-blocks";
import { PortalDocumentNewForm } from "./portal-document-new-form";
import type { PortalDocumentDTO } from "@/types/portalTypes";
export function DocumentsFeatureClient({
  documents,
  canWrite,
}: {
  documents: PortalDocumentDTO[];
  canWrite: boolean;
}) {
  const [query, setQuery] = useState("");
  return (
    <PortalDocumentsTemplate
      documents={documents.filter((document) =>
        (document.title + " " + (document.latestVersion?.filename ?? ""))
          .toLowerCase()
          .includes(query.toLowerCase()),
      )}
      toolbar={
        <PortalDocumentsToolbar query={query} onQueryChange={setQuery} />
      }
    >
      {canWrite && <PortalDocumentNewForm />}
    </PortalDocumentsTemplate>
  );
}
