import { loadProjectEditWorkflow } from "@/lib/workflows/projectsWorkflows";
import { NewProjectForm } from "./newProjectForm";

// Why: Server feature: loads the project (null means not in this org, so 404) and reuses the form.

export async function ProjectEditFeature({ projectId }: { projectId: string }) {
  const { project } = await loadProjectEditWorkflow({ projectId });
  return <NewProjectForm project={project} />;
}
