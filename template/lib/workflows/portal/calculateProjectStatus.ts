export function calculateProjectStatus({
  completedTasks,
  totalTasks,
}: {
  completedTasks: number;
  totalTasks: number;
}) {
  if (completedTasks < 0 || totalTasks < 0 || completedTasks > totalTasks)
    throw new Error("Project task totals are invalid.");
  if (totalTasks === 0) return "NOT_STARTED" as const;
  if (completedTasks === totalTasks) return "COMPLETED" as const;
  if (completedTasks === 0) return "PLANNED" as const;
  return "IN_PROGRESS" as const;
}
