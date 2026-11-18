"use client";

/** Authorization controls composed exclusively from shared UI primitives. */
import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select";
import {
  settingsBlockCopy,
  settingsPresentationCopy,
} from "@/content/settings";
import type { OrganizationSwitcherBlockProps } from "@/types/authzTypes";

/** Display the authenticated caller's available organizations and switch status. */
export function OrganizationSwitcherBlock({
  activeOrganizationId,
  organizations,
  pending,
  error,
  onOrganizationChange,
}: OrganizationSwitcherBlockProps) {
  return (
    <div className="space-y-1">
      <label htmlFor="organization-switcher" className="eyebrow">
        {settingsBlockCopy.organization}
      </label>
      <NativeSelect
        id="organization-switcher"
        key={activeOrganizationId}
        defaultValue={activeOrganizationId}
        disabled={pending}
        onChange={onOrganizationChange}
      >
        {organizations.map((organization) => (
          <NativeSelectOption key={organization.id} value={organization.id}>
            {organization.name}
          </NativeSelectOption>
        ))}
      </NativeSelect>
      {error && (
        <p role="alert">
          {settingsPresentationCopy.thatOrganizationCouldNotBeOpened}
        </p>
      )}
    </div>
  );
}
