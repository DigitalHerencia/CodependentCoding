export function MembersFeature() {
  return (
    <section className="space-y-4 border-3 border-foreground bg-card p-6">
      <div>
        <p className="text-sm font-semibold uppercase tracking-widest">
          Application-owned access
        </p>
        <h1 className="mt-1 text-2xl font-bold">Members & roles</h1>
      </div>
      <p className="max-w-2xl text-sm text-muted-foreground">
        Membership management belongs to the application database, not Clerk
        Organizations.
      </p>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[
          ["Owner", "Full workspace control"],
          ["Admin", "Administrative access"],
          ["Member", "Standard product access"],
          ["Viewer", "Read-only access"],
        ].map(([role, description]) => (
          <article key={role} className="border-2 border-foreground p-4">
            <h2 className="font-semibold">{role}</h2>
            <p className="mt-1 text-sm text-muted-foreground">{description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
