import { Suspense } from "react";
import { SettingsMembersFeature } from "@/features/settings/settingsMembersFeature";
import { SettingsMembersSkeleton } from "@/features/settings/settingsMembersSkeleton";
import type { SettingsMembersRouteProps } from "@/types/settingsTypes";

/** Preserve the members route and isolate its authorized server projection. */
export default function Page({ searchParams }: SettingsMembersRouteProps) {
  return (
    <Suspense fallback={<SettingsMembersSkeleton />}>
      <SettingsMembersFeature criteria={searchParams} />
    </Suspense>
  );
}
