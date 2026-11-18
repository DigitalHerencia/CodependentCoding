/** Pagination limit shared by authorized admin reads. */
export const ADMIN_PAGE_SIZE = 50;
/** Routine administration cannot grant ownership. */
export const adminAssignableRoles = ["ADMIN", "MEMBER", "VIEWER"] as const;
