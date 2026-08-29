import { PageHero } from "@/components/blocks/page-hero"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { UploadClient } from "@/features/uploads/upload-client"
import { getMediaLibraryState } from "@/lib/fetchers/capabilityFetchers"

export async function UploadFeature() {
  const assets = await getMediaLibraryState()
  return (
    <div className="grid gap-8">
      <PageHero
        eyebrow="Media"
        title="Upload and manage product assets."
        description="Cloudinary owns media mechanics; the application keeps tenant-scoped asset state."
      />
      <UploadClient />
      <div className="grid gap-4 md:grid-cols-3">
        {assets.map((asset) => (
          <Card key={asset.id}>
            <CardHeader>
              <CardTitle className="text-base">{asset.publicId}</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              {asset.resourceType} · {asset.status}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
