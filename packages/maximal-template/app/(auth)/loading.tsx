/** Auth route loading composes the owned block directly. */
import { AuthLoadingBlock } from "@/components/blocks/auth-blocks";
/** Loading has no application logic or template dependency. */
export default function Loading() {
  return <AuthLoadingBlock />;
}
