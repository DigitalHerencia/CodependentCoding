import {
  MediaLibraryBlock,
  PageHeaderBlock,
} from "@/components/blocks/application-sections";
import { getMediaAssets } from "@/lib/fetchers/socialFetchers";

export async function MediaLibraryFeature() {
  const assets = await getMediaAssets();
  return (
    <div className="space-y-6">
      <PageHeaderBlock
        eyebrow="Social"
        title="Media library"
        description="Tenant-scoped assets available for social posts."
      />
      <MediaLibraryBlock
        items={assets.map((asset) => ({
          id: asset.id,
          title: asset.filename,
          description: `${asset.contentType} · ${asset.byteSize} bytes`,
        }))}
      />
    </div>
  );
}
