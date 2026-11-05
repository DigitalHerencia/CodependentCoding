import { WorkspaceLoadingState } from "@/components/blocks/shared-blocks";

export function ProfileSkeleton() {
  return <WorkspaceLoadingState route="/settings/profile" />;
}
