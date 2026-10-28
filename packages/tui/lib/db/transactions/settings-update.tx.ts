// Why: the one writer of settings.json: read, change, write to a temp file, rename (never half-written).
import { mkdir, rename, writeFile } from "node:fs/promises";
import path from "node:path";

import { readTextIfPresent, settingsFile } from "@/lib/db/client";
import { tuiSettingsSchema } from "@/schemas/settingsSchemas";
import type { TuiSettings } from "@/types/settingsTypes";

export async function updateSettingsTx(
  change: (current: TuiSettings) => TuiSettings,
): Promise<TuiSettings> {
  const file = settingsFile();
  const text = await readTextIfPresent(file);
  const next = change(tuiSettingsSchema.parse(text ? JSON.parse(text) : {}));
  await mkdir(path.dirname(file), { recursive: true });
  const temp = `${file}.${process.pid}.tmp`;
  await writeFile(temp, `${JSON.stringify(next, null, 2)}\n`);
  await rename(temp, file);
  return next;
}
