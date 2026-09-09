import { getSocialPosts } from "@/lib/fetchers/socialFetchers";
import { CalendarFeatureClient } from "./calendarFeature.client";
export async function CalendarFeature() {
  return <CalendarFeatureClient posts={await getSocialPosts()} />;
}
