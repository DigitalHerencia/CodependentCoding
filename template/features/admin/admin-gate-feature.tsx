import { notFound } from "next/navigation";
import type { ReactNode } from "react";

import { canAccessAdmin } from "@/lib/fetchers/adminFetchers";

export async function AdminGateFeature({
  children,
}: Readonly<{ children: ReactNode }>) {
  if (!(await canAccessAdmin())) notFound();
  return children;
}
