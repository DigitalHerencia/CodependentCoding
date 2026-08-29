export function determineEscalation({
  priority,
  firstResponseDueAt,
  resolutionDueAt,
  now = new Date(),
}: {
  priority: string;
  firstResponseDueAt: Date | null;
  resolutionDueAt: Date | null;
  now?: Date;
}) {
  if (resolutionDueAt && resolutionDueAt <= now)
    return "RESOLUTION_BREACH" as const;
  if (firstResponseDueAt && firstResponseDueAt <= now)
    return "RESPONSE_BREACH" as const;
  if (priority === "URGENT") return "URGENT" as const;
  return null;
}
