export function calculateMilestoneProgress(
  completedTasks: number,
  totalTasks: number,
) {
  if (completedTasks < 0 || totalTasks < 0 || completedTasks > totalTasks)
    throw new Error("Milestone task totals are invalid.");
  return totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);
}

