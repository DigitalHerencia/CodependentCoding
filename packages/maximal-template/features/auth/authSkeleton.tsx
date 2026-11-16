import { AuthLoadingTemplate } from "@/components/templates/auth-templates";

/** Form-sized skeleton used by the auth route group's Suspense boundary. */
export function AuthSkeleton() {
  return <AuthLoadingTemplate />;
}
