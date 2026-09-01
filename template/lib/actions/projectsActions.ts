"use server";

import { createProjectWorkflow, createTaskWorkflow } from "../projects/workflows/projectWorkflows";
import { advanceTaskStateWorkflow } from "../projects/workflows/advance-task-state.workflow";

export async function createProject(input: unknown) { return createProjectWorkflow(input); }
export async function createTask(input: unknown) { return createTaskWorkflow(input); }
export async function updateTaskStatus(input: unknown) { return advanceTaskStateWorkflow(input); }
