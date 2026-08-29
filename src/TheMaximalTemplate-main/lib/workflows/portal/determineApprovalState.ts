export function determineApprovalState(
  states: Array<"PENDING" | "APPROVED" | "REJECTED">,
) {
  if (states.some((state) => state === "REJECTED")) return "REJECTED" as const;
  if (states.length > 0 && states.every((state) => state === "APPROVED"))
    return "APPROVED" as const;
  return "PENDING" as const;
}
