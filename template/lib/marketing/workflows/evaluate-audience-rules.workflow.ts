import type { AudienceRule } from "../../marketing/logic/evaluate-audience-rules.logic";
import { evaluateAudienceRules } from "../../marketing/logic/evaluate-audience-rules.logic";

export async function evaluateAudienceRulesWorkflow(
  record: Record<string, unknown>,
  rules: AudienceRule[],
) {
  return evaluateAudienceRules(record, rules);
}
