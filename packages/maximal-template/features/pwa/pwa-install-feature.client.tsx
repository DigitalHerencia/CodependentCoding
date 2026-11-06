"use client";

import { PwaInstallTemplate } from "@/components/templates/pwa-templates";
import { usePwaInstallWorkflow } from "@/lib/workflows/pwaClientWorkflows";

export function PwaInstallFeature() {
  const view = usePwaInstallWorkflow();
  return <PwaInstallTemplate {...view} />;
}
