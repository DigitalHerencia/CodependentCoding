import {
  DataTableBlock,
  PageHeaderBlock,
} from "@/components/blocks/application-sections";
import { getProjects } from "@/lib/fetchers/projectsFetchers";

export async function ProjectsFeature() {
  const projects = await getProjects();
  return (
    <div className="space-y-6">
      <PageHeaderBlock
        eyebrow="Projects"
        title="Project portfolio"
        action={{ label: "View my tasks", href: "/my-tasks" }}
      />
      <DataTableBlock
        columns={[
          { key: "name", label: "Project" },
          { key: "status", label: "Status" },
          { key: "open", label: "Open tasks" },
          { key: "due", label: "Due" },
        ]}
        rows={projects.map((project) => ({
          id: project.id,
          href: `/projects/${project.id}`,
          cells: {
            name: project.name,
            status: project.status,
            open: String(project.openTaskCount),
            due: project.dueAt
              ? new Date(project.dueAt).toLocaleDateString()
              : null,
          },
        }))}
      />
    </div>
  );
}
