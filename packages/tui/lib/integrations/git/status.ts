// Why: asks git which files a run changed.
import { runCommand } from "@/lib/integrations/process/run-command";

export async function changedFiles(cwd: string): Promise<string> {
  const result = await runCommand("git", ["status", "--short"], cwd);
  return result.code === 0
    ? result.output.trim() || "No changes."
    : "Not a git repository.";
}
