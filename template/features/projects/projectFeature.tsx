import {
  EmptyStateBlock,
  PageHeaderBlock,
  RecordDetailBlock,
} from "@/components/blocks/application-sections";
import { getProject } from "@/lib/fetchers/projectsFetchers";

export async function ProjectFeature({ projectId }: { projectId: string }) {
  const project = await getProject(projectId);
  if (!project)
    return (
      <EmptyStateBlock
        title="Project not found"
        description="No project is visible with this identifier."
      />
    );
  return (
    <div className="space-y-6">
      <PageHeaderBlock
        eyebrow="Project"
        title={project.name}
        action={{ label: "Open tasks", href: `/projects/${project.id}/tasks` }}
      />
      <RecordDetailBlock
        title="Project health"
        status={project.status}
        items={[
          { label: "Open tasks", value: String(project.openTaskCount) },
          { label: "Total tasks", value: String(project.taskCount) },
          {
            label: "Starts",
            value: project.startsAt
              ? new Date(project.startsAt).toLocaleDateString()
              : "—",
          },
          {
            label: "Due",
            value: project.dueAt
              ? new Date(project.dueAt).toLocaleDateString()
              : "—",
          },
          { label: "Description", value: project.description ?? "—" },
        ]}
      />
    </div>
  );
}
