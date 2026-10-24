// Why: Server feature: loads the {{entity}} list once and hands it to the filtering island.
import { {{Entities}}FeatureClient } from "./{{entities}}Feature.client";
import { get{{Entities}} } from "@/lib/fetchers/{{module}}Fetchers";
export async function {{Entities}}Feature() {
  return <{{Entities}}FeatureClient {{entities}}={await get{{Entities}}(100)} />;
}
