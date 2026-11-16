"use client";

import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select";
import { settingsBlockCopy, settingsLibraryCopy } from "@/content/settings";
import type { OrganizationSwitcherDTO } from "@/types/commonTypes";
import type * as React from "react";
import type { ChangeEvent } from "react";

export function OrganizationSwitcherBlock({
  activeOrganizationId,
  organizations,
  pending,
  error,
  onOrganizationChange,
}: {
  activeOrganizationId: string;
  organizations: OrganizationSwitcherDTO["organizations"];
  pending: boolean;
  error: string;
  onOrganizationChange: (event: ChangeEvent<HTMLSelectElement>) => void;
}) {
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
      {error && <p role="alert">{error}</p>}
    </div>
  );
}

export { InvitationsBlock } from "@/components/blocks/invitation-blocks";

export function SettingsSurface({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children?: React.ReactNode;
}) {
  return (
    <section className="space-y-4 border border-border bg-[#0b0f12] p-4">
      <div className="border-b border-border pb-3">
        <h2 className="font-mono text-lg font-black text-foreground">
          {title}
        </h2>
        <p className="mt-1 font-mono text-xs text-[#9dc0c8]">{description}</p>
      </div>
      {children ?? (
        <p className="font-mono text-xs text-[#9dc0c8]">
          {
            settingsLibraryCopy.settingsAreLoadedFromTheAuthoritativeServerWorkflow
          }
        </p>
      )}
    </section>
  );
}
