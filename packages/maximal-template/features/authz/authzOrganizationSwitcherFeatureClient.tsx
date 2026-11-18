"use client";

/** Interactive organization switching with authorized server commands. */
import { OrganizationSwitcherTemplate } from "@/components/templates/authz-templates";
import { switchOrganizationWorkflow } from "@/lib/workflows/authzWorkflows";
import type { OrganizationSwitcherFeatureProps } from "@/types/authzTypes";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

/** Orchestrate organization selection and refresh after an authorized switch. */
export function AuthzOrganizationSwitcherFeatureClient({
  activeOrganizationId,
  organizations,
  role,
}: OrganizationSwitcherFeatureProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState("");
  return (
    <OrganizationSwitcherTemplate
      role={role}
      activeOrganizationId={activeOrganizationId}
      organizations={organizations}
      pending={pending}
      error={error}
      onOrganizationChange={(event) => {
        const organizationId = event.target.value;
        startTransition(async () => {
          setError("");
          try {
            const result = await switchOrganizationWorkflow({ organizationId });
            if (!result.ok) {
              setError("switchFailed");
              return;
            }
            // Re-enter through a route available to members of the selected workspace.
            router.replace("/dashboard");
            router.refresh();
          } catch {
            setError("switchFailed");
          }
        });
      }}
    />
  );
}
