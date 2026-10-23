import { ProjectTimelineTemplate } from "@/components/templates/projectsTimelineTemplate";
import { getProjectWorkspaceWorkflow } from "@/lib/workflows/projectsWorkflows";
export async function TimelineFeature({ projectId }: { projectId: string }) {
  const workspace = await getProjectWorkspaceWorkflow(projectId);
  return <ProjectTimelineTemplate {...workspace} />;
}
