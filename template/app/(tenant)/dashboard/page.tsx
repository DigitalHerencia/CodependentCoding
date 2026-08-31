import { DashboardFeature } from "@/features/dashboard/dashboardFeature";

// URL ownership stops here; orchestration is delegated to the feature.
export default function Page() {
  return <DashboardFeature />;
}
