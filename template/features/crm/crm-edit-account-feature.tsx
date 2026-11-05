import { notFound } from "next/navigation";
import { getCrmAccount } from "@/lib/fetchers/crmFetchers";
import { CrmNewAccountForm } from "./crm-new-account-form";
export async function CrmEditAccountFeature({
  accountId,
}: {
  accountId: string;
}) {
  const account = await getCrmAccount(accountId);
  if (!account) notFound();
  return <CrmNewAccountForm account={account} />;
}
