"use client";

/** Settings blocks contracts and composition for the owning application slice. */
import { settingsLibraryCopy } from "@/content/settings";
import type * as React from "react";

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
