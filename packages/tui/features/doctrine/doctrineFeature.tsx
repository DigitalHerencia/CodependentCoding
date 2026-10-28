// Why: loads the doctrine once and hands it to the keyboard companion.
import { use } from "react";

import { DoctrineFeatureClient } from "@/features/doctrine/doctrineFeature.client";
import { getDoctrineSummary } from "@/lib/fetchers/doctrineFetchers";

export function DoctrineFeature() {
  const { layers, rules } = use(getDoctrineSummary());
  return <DoctrineFeatureClient layers={layers} rules={rules} />;
}
