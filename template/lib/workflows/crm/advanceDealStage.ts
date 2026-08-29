import type { CrmDealStage } from "../../../generated/prisma/client";

const transitions: Record<CrmDealStage, readonly CrmDealStage[]> = {
  LEAD: ["QUALIFIED", "LOST"],
  QUALIFIED: ["PROPOSAL", "LOST"],
  PROPOSAL: ["NEGOTIATION", "WON", "LOST"],
  NEGOTIATION: ["WON", "LOST"],
  WON: [],
  LOST: [],
};

export function advanceDealStage(current: CrmDealStage, next: CrmDealStage) {
  if (current !== next && !transitions[current].includes(next))
    throw new Error(`A deal cannot move from ${current} to ${next}.`);
  return { stage: next, terminal: next === "WON" || next === "LOST" };
}
