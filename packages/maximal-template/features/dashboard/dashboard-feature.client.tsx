"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { DashboardPreferencesBlock } from "@/components/blocks/dashboard-blocks";
import { dashboardCopy } from "@/content/dashboard";
import { saveDashboardPreferences } from "@/lib/actions/dashboardActions";
import type { DashboardPreferencesDTO } from "@/types/dashboardTypes";

/** Browser-only orchestration for editing the signed-in member's preferences. */
export function DashboardFeatureClient({
  initialPreferences,
}: {
  initialPreferences: DashboardPreferencesDTO;
}) {
  const router = useRouter();
  const [preferences, setPreferences] = useState(initialPreferences);
  const [savedPreferences, setSavedPreferences] = useState(initialPreferences);
  const [message, setMessage] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const dirty =
    preferences.showWorkspaces !== savedPreferences.showWorkspaces ||
    preferences.showActivity !== savedPreferences.showActivity ||
    preferences.compactView !== savedPreferences.compactView;

  function save() {
    startTransition(async () => {
      const result = await saveDashboardPreferences(preferences);
      if (result.ok) {
        setSavedPreferences(result.data);
        setPreferences(result.data);
        setMessage(dashboardCopy.saved);
        router.refresh();
      } else {
        setMessage(result.error.message);
      }
    });
  }

  return (
    <DashboardPreferencesBlock
      preferences={preferences}
      onChange={(next) => {
        setPreferences(next);
        setMessage(null);
      }}
      onSave={save}
      pending={pending}
      dirty={dirty}
      message={message}
    />
  );
}
