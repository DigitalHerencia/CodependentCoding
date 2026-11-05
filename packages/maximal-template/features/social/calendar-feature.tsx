import { getSocialPosts } from "@/lib/fetchers/socialFetchers";
import { CalendarFeatureClient } from "./calendar-feature.client";
export async function CalendarFeature() {
  return <CalendarFeatureClient posts={await getSocialPosts()} />;
}
