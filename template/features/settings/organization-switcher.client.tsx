"use client";
import { OrganizationSwitcherBlock } from "@/components/blocks/settings-blocks";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { OrganizationSwitcherDTO } from "@/types/commonTypes";
import { switchOrganization } from "@/lib/actions/commonActions";

export function OrganizationSwitcherClient({
  activeOrganizationId,
  organizations,
}: OrganizationSwitcherDTO) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState("");
  return (
    <OrganizationSwitcherBlock
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
            setError("That organization could not be opened.");
            return;
          }
          router.refresh();
        });
      }}
    />
  );
}
