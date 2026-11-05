"use client";
import { settingsLibraryCopy } from "@/content/settings";

import { settingsBlockCopy } from "@/content/settings";
import { NativeSelect } from "@/components/ui/native-select";

import type { OrganizationSwitcherDTO } from "@/types/commonTypes";
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
          <option key={organization.id} value={organization.id}>
            {organization.name}
          </option>
        ))}
      </NativeSelect>
      {error && <p role="alert">{error}</p>}
    </div>
  );
}
import { Button } from "@/components/ui/button";

import type { InvitationDTO } from "@/types/commonTypes";

export function InvitationsBlock({
  invitations,
  pending,
  error,
  onRevoke,
}: {
  invitations: InvitationDTO[];
  pending: boolean;
  error: string;
  onRevoke: (invitationId: string) => void | Promise<void>;
}) {
  if (invitations.length === 0) return <p>{settingsBlockCopy.noInvitations}</p>;
  return (
    <div className="space-y-2">
      <ul className="divide-y divide-border border border-border">
        {invitations.map((invitation) => (
          <li
            className="flex flex-wrap items-center justify-between gap-2 p-3"
            key={invitation.id}
          >
            <span>
              {invitation.email} {settingsBlockCopy.separator} {invitation.role}{" "}
              {settingsBlockCopy.expires}{" "}
              {new Date(invitation.expiresAt).toLocaleDateString()}
            </span>
            <Button
              disabled={pending}
              onClick={() => onRevoke(invitation.id)}
              type="button"
              variant="outline"
            >
              {settingsBlockCopy.revoke}
            </Button>
          </li>
        ))}
      </ul>
      {error && <p role="alert">{error}</p>}
    </div>
  );
}

import type * as React from "react";
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
