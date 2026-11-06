"use client";

import { PortalDocumentsTemplate } from "@/components/templates/portal-templates";
import { selectDocumentsWorkflow } from "@/lib/workflows/portalClientWorkflows";
import type { PortalDocumentDTO } from "@/types/portalTypes";
import { useState } from "react";
import { NewPortalDocumentForm } from "./newPortalDocumentForm";

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
      documents={selectDocumentsWorkflow(documents, query)}
      toolbarProps={{ query: query, onQueryChange: setQuery }}
    >
      {canWrite && <NewPortalDocumentForm />}
    </PortalDocumentsTemplate>
  );
}
