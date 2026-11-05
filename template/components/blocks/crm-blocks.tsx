"use client";
import { crmBlockCopy } from "@/content/crm";
import Link from "next/link";
import { Input } from "@/components/ui/input";
export function CrmAccountsToolbar({
  query,
  onQueryChange,
}: {
  query: string;
  onQueryChange: (value: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-3">
      <Input
        aria-label={crmBlockCopy.searchAccounts}
        value={query}
        onChange={(event) => onQueryChange(event.target.value)}
        placeholder={crmBlockCopy.searchCompanyOrIndustry}
      />
      <Link className="type-link" href="/crm/accounts/new">
        {crmBlockCopy.newAccount}
      </Link>
    </div>
  );
}
export function CrmContactsToolbar({
  query,
  onQueryChange,
  lead,
}: {
  query: string;
  onQueryChange: (value: string) => void;
  lead: boolean;
}) {
  return (
    <div className="flex flex-wrap gap-3">
      <Input
        aria-label={crmBlockCopy.searchContacts}
        placeholder={crmBlockCopy.searchPersonEmailOrAccount}
        value={query}
        onChange={(event) => onQueryChange(event.target.value)}
      />
      <Link
        className="type-link"
        href={`/crm/${lead ? "leads" : "contacts"}/new`}
      >
        {crmBlockCopy.add}
        {lead ? crmBlockCopy.lead : crmBlockCopy.contact}
      </Link>
    </div>
  );
}
