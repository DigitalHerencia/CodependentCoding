// Why: Server feature: loads the project workspace (null means 404) for the task board.
import { notFound } from "next/navigation";
import { TasksFeatureClient } from "./tasksFeature.client";
import { getProjectWorkspaceWorkflow } from "@/lib/workflows/projectsWorkflows";
export async function TasksFeature({ projectId }: { projectId: string }) {
  const workspace = await getProjectWorkspaceWorkflow(projectId);
  if (!workspace) notFound();
  const { project, tasks } = workspace;
  return (
    <TasksFeatureClient
      tasks={tasks}
      projectId={projectId}
      title={`${project.name} · Task board`}
    />
  );
}
