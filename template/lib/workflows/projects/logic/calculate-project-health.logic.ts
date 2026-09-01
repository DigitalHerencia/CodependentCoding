export function calculateProjectHealth({
  overdueTasks,
  blockedTasks,
  progress,
}: {
  overdueTasks: number;
  blockedTasks: number;
  progress: number;
}) {
  if (overdueTasks > 0 || blockedTasks > 2) return "AT_RISK" as const;
  if (blockedTasks > 0 || progress < 25) return "WATCH" as const;
  return "HEALTHY" as const;
}

