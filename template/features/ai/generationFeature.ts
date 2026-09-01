import { executeGenerationWorkflow } from "@/lib/workflows/aiWorkflows";
import type { ExecuteAiGenerationCommand } from "@/types/aiTypes";

export async function executeGenerationFeature(
  command: ExecuteAiGenerationCommand,
) {
  return executeGenerationWorkflow(command);
}
