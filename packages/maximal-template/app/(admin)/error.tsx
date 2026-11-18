"use client";
/** Route-group retry boundary never renders private error details. */
import { AdminErrorBlock } from "@/components/blocks/admin-blocks";
import type { AdminErrorProps } from "@/types/adminTypes";
/** Forward only the framework retry callback into presentation. */
export default function AdminError({ reset }: AdminErrorProps) {
  return <AdminErrorBlock reset={reset} />;
}
