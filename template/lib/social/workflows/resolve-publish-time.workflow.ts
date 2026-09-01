import { resolvePublishTime } from "../../social/logic/resolve-publish-time.logic";
export async function resolvePublishTimeWorkflow(
  requestedAt: Date,
  now = new Date(),
) {
  return resolvePublishTime(requestedAt, now);
}
