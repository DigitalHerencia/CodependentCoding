import {
  DataTableBlock,
  PageHeaderBlock,
} from "@/components/blocks/application-sections";
import { getAdminMemberships } from "@/lib/fetchers/adminFetchers";

// Features orchestrate blocks and lib helpers; they never import raw UI primitives.
export async function UsersFeature() {
  const memberships = await getAdminMemberships();
  return (
    <div className="space-y-6">
      <PageHeaderBlock
        eyebrow="Administration"
        title="Users and memberships"
        description="Membership state for the active organization; user administration requires an explicit privileged capability."
      />
      <DataTableBlock
        columns={[
          { key: "name", label: "User" },
          { key: "email", label: "Email" },
          { key: "role", label: "Role" },
          { key: "status", label: "Status" },
          { key: "joined", label: "Joined" },
        ]}
        rows={memberships.map((membership) => ({
          id: membership.id,
          cells: {
            name: membership.user.displayName,
            email: membership.user.email,
            role: membership.role,
            status: membership.status,
            joined: new Date(membership.createdAt).toLocaleDateString(),
          },
        }))}
      />
    </div>
  );
}
