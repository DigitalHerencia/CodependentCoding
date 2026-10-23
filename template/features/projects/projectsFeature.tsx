// Why: Server feature: loads the portfolio once and hands it to the filtering island.
import { ProjectsFeatureClient } from "./projectsFeature.client";
import { getProjectsWorkflow } from "@/lib/workflows/projectsWorkflows";
export async function ProjectsFeature() {
  return <ProjectsFeatureClient projects={await getProjectsWorkflow(100)} />;
}
