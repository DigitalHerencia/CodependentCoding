/** Minimum interval between saving a schedule and its requested UTC instant. */
export const SOCIAL_SCHEDULE_MIN_LEAD_MS = 60_000;

/** Storage transfers are limited to 10 MiB for social preview and download. */
export const SOCIAL_MEDIA_MAX_BYTES = 10 * 1024 * 1024;

/** Restrict inline previews to the supported raster image formats. */
export function isSocialMediaPreviewable(contentType: string) {
  return /^image\/(?:png|jpeg|webp|gif|avif)$/i.test(contentType);
}
