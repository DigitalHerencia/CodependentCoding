"use client";

import {
  MyTasksTemplate,
  ProjectTasksTemplate,
} from "@/components/templates/projects-templates";
import { projectsRemainingCopy } from "@/content/projects";
import { selectTasksWorkflow } from "@/lib/workflows/projectsClientWorkflows";
import type { TaskDTO } from "@/types/projectsTypes";
import { useState } from "react";
import { EditTaskStatusForm } from "./editTaskStatusForm";

export function TasksFeatureClient({
  tasks,
  projectId,
  personal = false,
  title = projectsRemainingCopy.taskBoard,
}: {
  tasks: TaskDTO[];
  projectId?: string;
  personal?: boolean;
  title?: string;
}) {
  const [query, setQuery] = useState("");
  const Template = personal ? MyTasksTemplate : ProjectTasksTemplate;
  return (
    <Template
      title={title}
      {...selectTasksWorkflow(tasks, query)}
      toolbarProps={{
        query: query,
        onQueryChange: setQuery,
        projectId: projectId,
      }}
      renderControls={(task) => (
        <EditTaskStatusForm key={`${task.id}-${task.version}`} task={task} />
      )}
    />
  );
}
