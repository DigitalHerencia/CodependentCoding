import type {
  CrmAccountDTO,
  CrmContactDTO,
  CrmDealSummaryDTO,
} from "@/types/crmTypes";

export function selectCrmAccountsWorkflow(
  accounts: CrmAccountDTO[],
  query: string,
) {
  return accounts.filter((account) =>
    `${account.name} ${account.industry ?? ""}`
      .toLowerCase()
      .includes(query.toLowerCase()),
  );
}

export function selectCrmContactsWorkflow(
  contacts: CrmContactDTO[],
  query: string,
) {
  return contacts.filter((contact) =>
    `${contact.firstName} ${contact.lastName} ${contact.email ?? ""} ${contact.account?.name ?? ""}`
      .toLowerCase()
      .includes(query.toLowerCase()),
  );
}

export function selectCrmPipelineWorkflow(
  deals: CrmDealSummaryDTO[],
  query: string,
) {
  const visible = deals.filter((deal) =>
    (
      deal.name +
      " " +
      deal.account.name +
      " " +
      (deal.owner?.displayName ?? "")
    )
      .toLowerCase()
      .includes(query.toLowerCase()),
  );
  return {
    deals: visible,
    stages: ["LEAD", "QUALIFIED", "PROPOSAL", "NEGOTIATION", "WON", "LOST"].map(
      (stage) => ({
        stage,
        items: visible.filter((deal) => deal.stage === stage),
      }),
    ),
  };
}
