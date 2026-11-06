import { loadProjectsWorkflow } from "@/lib/workflows/projectsWorkflows";
import { ProjectsFeatureClient } from "./projects-feature.client";

// Why: Server feature: loads the portfolio once and hands it to the filtering island.

export async function ProjectsFeature() {
  const { projects } = await loadProjectsWorkflow();
  return <ProjectsFeatureClient projects={projects} />;
}
