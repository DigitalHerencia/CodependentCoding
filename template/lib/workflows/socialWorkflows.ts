import {
  approveSocialPost,
  createSocialPost,
  scheduleSocialPost,
} from "@/lib/actions/socialActions";
import {
  getMediaAssets,
  getScheduledSocialPosts,
  getSocialAccounts,
} from "@/lib/fetchers/socialFetchers";

export const createSocialPostWorkflow = createSocialPost;
export const scheduleSocialPostWorkflow = scheduleSocialPost;
export const schedulePostWorkflow = scheduleSocialPost;
export const approvePostWorkflow = approveSocialPost;

export async function getSocialWorkspaceWorkflow(limit = 100) {
  const [posts, accounts, media] = await Promise.all([
    getScheduledSocialPosts(limit),
    getSocialAccounts(),
    getMediaAssets(limit),
  ]);
  return { posts, accounts, media };
}
