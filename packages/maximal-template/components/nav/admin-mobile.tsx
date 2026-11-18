/** Reuse the established modal focus and account-menu dismissal behavior. */
import { AuthenticatedMobileNavigation } from "@/components/nav/authenticated-mobile-navigation";
import type { AdminMobileProps } from "@/types/adminTypes";
/** Blocks supply the navigation label and mobile presentation slots. */
export function AdminMobile({ title, children }: AdminMobileProps) {
  return (
    <AuthenticatedMobileNavigation title={title}>
      {children}
    </AuthenticatedMobileNavigation>
  );
}
