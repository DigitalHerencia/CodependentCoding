export function calculateAttribution(
  touchpointIds: string[],
  model: "first-touch" | "last-touch" | "linear",
) {
  if (!touchpointIds.length) return [];
  if (model === "first-touch")
    return touchpointIds.map((id, index) => ({
      id,
      credit: index === 0 ? 1 : 0,
    }));
  if (model === "last-touch")
    return touchpointIds.map((id, index) => ({
      id,
      credit: index === touchpointIds.length - 1 ? 1 : 0,
    }));
  const credit = 1 / touchpointIds.length;
  return touchpointIds.map((id) => ({ id, credit }));
}

