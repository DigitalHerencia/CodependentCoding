import { AccountFeature } from "@/features/crm/accountFeature";

// URL ownership stops here; orchestration is delegated to the feature.
export default async function Page({
  params,
}: {
  params: Promise<{ accountId: string }>;
}) {
  const { accountId } = await params;
  return <AccountFeature accountId={accountId} />;
}
