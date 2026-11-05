export function roundCurrency(value: number) {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

export function formatMoney(
  amount: number | string,
  currency: string,
  locale = "en",
) {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
  }).format(Number(amount));
}

export function assertSameCurrency(left: string, right: string) {
  if (left !== right) {
    throw new Error(
      `Currency mismatch: ${left} cannot be combined with ${right}.`,
    );
  }
}

/** Convert decimal text to fixed-point units without floating-point rounding. */
export function decimalToUnits(value: string, scale: number): bigint {
  const unit = 10n ** BigInt(scale);
  const negative = value.startsWith("-");
  const [whole = "0", fraction = ""] = value.replace(/^[-+]/, "").split(".");
  const units =
    BigInt(whole || "0") * unit +
    BigInt(fraction.padEnd(scale, "0").slice(0, scale) || "0");
  return negative ? -units : units;
}

/** Format fixed-point units as decimal text without insignificant trailing zeros. */
export function unitsToDecimal(units: bigint, scale: number): string {
  const unit = 10n ** BigInt(scale);
  const sign = units < 0n ? "-" : "";
  const abs = units < 0n ? -units : units;
  const fraction = (abs % unit)
    .toString()
    .padStart(scale, "0")
    .replace(/0+$/, "");
  return `${sign}${abs / unit}${fraction ? `.${fraction}` : ""}`;
}
