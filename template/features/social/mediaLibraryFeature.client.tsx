"use client";
import { WorkspaceFileUpload } from "@/features/portal/workspaceFileUpload.client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { SocialMediaTemplate } from "@/components/templates/socialMediaTemplate";
import type { MediaAssetDTO } from "@/types/socialTypes";
import { MediaAssetControls } from "./mediaAssetControls.client";
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
      toolbar={
        <Input
          aria-label="Search media"
          placeholder="Search filename or media type"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
      }
    >
      <WorkspaceFileUpload domain="social" />
    </SocialMediaTemplate>
  );
}
