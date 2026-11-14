"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { DashboardPreferencesBlock } from "@/components/blocks/dashboard-blocks";
import { dashboardCopy } from "@/content/dashboard";
import type {
  DashboardPreferencesDTO,
  DashboardSavePreferencesAction,
} from "@/types/dashboardTypes";

/** Client-only interaction; the server feature supplies its Server Action. */
export function DashboardFeatureClient({
  initialPreferences,
  savePreferences,
}: {
  initialPreferences: DashboardPreferencesDTO;
  savePreferences: DashboardSavePreferencesAction;
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
      const result = await savePreferences(preferences);
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
