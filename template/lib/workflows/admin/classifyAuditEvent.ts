export type AuditRisk = "routine" | "sensitive" | "high-risk";

export function classifyAuditEvent(action: string): AuditRisk {
  const normalized = action.toLowerCase();
  if (/(delete|revoke|role|permission|bulk|export)/.test(normalized))
    return "high-risk";
  if (/(update|approve|reject|invite|publish)/.test(normalized))
    return "sensitive";
  return "routine";
}
