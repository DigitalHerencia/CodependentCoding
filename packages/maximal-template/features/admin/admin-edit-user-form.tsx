import { AdminUserDetailFeature } from "./admin-user-detail-feature";
export function AdminEditUserForm({ userId }: { userId: string }) {
  return <AdminUserDetailFeature userId={userId} />;
}
