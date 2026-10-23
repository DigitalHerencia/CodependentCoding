import "server-only";

import type { CrmDealSummaryDTO } from "@/types/crmTypes";

// Deal values are Decimal(19, 4); weighting by a whole percentage adds two places.
const SCALE = 6;
const UNIT = 10n ** BigInt(SCALE);

function toUnits(value: string) {
  const negative = value.startsWith("-");
  const [whole = "0", fraction = ""] = value.replace(/^[-+]/, "").split(".");
  const units =
    BigInt(whole || "0") * UNIT +
    BigInt(fraction.padEnd(SCALE, "0").slice(0, SCALE) || "0");
  return negative ? -units : units;
}

function fromUnits(units: bigint) {
  const sign = units < 0n ? "-" : "";
  const abs = units < 0n ? -units : units;
  const fraction = (abs % UNIT)
    .toString()
    .padStart(SCALE, "0")
    .replace(/0+$/, "");
  return `${sign}${abs / UNIT}${fraction ? `.${fraction}` : ""}`;
}

export function calculatePipelineValue(
  deals: ReadonlyArray<
    Pick<CrmDealSummaryDTO, "value" | "probability" | "stage">
  >,
) {
  const total = deals.reduce(
    (sum, deal) =>
      deal.stage === "LOST"
        ? sum
        : sum + (toUnits(deal.value) * BigInt(deal.probability)) / 100n,
    0n,
  );
  return fromUnits(total);
}
