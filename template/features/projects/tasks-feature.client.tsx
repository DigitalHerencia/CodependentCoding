"use client";
import { projectsRemainingCopy } from "@/content/projects";

import { useState } from "react";
import {
  ProjectTasksTemplate,
  MyTasksTemplate,
} from "@/components/templates/projects-templates";
import { ProjectTasksToolbar } from "@/components/blocks/projects-blocks";
import { TaskStatusControl } from "./task-status-form";
import type { TaskDTO } from "@/types/projectsTypes";
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
      tasks={tasks.filter((task) =>
        `${task.title} ${task.assignee?.displayName ?? ""}`
          .toLowerCase()
          .includes(query.toLowerCase()),
      )}
      toolbar={
        <ProjectTasksToolbar
          query={query}
          onQueryChange={setQuery}
          projectId={projectId}
        />
      }
      renderControls={(task) => (
        <TaskStatusControl key={`${task.id}-${task.version}`} task={task} />
      )}
    />
  );
}
