/** Persisted line amounts and original inputs serialized as exact decimal text. */
export type InvoiceLineDTO = {
  id: string;
  position: number;
  description: string;
  quantity: string;
  unitPrice: string;
  taxRate: string;
  lineSubtotal: string;
  lineTax: string;
  lineTotal: string;
};
/** Authorized invoice detail with calendar dates and concurrency version. */
export type InvoiceDTO = {
  id: string;
  number: number;
  customerName: string;
  customerEmail: string | null;
  currency: string;
  subtotal: string;
  taxTotal: string;
  total: string;
  status: string;
  issuedAt: string | null;
  dueAt: string | null;
  paidAt: string | null;
  approvedAt: string | null;
  approvedBy: {
    displayName: string | null;
  } | null;
  version: number;
  lines: InvoiceLineDTO[];
  createdAt: string;
  updatedAt: string;
};
/** Authorized expense presentation data without receipt or membership internals. */
export type ExpenseDTO = {
  updatedAt: string;
  id: string;
  vendor: string;
  description: string | null;
  amount: string;
  currency: string;
  incurredAt: string;
  status: string;
  submitter: string | null;
};

/** Full authorized filtered scope, grouped without combining currencies or lifecycle states. */
export type InvoicingSummary = Array<{
  currency: string;
  status: string;
  count: number;
  total: string;
}>;
/** Current authorized commands; server actions independently recheck them. */
export type InvoicingPermissions = { canCreate: boolean; canUpdate: boolean };
/** Bounded page metadata counted over the full authorized filter. */
export type InvoicingPagination = {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
};
/** Validated persisted search, sorting, pagination and inclusive calendar criteria. */
export type InvoicingQuery = {
  page: number;
  pageSize: number;
  search: string;
  currency: string;
  status: string;
  sort: "created-desc" | "created-asc" | "amount-desc" | "amount-asc";
  from: string;
  to: string;
};

/** List rows exclude customer contact data and line details. */
export type InvoiceListDTO = Omit<
  InvoiceDTO,
  "customerEmail" | "lines" | "approvedBy" | "subtotal" | "taxTotal"
>;
