// Why: reads the terminal app's settings file; a missing file means defaults.
import { readTextIfPresent, settingsFile } from "@/lib/db/client";
import { getWorkspaceInfo } from "@/lib/fetchers/workspaceFetchers";
import { tuiSettingsSchema } from "@/schemas/settingsSchemas";
import type { SettingsView } from "@/types/settingsTypes";

let settings: Promise<SettingsView> | undefined;

export function getSettings(): Promise<SettingsView> {
  settings ??= readSettings();
  return settings;
}

/** Drops the cached read so the next screen sees a write. */
export function forgetSettings(): void {
  settings = undefined;
}

async function readSettings(): Promise<SettingsView> {
  const file = settingsFile();
  const text = await readTextIfPresent(file);
  const { root } = await getWorkspaceInfo();
  return {
    ...tuiSettingsSchema.parse(text ? JSON.parse(text) : {}),
    root,
    file,
  };
}
