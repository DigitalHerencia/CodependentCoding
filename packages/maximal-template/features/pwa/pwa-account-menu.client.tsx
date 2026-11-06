"use client";

import { PwaAccountMenuTemplate } from "@/components/templates/pwa-templates";
import { usePwaAccountMenuWorkflow } from "@/lib/workflows/pwaClientWorkflows";

export function PwaAccountMenu() {
  const view = usePwaAccountMenuWorkflow();
  return <PwaAccountMenuTemplate {...view} />;
}
