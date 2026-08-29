# Data model

Local User, Organization, Membership, Invitation, Project, billing, Connect, webhook-ledger, media, and location records are application state. Tenant-owned rows carry explicit `organizationId`; protected operations use transaction-local tenant context under pooled connections.
