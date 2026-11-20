"use client";
import { MarketingErrorBlock } from "@/components/blocks/marketing-blocks";
/** Render a safe retry boundary without exposing raw server diagnostics. */
export default function MarketingError({ reset }: { reset: () => void }) {
  return <MarketingErrorBlock reset={reset} />;
}
