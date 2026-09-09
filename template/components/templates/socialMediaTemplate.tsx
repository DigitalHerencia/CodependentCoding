import type { ReactNode } from "react";
import type { MediaAssetDTO } from "@/types/socialTypes";
import { DashboardLayout } from "@/components/blocks/dashboard-layout";
export function SocialMediaTemplate({
  assets,
  toolbar,
  children,
  renderControls,
}: {
  assets: MediaAssetDTO[];
  toolbar: ReactNode;
  children: ReactNode;
  renderControls: (asset: MediaAssetDTO) => ReactNode;
}) {
  return (
    <DashboardLayout title="Media library" nav={[]} toolbar={toolbar}>
      {children}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {assets.map((asset) => (
          <article className="surface-card p-5" key={asset.id}>
            <div className="mb-4 flex aspect-video items-center justify-center surface-inset p-3 text-center type-label">
              {asset.contentType}
            </div>
            <h2 className="type-label break-all">{asset.filename}</h2>
            <p className="mt-3 text-sm">{asset.byteSize} bytes</p>
            <p className="text-sm text-muted-primary">
              Added {asset.createdAt.slice(0, 10)}
            </p>
            {renderControls(asset)}
          </article>
        ))}
      </div>
      {!assets.length && <p>No matching media assets.</p>}
    </DashboardLayout>
  );
}
