"use server";

import { createProjectWorkflow, createTaskWorkflow, updateTaskStatusWorkflow } from "../projects/workflows/projectWorkflows";

export async function createProject(input: unknown) { return createProjectWorkflow(input); }
export async function createTask(input: unknown) { return createTaskWorkflow(input); }
export async function updateTaskStatus(input: unknown) { return updateTaskStatusWorkflow(input); }
