import {
  getMediaAssets,
  getScheduledSocialPosts,
  getSocialAccounts,
  getSocialPosts,
} from "@/lib/fetchers/socialFetchers";
import "server-only";

export async function getSocialWorkspaceWorkflow(limit = 100) {
  const [posts, accounts, media] = await Promise.all([
    getScheduledSocialPosts(limit),
    getSocialAccounts(),
    getMediaAssets(limit),
  ]);
  return { posts, accounts, media };
}

export async function loadCalendarWorkflow() {
  const posts = await getSocialPosts();
  return { posts };
}

export async function loadComposerWorkflow() {
  const accounts = await getSocialAccounts();
  return { accounts };
}

export async function loadMediaLibraryWorkflow() {
  const assets = await getMediaAssets();
  return { assets };
}
