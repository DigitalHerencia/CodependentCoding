"use client";

/** Authorization controls composed exclusively from shared UI primitives. */
import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select";
import { useId } from "react";
import { authzCopy } from "@/content/authz";
import type { OrganizationSwitcherBlockProps } from "@/types/authzTypes";

/** Display the authenticated caller's available organizations and switch status. */
export function OrganizationSwitcherBlock({
  role,
  activeOrganizationId,
  organizations,
  pending,
  error,
  onOrganizationChange,
}: OrganizationSwitcherBlockProps) {
  const id = useId();
  return (
    <div className="space-y-1">
      <p className="text-sm">
        {authzCopy.role}: {role}
      </p>
      <label htmlFor={id} className="eyebrow">
        {authzCopy.organization}
      </label>
      <NativeSelect
        id={id}
        key={activeOrganizationId}
        value={activeOrganizationId}
        disabled={pending || organizations.length < 2}
        onChange={onOrganizationChange}
      >
        {organizations.map((organization) => (
          <NativeSelectOption key={organization.id} value={organization.id}>
            {organization.name}
          </NativeSelectOption>
        ))}
      </NativeSelect>
      {error && <p role="alert">{authzCopy.switchFailed}</p>}
    </div>
  );
}
