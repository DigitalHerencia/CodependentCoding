export function detectStalledDeal({
  updatedAt,
  stage,
  now = new Date(),
  staleAfterDays = 14,
}: {
  updatedAt: Date;
  stage: string;
  now?: Date;
  staleAfterDays?: number;
}) {
  if (stage === "WON" || stage === "LOST") return false;
  return now.getTime() - updatedAt.getTime() >= staleAfterDays * 86_400_000;
}

