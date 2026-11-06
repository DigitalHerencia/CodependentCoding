import { ProjectTaskDetailTemplate } from "@/components/templates/projects-templates";
import { loadTaskWorkflow } from "@/lib/workflows/projectsWorkflows";
import { EditTaskAssignmentForm } from "./editTaskAssignmentForm";
import { EditTaskStatusForm } from "./editTaskStatusForm";

// Why: Server feature: loads one task (null means 404) and composes the detail template.

export async function TaskFeature({
  projectId,
  taskId,
}: {
  projectId: string;
  taskId: string;
}) {
  const { task, members } = await loadTaskWorkflow({ projectId, taskId });
  return (
    <ProjectTaskDetailTemplate task={task}>
      <EditTaskStatusForm key={task.version} task={task} />
      <EditTaskAssignmentForm
        key={`assignment-${task.version}`}
        task={task}
        members={members}
      />
    </ProjectTaskDetailTemplate>
  );
}
