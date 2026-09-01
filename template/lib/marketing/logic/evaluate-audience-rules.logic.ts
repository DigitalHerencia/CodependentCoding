export type AudienceRule = {
  field: string;
  operator: "equals" | "not_equals" | "contains";
  value: string | number | boolean;
};

export function evaluateAudienceRules(
  record: Record<string, unknown>,
  rules: AudienceRule[],
) {
  return rules.every((rule) => {
    const actual = record[rule.field];
    if (rule.operator === "equals") return actual === rule.value;
    if (rule.operator === "not_equals") return actual !== rule.value;
    return typeof actual === "string" && actual.includes(String(rule.value));
  });
}

