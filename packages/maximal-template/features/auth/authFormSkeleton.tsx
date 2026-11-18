/** Auth forms share a block-only skeleton across route Suspense boundaries. */
import { AuthLoadingBlock } from "@/components/blocks/auth-blocks";
/** Match the credential form dimensions without importing application logic. */
export function AuthFormSkeleton() {
  return <AuthLoadingBlock />;
}
