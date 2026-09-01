const priorityWeight: Record<string, number> = {
  URGENT: 4,
  HIGH: 3,
  NORMAL: 2,
  LOW: 1,
};
export function prioritizeTickets<
  T extends { priority: string; createdAt: Date; resolutionDueAt: Date | null },
>(tickets: T[], now = new Date()) {
  return [...tickets].sort((a, b) => {
    const score = (ticket: T) =>
      (priorityWeight[ticket.priority] ?? 0) * 1_000_000 +
      (ticket.resolutionDueAt && ticket.resolutionDueAt <= now
        ? 10_000_000
        : 0) +
      (now.getTime() - ticket.createdAt.getTime()) / 3_600_000;
    return score(b) - score(a);
  });
}

