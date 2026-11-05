import { Suspense } from "react";

import { ProfileFeature } from "@/features/settings/profile-feature";
import { ProfileSkeleton } from "@/features/settings/profile-skeleton";

export default async function Page() {
  return (
    <Suspense fallback={<ProfileSkeleton />}>
      <ProfileFeature />
    </Suspense>
  );
}
