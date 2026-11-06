"use client";

import { ProjectsTemplate } from "@/components/templates/projects-templates";
import { selectProjectsWorkflow } from "@/lib/workflows/projectsClientWorkflows";
import type { ProjectSummaryDTO } from "@/types/projectsTypes";
import { useState } from "react";

// Why: Client island: filters the already-authorized project list in the browser; never fetches.

export function ProjectsFeatureClient({
  projects,
}: {
  projects: ProjectSummaryDTO[];
}) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("");
  return (
    <ProjectsTemplate
      projects={selectProjectsWorkflow(projects, query, status)}
      toolbarProps={{
        query: query,
        onQueryChange: setQuery,
        status: status,
        onStatusChange: setStatus,
        statuses: [...new Set(projects.map((project) => project.status))],
      }}
    />
  );
}
