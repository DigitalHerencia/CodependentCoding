import { AudienceEditFeature } from "@/features/marketing/audienceEditFeature";

export default async function Page({
  params,
}: {
  params: Promise<{ audienceId: string }>;
}) {
  const { audienceId } = await params;
  return <AudienceEditFeature audienceId={audienceId} />;
}
