const hoursByPriority = { LOW: 72, NORMAL: 24, HIGH: 8, URGENT: 2 } as const;

export function calculateSla(
  createdAt: Date,
  priority: keyof typeof hoursByPriority,
) {
  const responseHours = hoursByPriority[priority];
  return {
    firstResponseDueAt: new Date(
      createdAt.getTime() + responseHours * 3_600_000,
    ),
    resolutionDueAt: new Date(
      createdAt.getTime() + responseHours * 4 * 3_600_000,
    ),
  };
}

