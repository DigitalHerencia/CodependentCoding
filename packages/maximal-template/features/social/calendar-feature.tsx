import { loadCalendarWorkflow } from "@/lib/workflows/socialWorkflows";
import { CalendarFeatureClient } from "./calendar-feature.client";

export async function CalendarFeature() {
  const { posts } = await loadCalendarWorkflow();
  return <CalendarFeatureClient posts={posts} />;
}
