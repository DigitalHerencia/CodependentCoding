"use client";
import { portalPresentationCopy } from "@/content/portal";
import { portalBlockCopy } from "@/content/portal";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import type { PortalDocumentDTO } from "@/types/portalTypes";

export function PortalDocumentControlsBlock({
  document,
  canWrite,
  pending,
  message,
  onDownload,
  onShare,
}: {
  document: PortalDocumentDTO;
  canWrite: boolean;
  pending: boolean;
  message: string;
  onDownload: () => void | Promise<void>;
  onShare: () => void | Promise<void>;
}) {
  return (
    <div className="my-4 space-y-3">
      {document.latestVersion && (
        <Button disabled={pending} onClick={onDownload}>
          {portalBlockCopy.downloadCurrentFile}
        </Button>
      )}
      {canWrite &&
        document.latestVersion &&
        (!document.clientVisible || document.status !== "PUBLISHED") && (
          <Button disabled={pending} onClick={onShare}>
            {portalBlockCopy.shareWithClients}
          </Button>
        )}
      <p role="status">{message}</p>
    </div>
  );
}

export function PortalDocumentsToolbar({
  query,
  onQueryChange,
}: {
  query: string;
  onQueryChange: (query: string) => void;
}) {
  return (
    <Input
      aria-label={portalPresentationCopy.searchDocuments}
      placeholder={portalPresentationCopy.searchDocumentOrFilename}
      value={query}
      onChange={(event) => onQueryChange(event.target.value)}
    />
  );
}
