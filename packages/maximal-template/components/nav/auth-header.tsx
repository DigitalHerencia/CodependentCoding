/** Semantic navigation wrapper for the auth shell. */
import type { AuthChildrenProps } from "@/types/authTypes";
/** The shell template supplies the home-link block. */
export function AuthHeader({ children }: AuthChildrenProps) {
  return <header className="auth-header">{children}</header>;
}
