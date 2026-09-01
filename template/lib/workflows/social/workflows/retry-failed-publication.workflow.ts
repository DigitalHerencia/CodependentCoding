import type { AuthenticatedIdentity } from "../../../types/access";
import {
  publishPostWorkflow,
  type SocialPublisher,
} from "./publish-post.workflow";

export async function retryFailedPublicationWorkflow(
  identity: AuthenticatedIdentity,
  command: { postId: string },
  publisher: SocialPublisher,
) {
  return publishPostWorkflow(identity, command, publisher);
}
