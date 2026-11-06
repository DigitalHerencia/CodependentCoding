"use client";

import { OrganizationSwitcherTemplate } from "@/components/templates/shared-templates";
import { settingsPresentationCopy } from "@/content/settings";
import { getOrganizationSwitcherCommandsWorkflow } from "@/lib/workflows/settingsClientWorkflows";
import type { OrganizationSwitcherDTO } from "@/types/commonTypes";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

export function OrganizationSwitcherFeatureClient({
  activeOrganizationId,
  organizations,
}: OrganizationSwitcherDTO) {
  const { switchOrganization } = getOrganizationSwitcherCommandsWorkflow();
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState("");
  return (
    <OrganizationSwitcherTemplate
      activeOrganizationId={activeOrganizationId}
      organizations={organizations}
      pending={pending}
      error={error}
      onOrganizationChange={(event) => {
        const organizationId = event.target.value;
        startTransition(async () => {
          setError("");
          const result = await switchOrganization({ organizationId });
          if (!result.ok) {
            setError(settingsPresentationCopy.thatOrganizationCouldNotBeOpened);
            return;
          }
          router.refresh();
        });
      }}
    />
  );
}
