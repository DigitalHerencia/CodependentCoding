import { getSocialAccounts } from "../../fetchers/socialFetchers";
import { buildPlatformVariant } from "../../social/logic/build-platform-variant.logic";

export async function buildPlatformVariantWorkflow(command: {
  socialAccountId: string;
  content: string;
}) {
  const accounts = await getSocialAccounts();
  const account = accounts.find((candidate) => candidate.id === command.socialAccountId);
  if (!account) throw new Error("Social account was not found.");
  return buildPlatformVariant(account.provider, command.content);
}
