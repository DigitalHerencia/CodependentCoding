// components/auth/auth-header.tsx

import { AuthNavLinks } from "@/components/nav/auth-nav-links";
export function AuthHeader() {
  return (
    <header className="px-6 py-6 md:px-12">
      <AuthNavLinks />
    </header>
  );
}
