import type { CrmDealStage } from "@/types/crmTypes";

const dealStageTransitions: Record<CrmDealStage, readonly CrmDealStage[]> = {
  LEAD: ["QUALIFIED", "LOST"],
  QUALIFIED: ["PROPOSAL", "LOST"],
  PROPOSAL: ["NEGOTIATION", "WON", "LOST"],
  NEGOTIATION: ["WON", "LOST"],
  WON: [],
  LOST: ["QUALIFIED"],
};

export function advanceDealStage(current: CrmDealStage, next: CrmDealStage) {
  if (current !== next && !dealStageTransitions[current].includes(next)) {
    throw new Error(`A deal cannot move from ${current} to ${next}.`);
  }
  return { stage: next, terminal: next === "WON" || next === "LOST" };
}
