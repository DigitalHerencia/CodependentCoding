import { AudienceEditForm } from "@/features/marketing/audienceEditForm";

export default async function Page({
  params,
}: {
  params: Promise<{ audienceId: string }>;
}) {
  const { audienceId } = await params;
  return <AudienceEditForm audienceId={audienceId} />;
}
