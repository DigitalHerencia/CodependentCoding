// Why: Server feature: loads the project workspace (null means 404) for the timeline.
import { notFound } from "next/navigation";
import { ProjectTimelineTemplate } from "@/components/templates/projectsTimelineTemplate";
import { getProjectWorkspaceWorkflow } from "@/lib/workflows/projectsWorkflows";
export async function TimelineFeature({ projectId }: { projectId: string }) {
  const workspace = await getProjectWorkspaceWorkflow(projectId);
  if (!workspace) notFound();
  return <ProjectTimelineTemplate {...workspace} />;
}
