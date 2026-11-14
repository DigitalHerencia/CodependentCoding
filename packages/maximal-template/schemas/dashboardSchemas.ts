import { z } from "zod";

/**
 * Server-side contract for a membership's dashboard preferences.
 *
 * @remarks
 * Organization and membership identifiers are never accepted from the browser.
 */
export const dashboardPreferencesSchema = z.strictObject({
  showWorkspaces: z.boolean(),
  showActivity: z.boolean(),
  compactView: z.boolean(),
});
