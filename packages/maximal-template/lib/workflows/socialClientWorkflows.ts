import { socialPresentationCopy } from "@/content/social";
import { downloadSocialMedia } from "@/lib/actions/socialActions";
import { downloadBase64File } from "@/lib/utils/download";
import type {
  MediaAssetDTO,
  MediaAssetView,
  SocialPostDTO,
} from "@/types/socialTypes";

export function selectCalendarWorkflow(posts: SocialPostDTO[], query: string) {
  const visible = posts.filter((post) =>
    ((post.title ?? "") + " " + post.content)
      .toLowerCase()
      .includes(query.toLowerCase()),
  );
  const dates = [
    ...new Set(
      visible.map(
        (post) =>
          post.scheduledAt?.slice(0, 10) ??
          socialPresentationCopy.unscheduledDrafts,
      ),
    ),
  ].sort();
  return {
    posts: visible,
    groups: dates.map((date) => ({
      date,
      items: visible.filter(
        (post) =>
          (post.scheduledAt?.slice(0, 10) ??
            socialPresentationCopy.unscheduledDrafts) === date,
      ),
    })),
  };
}

export function selectMediaLibraryWorkflow(
  assets: MediaAssetDTO[],
  query: string,
) {
  const visible = assets.filter((asset) =>
    `${asset.filename} ${asset.contentType}`
      .toLowerCase()
      .includes(query.toLowerCase()),
  );
  return {
    assets: visible.map((asset) => ({
      ...asset,
      canPreview: /^image\/(png|jpeg|webp|gif|avif)$/.test(asset.contentType),
    })),
    openAsset: openMediaAsset,
  };
}

async function openMediaAsset(asset: MediaAssetView) {
  const result = await downloadSocialMedia(asset.id);
  if (!result.ok) return result;
  if (!asset.canPreview) downloadBase64File(result.data);
  return {
    ...result,
    data: {
      ...result.data,
      preview: asset.canPreview
        ? `data:${asset.contentType};base64,${result.data.base64}`
        : "",
    },
  };
}
