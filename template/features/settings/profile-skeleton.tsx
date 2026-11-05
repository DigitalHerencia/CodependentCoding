import { WorkspaceLoadingState } from "@/components/blocks/loading-states";

export function ProfileSkeleton() {
  return <WorkspaceLoadingState route="/settings/profile" />;
}
