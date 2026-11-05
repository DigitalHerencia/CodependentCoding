"use client";
import { ProjectsToolbar } from "@/components/blocks/projects-blocks";
// Why: Client island: filters the already-authorized project list in the browser; never fetches.
import { useState } from "react";
import { ProjectsTemplate } from "@/components/templates/projects-templates";
import type { ProjectSummaryDTO } from "@/types/projectsTypes";
export function ProjectsFeatureClient({
  projects,
}: {
  projects: ProjectSummaryDTO[];
}) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("");
  return (
    <ProjectsTemplate
      projects={projects.filter(
        (project) =>
          (!status || project.status === status) &&
          `${project.name} ${project.description ?? ""}`
            .toLowerCase()
            .includes(query.toLowerCase()),
      )}
      toolbar={
        <ProjectsToolbar
          query={query}
          onQueryChange={setQuery}
          status={status}
          onStatusChange={setStatus}
          statuses={[...new Set(projects.map((project) => project.status))]}
        />
      }
    />
  );
}
