import { ProjectTimelineTemplate } from "@/components/templates/projects-templates";
import { loadTimelineWorkflow } from "@/lib/workflows/projectsWorkflows";

// Why: Server feature: loads the project workspace (null means 404) for the timeline.

export async function TimelineFeature({ projectId }: { projectId: string }) {
  const { workspace } = await loadTimelineWorkflow({ projectId });
  return <ProjectTimelineTemplate {...workspace} />;
}
