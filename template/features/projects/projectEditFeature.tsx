// Why: Server feature: loads the project (null means not in this org, so 404) and reuses the form.
import { notFound } from "next/navigation";
import { getProject } from "@/lib/fetchers/projectsFetchers";
import { ProjectNewForm } from "./projectNewForm";
export async function ProjectEditFeature({ projectId }: { projectId: string }) {
  const project = await getProject(projectId);
  if (!project) notFound();
  return <ProjectNewForm project={project} />;
}
