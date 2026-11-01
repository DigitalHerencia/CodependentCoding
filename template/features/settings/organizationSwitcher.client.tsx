"use client";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { OrganizationSwitcherDTO } from "@/types/commonTypes";
import { switchOrganization } from "@/lib/actions/commonActions";
import { NativeSelect } from "@/components/ui/native-select";

export function OrganizationSwitcherClient({
  activeOrganizationId,
  organizations,
}: OrganizationSwitcherDTO) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState("");
  return (
    <div className="space-y-1">
      <label htmlFor="organization-switcher" className="eyebrow">
        Organization
      </label>
      <NativeSelect
        id="organization-switcher"
        key={activeOrganizationId}
        defaultValue={activeOrganizationId}
        disabled={pending}
        onChange={(event) => {
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
      >
        {organizations.map((organization) => (
          <option key={organization.id} value={organization.id}>
            {organization.name}
          </option>
        ))}
      </NativeSelect>
      {error && <p role="alert">{error}</p>}
    </div>
  );
}
