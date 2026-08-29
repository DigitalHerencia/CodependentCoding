import type { CrmDealStage, Prisma } from "../../../generated/prisma/client";

import { crmDealDetailSelect } from "../selects/crmSelects";
import { ConcurrencyConflictError } from "./errors";
import { advanceDealStage } from "../../workflows/crm/advanceDealStage";

export async function updateDealStageTx(
  tx: Prisma.TransactionClient,
  input: {
    organizationId: string;
    dealId: string;
    stage: CrmDealStage;
    expectedVersion: number;
  },
) {
  const current = await tx.crmDeal.findFirstOrThrow({
    where: { id: input.dealId, organizationId: input.organizationId },
    select: { stage: true },
  });
  const transition = advanceDealStage(current.stage, input.stage);

  const result = await tx.crmDeal.updateMany({
    where: {
      id: input.dealId,
      organizationId: input.organizationId,
      version: input.expectedVersion,
    },
    data: {
      stage: input.stage,
      closedAt: transition.terminal ? new Date() : null,
      version: {
        increment: 1,
      },
    },
  });

  if (result.count !== 1) {
    throw new ConcurrencyConflictError("CRM deal");
  }

  return tx.crmDeal.findFirstOrThrow({
    where: {
      id: input.dealId,
      organizationId: input.organizationId,
    },
    select: crmDealDetailSelect,
  });
}
