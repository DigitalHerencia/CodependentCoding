"use client";
import { MediaLibraryToolbar } from "@/components/blocks/social-blocks";
import { WorkspaceFileUpload } from "@/features/uploads/workspace-file-upload.client";
import { useState } from "react";
import { SocialMediaTemplate } from "@/components/templates/social-templates";
import type { MediaAssetDTO } from "@/types/socialTypes";
import { MediaAssetControls } from "./media-asset-controls.client";
export function MediaLibraryFeatureClient({
  assets,
}: {
  assets: MediaAssetDTO[];
}) {
  const [query, setQuery] = useState("");
  return (
    <SocialMediaTemplate
      renderControls={(asset) => <MediaAssetControls asset={asset} />}
      assets={assets.filter((asset) =>
        `${asset.filename} ${asset.contentType}`
          .toLowerCase()
          .includes(query.toLowerCase()),
      )}
      toolbar={<MediaLibraryToolbar query={query} onQueryChange={setQuery} />}
    >
      <WorkspaceFileUpload domain="social" />
    </SocialMediaTemplate>
  );
}
