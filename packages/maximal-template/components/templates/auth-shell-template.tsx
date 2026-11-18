/** Auth shell template contracts and composition for the owning application slice. */
import type { AuthChildrenProps } from "@/types/authTypes";
import { AuthHeader } from "@/components/nav/auth-header";
import { AuthFooter } from "@/components/nav/auth-footer";
import { AuthShell } from "@/components/shells/auth-shell";
import {
  AuthHeaderBlock,
  AuthFooterBlock,
  AuthBrandBlock,
  AuthLogoBlock,
} from "@/components/blocks/auth-shell-blocks";

export function AuthShellTemplate({ children }: AuthChildrenProps) {
  return (
    <AuthShell
      header={
        <AuthHeader>
          <AuthHeaderBlock />
        </AuthHeader>
      }
      brand={<AuthBrandBlock />}
      logo={<AuthLogoBlock />}
      footer={
        <AuthFooter>
          <AuthFooterBlock />
        </AuthFooter>
      }
    >
      {children}
    </AuthShell>
  );
}
