"use client";

/** Interactive organization switching with authorized server commands. */
import { OrganizationSwitcherTemplate } from "@/components/templates/authz-templates";
import { getOrganizationSwitcherCommandsWorkflow } from "@/lib/workflows/authzClientWorkflows";
import type { OrganizationSwitcherDTO } from "@/types/authzTypes";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

/** Orchestrate organization selection and refresh after an authorized switch. */
export function AuthzOrganizationSwitcherFeatureClient({
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
            setError("switchFailed");
            return;
          }
          router.refresh();
        });
      }}
    />
  );
}
