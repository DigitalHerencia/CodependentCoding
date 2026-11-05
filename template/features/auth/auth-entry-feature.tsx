import type { ReactNode } from "react";

import { getIdentity } from "@/lib/auth/auth";
import { redirectAfterAuth } from "@/lib/auth/redirects";

export async function AuthEntryFeature({
  children,
}: Readonly<{ children: ReactNode }>) {
  if (await getIdentity()) redirectAfterAuth();
  return children;
}
