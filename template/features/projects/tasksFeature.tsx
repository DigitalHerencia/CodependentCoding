import {
  DataTableBlock,
  PageHeaderBlock,
} from "@/components/blocks/application-sections";
import { getMyTasks, getProjectTasks } from "@/lib/fetchers/projectsFetchers";

export async function TasksFeature({ projectId }: { projectId?: string }) {
  const tasks = projectId
    ? await getProjectTasks(projectId)
    : await getMyTasks();
  return (
    <div className="space-y-6">
      <PageHeaderBlock
        eyebrow="Projects"
        title={projectId ? "Project tasks" : "My tasks"}
        description="Assignment and tenant scope are enforced before task DTOs reach this table."
      />
      <DataTableBlock
        columns={[
          { key: "title", label: "Task" },
          { key: "status", label: "Status" },
          { key: "priority", label: "Priority" },
          { key: "assignee", label: "Assignee" },
          { key: "due", label: "Due" },
        ]}
        rows={tasks.map((task) => ({
          id: task.id,
          cells: {
            title: task.title,
            status: task.status,
            priority: task.priority,
            assignee: task.assignee?.displayName ?? null,
            due: task.dueAt ? new Date(task.dueAt).toLocaleDateString() : null,
          },
        }))}
      />
    </div>
  );
}
