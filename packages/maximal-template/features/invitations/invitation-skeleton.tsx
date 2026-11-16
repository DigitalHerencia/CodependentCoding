import { InvitationLoadingTemplate } from "@/components/templates/invitation-templates";

/** Independent acceptance-route fallback inside the preserved auth shell. */
export function InvitationSkeleton() {
  return <InvitationLoadingTemplate />;
}
