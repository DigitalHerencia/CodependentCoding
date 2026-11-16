import { AuthenticatedUserMenu } from "@/components/nav/authenticated-user-menu";
import { loadAuthenticatedUserMenuWorkflow } from "@/lib/workflows/authenticatedNavigationWorkflows";
import type { AuthenticatedUserMenuProps } from "@/types/authenticatedNavigationTypes";

/** The same authorized projection supplies the desktop popover and mobile panel. */
export async function AuthenticatedUserMenuFeature({
  presentation = "popover",
}: Pick<AuthenticatedUserMenuProps, "presentation">) {
  const view = await loadAuthenticatedUserMenuWorkflow();
  return <AuthenticatedUserMenu {...view} presentation={presentation} />;
}
