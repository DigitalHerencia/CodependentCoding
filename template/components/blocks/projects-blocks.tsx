"use client";
import { projectsBlockCopy } from "@/content/projects";
import Link from "next/link";
import { Input } from "@/components/ui/input";
export function ProjectsToolbar({
  query,
  onQueryChange,
  status,
  onStatusChange,
  statuses,
}: {
  query: string;
  onQueryChange: (value: string) => void;
  status: string;
  onStatusChange: (value: string) => void;
  statuses: string[];
}) {
  return (
    <div className="flex flex-wrap gap-3">
      <Input
        aria-label={projectsBlockCopy.searchProjects}
        placeholder={projectsBlockCopy.searchProjects}
        value={query}
        onChange={(event) => onQueryChange(event.target.value)}
      />
      <select
        className="control-field"
        aria-label={projectsBlockCopy.projectStatus}
        value={status}
        onChange={(event) => onStatusChange(event.target.value)}
      >
        <option value="">{projectsBlockCopy.allStatuses}</option>
        {statuses.map((value) => (
          <option key={value}>{value}</option>
        ))}
      </select>
      <Link className="type-link" href="/projects/new">
        {projectsBlockCopy.newProject}
      </Link>
    </div>
  );
}
