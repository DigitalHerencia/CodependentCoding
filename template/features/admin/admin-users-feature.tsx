import { PageHero } from "@/components/blocks/page-hero"
import { getAdminUsers } from "@/lib/fetchers/adminFetchers"

export async function AdminUsersFeature() {
  const users = await getAdminUsers()
  return (
    <div className="grid gap-8">
      <PageHero
        eyebrow="Application administration"
        title="Users"
        description="Application-owned user status and administrator access, read through a self-securing admin fetcher."
      />
      <div className="grid gap-3">
        {users.map((user) => (
          <article key={user.id} className="grid gap-1 border bg-card p-4 md:grid-cols-3">
            <div>
              <p className="font-medium">{user.displayName}</p>
              <p className="text-sm text-muted-foreground">{user.email ?? "No email"}</p>
            </div>
            <p className="text-sm">Status: {user.status}</p>
            <p className="text-sm">
              {user.isApplicationAdmin ? "Application admin" : "Standard user"}
            </p>
          </article>
        ))}
        {users.length === 0 ? <p className="text-muted-foreground">No users recorded.</p> : null}
      </div>
    </div>
  )
}
