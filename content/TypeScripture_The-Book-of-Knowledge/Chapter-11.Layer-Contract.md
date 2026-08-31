# Chapter 11: Layer Contract

**The Book of Knowledge™**

## Definition

- A layer contract states what a responsibility owns, what it may know, who may call it, what it may call, how trust changes across it, what side effects it may perform, and what it must never do.

## Trust progression

- Untrusted → runtime-valid → authenticated → authorized → domain-valid → persistence-ready → committed → transport-safe. Each transition has an owner.

## Hard boundaries

- Page/Layout → Feature and presentation only. No protected Fetcher/Action shortcuts.
- Feature → Fetcher(s), action references, Blocks/Primitives. No Prisma/provider SDK.
- Fetcher → auth/authz + scoped DB primitives + selects/mappers. Read-only.
- Server Action → schema + Actor + Workflow + framework effects. No Prisma/provider SDK.
- Workflow → policies + DB primitives/transactions + integrations. No Next.js framework effects.
- Policy → pure facts only.
- Integration → provider mechanics only; no product authorization.

## Data crossing

- Persistence records stay inside data boundaries. DTOs cross into Features/Components/clients. Provider objects stay inside integrations/webhooks. Dates serialize explicitly; money uses integer minor units plus currency; big/decimal values use explicit transport forms.
