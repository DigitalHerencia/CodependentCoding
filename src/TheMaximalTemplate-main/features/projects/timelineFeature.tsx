import {
  PageHeaderBlock,
  TimelineBlock,
} from "@/components/blocks/application-sections";
import { getProjectTasks } from "@/lib/fetchers/projectsFetchers";

export async function TimelineFeature({ projectId }: { projectId: string }) {
  const tasks = await getProjectTasks(projectId);
  const ordered = [...tasks].sort((a, b) =>
    (a.dueAt ?? "9999").localeCompare(b.dueAt ?? "9999"),
  );
  return (
    <div className="space-y-6">
      <PageHeaderBlock eyebrow="Projects" title="Delivery timeline" />
      <TimelineBlock
        items={ordered.map((task) => ({
          id: task.id,
          title: task.title,
          detail: `${task.status} · ${task.priority}`,
          timestamp: task.dueAt
            ? new Date(task.dueAt).toLocaleDateString()
            : "No due date",
        }))}
      />
    </div>
  );
}
