// Why: the apps remembered in settings, each read from its own hipster.json.
import path from "node:path";

import { readTextIfPresent } from "@/lib/db/client";
import { toGeneratedAppDTO } from "@/lib/db/dto/apps.dto";
import { getSettings } from "@/lib/fetchers/settingsFetchers";
import { hipsterJsonSchema } from "@/schemas/appsSchemas";
import type { GeneratedApp } from "@/types/appsTypes";

let apps: Promise<GeneratedApp[]> | undefined;

export function getGeneratedApps(): Promise<GeneratedApp[]> {
  apps ??= getSettings().then(({ apps: dirs }) =>
    Promise.all(dirs.map(readGeneratedApp)),
  );
  return apps;
}

export function forgetGeneratedApps(): void {
  apps = undefined;
}

export async function readGeneratedApp(dir: string): Promise<GeneratedApp> {
  const text = await readTextIfPresent(path.join(dir, "hipster.json"));
  let record: unknown = null;
  try {
    record = text ? JSON.parse(text) : null;
  } catch {
    // An unreadable hipster.json shows the app as not found.
  }
  const parsed = hipsterJsonSchema.safeParse(record);
  return toGeneratedAppDTO(dir, record && parsed.success ? parsed.data : null);
}
