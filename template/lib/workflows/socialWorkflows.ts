import {
  getMediaAssets,
  getScheduledSocialPosts,
  getSocialAccounts,
} from "@/lib/fetchers/socialFetchers";

export async function getSocialWorkspaceWorkflow(limit = 100) {
  const [posts, accounts, media] = await Promise.all([
    getScheduledSocialPosts(limit),
    getSocialAccounts(),
    getMediaAssets(limit),
  ]);
  return { posts, accounts, media };
}
