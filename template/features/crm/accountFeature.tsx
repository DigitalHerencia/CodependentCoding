import {
  EmptyStateBlock,
  PageHeaderBlock,
  RecordDetailBlock,
} from "@/components/blocks/application-sections";
import { getCrmAccount } from "@/lib/fetchers/crmFetchers";

export async function AccountFeature({ accountId }: { accountId: string }) {
  const account = await getCrmAccount(accountId);
  if (!account)
    return (
      <EmptyStateBlock
        title="Account not found"
        description="No visible account matches this identifier in the active organization."
      />
    );
  return (
    <div className="space-y-6">
      <PageHeaderBlock eyebrow="CRM account" title={account.name} />
      <RecordDetailBlock
        title="Account details"
        status={account.status}
        items={[
          { label: "Industry", value: account.industry ?? "—" },
          { label: "Website", value: account.website ?? "—" },
          { label: "Contacts", value: String(account.contactCount) },
          { label: "Deals", value: String(account.dealCount) },
          { label: "Notes", value: account.notes ?? "—" },
        ]}
      />
    </div>
  );
}
