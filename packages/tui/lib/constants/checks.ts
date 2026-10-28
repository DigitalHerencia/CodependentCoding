// Why: the template checks the Check screen runs, in order (validation.yaml `template` profile).
import type { CheckDefinition } from "@/types/checksTypes";

export const templateChecks: readonly CheckDefinition[] = [
  { id: "format", label: "Format", script: "format:check" },
  { id: "lint", label: "Lint (doctrine)", script: "lint" },
  { id: "typecheck", label: "Types", script: "typecheck" },
  { id: "modules", label: "Module manifest", script: "check:modules" },
  { id: "ownership", label: "File ownership", script: "check:ownership" },
];
