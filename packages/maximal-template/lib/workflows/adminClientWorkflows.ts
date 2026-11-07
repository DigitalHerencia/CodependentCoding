export function getAdminAuditNavigationWorkflow(query: string) {
  return "/admin/audit?" + new URLSearchParams({ query }).toString();
}
export function getAdminUsersNavigationWorkflow(query: string) {
  return "/admin/users?" + new URLSearchParams({ query }).toString();
}
