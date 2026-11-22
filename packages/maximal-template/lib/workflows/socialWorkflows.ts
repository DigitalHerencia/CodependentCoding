"use server";

import {
  getMediaAssets,
  getSocialAccounts,
  getSocialPosts,
  getSocialVariantReview,
} from "@/lib/fetchers/socialFetchers";
import {
  approveSocialPost,
  createSocialPost,
  downloadSocialMedia,
  scheduleSocialPost,
} from "@/lib/actions/socialActions";
import "server-only";

/** Load the authorized bounded calendar including unscheduled drafts. */
export async function loadCalendarWorkflow() {
  return getSocialPosts();
}
/** Load account-specific text only when reviewing a calendar revision. */
export async function loadSocialVariantReviewWorkflow(input: unknown) {
  return getSocialVariantReview(input);
}
/** Load authorized account references without exposing credentials or claiming connectivity. */
export async function loadComposerWorkflow() {
  return { accounts: await getSocialAccounts() };
}
/** Load the social projection of uploads-owned assets. */
export async function loadMediaLibraryWorkflow() {
  return getMediaAssets();
}
/** Persist a draft aggregate through the authenticated command boundary. */
export async function createSocialPostWorkflow(input: unknown) {
  return createSocialPost(input);
}
/** Record approval of the expected revision through the authenticated command boundary. */
export async function approveSocialPostWorkflow(input: unknown) {
  return approveSocialPost(input);
}
/** Persist scheduling intent for an approved revision. */
export async function scheduleSocialPostWorkflow(input: unknown) {
  return scheduleSocialPost(input);
}
/** Resolve a bounded authorized artifact, optionally restricted to safe image previews. */
export async function resolveSocialMediaWorkflow(
  assetId: string,
  preview: boolean,
) {
  return downloadSocialMedia(assetId, preview);
}
