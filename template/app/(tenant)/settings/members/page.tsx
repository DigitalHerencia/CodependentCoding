import { Suspense } from "react";

import { MembersFeature } from "@/features/settings/members-feature";
import { MembersSkeleton } from "@/features/settings/members-skeleton";

export default async function Page() {
  return (
    <Suspense fallback={<MembersSkeleton />}>
      <MembersFeature />
    </Suspense>
  );
}
