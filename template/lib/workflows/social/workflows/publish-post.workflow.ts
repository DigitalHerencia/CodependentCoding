import type { AuthenticatedIdentity } from "../../../types/access";
import { assertPermission } from "../../authz/permissions";
import { withTenantTransaction } from "../../db/tenant";
import { prepareSocialPublicationTx } from "../../db/transactions/socialTransactions";
import { reconcilePublishStateWorkflow } from "./reconcile-publish-state.workflow";

export interface SocialPublisher {
  publish(input: {
    provider: string;
    providerAccountId: string;
    credentialRef: string;
    content: string;
  }): Promise<{ providerPostId: string }>;
}

export async function publishPostWorkflow(
  identity: AuthenticatedIdentity,
  command: { postId: string },
  publisher: SocialPublisher,
) {
  const post = await withTenantTransaction(identity, async (tx, access) => {
    assertPermission(access, "social:write");
    return prepareSocialPublicationTx(tx, {
      organizationId: access.organizationId,
      postId: command.postId,
    });
  });
  const results = await Promise.all(
    post.variants.map(async (variant) => {
      const account = variant.socialAccount;
      if (!account.active || !account.credentialRef) {
        return { variantId: variant.id, errorCode: "Social account is not configured." };
      }
      try {
        const published = await publisher.publish({
          provider: account.provider,
          providerAccountId: account.providerAccountId,
          credentialRef: account.credentialRef,
          content: variant.content,
        });
        return { variantId: variant.id, providerPostId: published.providerPostId };
      } catch (cause) {
        return {
          variantId: variant.id,
          errorCode: cause instanceof Error ? cause.message : "Publication failed.",
        };
      }
    }),
  );
  return reconcilePublishStateWorkflow(identity, {
    postId: command.postId,
    results,
  });
}
