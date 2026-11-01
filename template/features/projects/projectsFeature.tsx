// Why: Server feature: loads the portfolio once and hands it to the filtering island.
import { ProjectsFeatureClient } from "./projectsFeature.client";
import { getProjects } from "@/lib/fetchers/projectsFetchers";
export async function ProjectsFeature() {
  return <ProjectsFeatureClient projects={await getProjects(100)} />;
}
