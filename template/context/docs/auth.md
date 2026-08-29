# Authentication and authorization

Clerk owns identity, sessions, and identity lifecycle. The application owns local users, organizations, memberships, roles, capabilities, resource policies, and workflow invariants. PostgreSQL RLS is a final tenant-containment boundary and never replaces application authorization.
