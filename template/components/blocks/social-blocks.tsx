"use client";
import { socialPresentationCopy } from "@/content/social";
import { socialBlockCopy } from "@/content/social";
import { Input } from "@/components/ui/input";
export function MediaLibraryToolbar({
  query,
  onQueryChange,
}: {
  query: string;
  onQueryChange: (value: string) => void;
}) {
  return (
    <Input
      aria-label={socialBlockCopy.searchMedia}
      placeholder={socialBlockCopy.searchFilenameOrMediaType}
      value={query}
      onChange={(event) => onQueryChange(event.target.value)}
    />
  );
}
import Image from "next/image";
import { Button } from "@/components/ui/button";

import type { MediaAssetDTO } from "@/types/socialTypes";

export function MediaAssetControlsBlock({
  asset,
  preview,
  pending,
  message,
  canPreview,
  onOpen,
}: {
  asset: MediaAssetDTO;
  preview: string;
  pending: boolean;
  message: string;
  canPreview: boolean;
  onOpen: () => void | Promise<void>;
}) {
  return (
    <div className="mt-3 space-y-3">
      {preview && (
        <Image
          src={preview}
          unoptimized
          width={640}
          height={360}
          className="aspect-video w-full object-contain"
          alt={asset.filename}
        />
      )}
      <Button disabled={pending} size="sm" onClick={onOpen}>
        {pending
          ? socialBlockCopy.loading
          : canPreview
            ? socialBlockCopy.previewImage
            : socialBlockCopy.downloadFile}
      </Button>
      <p role="status">{message}</p>
    </div>
  );
}

export function SocialCalendarToolbar({
  query,
  onQueryChange,
}: {
  query: string;
  onQueryChange: (query: string) => void;
}) {
  return (
    <Input
      aria-label={socialPresentationCopy.searchPosts}
      placeholder={socialPresentationCopy.searchPosts}
      value={query}
      onChange={(event) => onQueryChange(event.target.value)}
    />
  );
}
