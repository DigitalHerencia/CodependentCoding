export function toUploadedAssetDTO(asset: { id: string; filename: string }) {
  return { id: asset.id, filename: asset.filename };
}
