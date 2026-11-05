// Why: Server feature: loads one task (null means 404) and composes the detail template.
import { notFound } from "next/navigation";
import { ProjectTaskDetailTemplate } from "@/components/templates/projects-templates";
import { getProjectTask } from "@/lib/fetchers/projectsFetchers";
import { TaskFeatureClient } from "./task-feature.client";
import { getOrganizationMembers } from "@/lib/fetchers/organizationFetchers";
import { TaskStatusControl } from "./tasks-feature.client";
export async function TaskFeature({
  projectId,
  taskId,
}: {
  projectId: string;
  taskId: string;
}) {
  const task = await getProjectTask(projectId, taskId);
  if (!task) notFound();
  return (
    <ProjectTaskDetailTemplate task={task}>
      <TaskStatusControl key={task.version} task={task} />
      <TaskFeatureClient
        key={`assignment-${task.version}`}
        task={task}
        members={await getOrganizationMembers()}
      />
    </ProjectTaskDetailTemplate>
  );
}
