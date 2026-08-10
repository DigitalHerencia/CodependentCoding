ALTER TYPE "WebhookProvider" ADD VALUE 'cloudinary';
CREATE TYPE "MediaAssetStatus" AS ENUM ('pending', 'ready', 'deleted', 'failed');

ALTER TABLE "users" ADD COLUMN "isApplicationAdmin" BOOLEAN NOT NULL DEFAULT false;

CREATE TABLE "media_assets" (
  "id" TEXT NOT NULL,
  "organizationId" TEXT NOT NULL,
  "uploadedById" TEXT NOT NULL,
  "providerAssetId" VARCHAR(255) NOT NULL,
  "publicId" VARCHAR(255) NOT NULL,
  "resourceType" VARCHAR(40) NOT NULL,
  "format" VARCHAR(40),
  "secureUrl" VARCHAR(1000),
  "bytes" INTEGER,
  "width" INTEGER,
  "height" INTEGER,
  "status" "MediaAssetStatus" NOT NULL DEFAULT 'pending',
  "providerUpdatedAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "media_assets_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "location_records" (
  "id" TEXT NOT NULL,
  "organizationId" TEXT NOT NULL,
  "label" VARCHAR(200) NOT NULL,
  "mapboxId" VARCHAR(255),
  "longitude" DECIMAL(9,6) NOT NULL,
  "latitude" DECIMAL(8,6) NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "location_records_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "location_longitude_check" CHECK ("longitude" BETWEEN -180 AND 180),
  CONSTRAINT "location_latitude_check" CHECK ("latitude" BETWEEN -90 AND 90)
);

CREATE TABLE "provider_media_asset_bindings" (
  "id" TEXT NOT NULL,
  "providerAssetId" VARCHAR(255) NOT NULL,
  "organizationId" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "provider_media_asset_bindings_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "media_assets_providerAssetId_key" ON "media_assets"("providerAssetId");
CREATE INDEX "media_assets_organizationId_status_idx" ON "media_assets"("organizationId", "status");
CREATE INDEX "media_assets_uploadedById_idx" ON "media_assets"("uploadedById");
CREATE INDEX "location_records_organizationId_idx" ON "location_records"("organizationId");
CREATE UNIQUE INDEX "provider_media_asset_bindings_providerAssetId_key" ON "provider_media_asset_bindings"("providerAssetId");
CREATE INDEX "provider_media_asset_bindings_organizationId_idx" ON "provider_media_asset_bindings"("organizationId");

ALTER TABLE "media_assets" ADD CONSTRAINT "media_assets_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "location_records" ADD CONSTRAINT "location_records_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "provider_media_asset_bindings" ADD CONSTRAINT "provider_media_asset_bindings_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE "media_assets", "location_records" TO vibes_runtime;
GRANT SELECT, INSERT ON TABLE "provider_media_asset_bindings" TO vibes_runtime;

ALTER TABLE "media_assets" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "media_assets" FORCE ROW LEVEL SECURITY;
CREATE POLICY "media_assets_tenant" ON "media_assets" TO vibes_runtime USING ("organizationId" = app_private.current_organization_id()) WITH CHECK ("organizationId" = app_private.current_organization_id());

ALTER TABLE "location_records" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "location_records" FORCE ROW LEVEL SECURITY;
CREATE POLICY "location_records_tenant" ON "location_records" TO vibes_runtime USING ("organizationId" = app_private.current_organization_id()) WITH CHECK ("organizationId" = app_private.current_organization_id());
