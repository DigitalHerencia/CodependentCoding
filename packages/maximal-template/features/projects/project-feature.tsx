import { ProjectDetailTemplate } from "@/components/templates/projects-templates";
import { loadProjectWorkflow } from "@/lib/workflows/projectsWorkflows";

// Why: Server feature: loads the project workspace and picks the upcoming open work.

export async function ProjectFeature({ projectId }: { projectId: string }) {
  const view = await loadProjectWorkflow({ projectId });
  return <ProjectDetailTemplate {...view} />;
}
