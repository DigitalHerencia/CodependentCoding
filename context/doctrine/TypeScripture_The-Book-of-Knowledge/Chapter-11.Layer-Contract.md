# Chapter 11: Layer Contract

**The Book of Knowledge™**

## Definition

A layer contract says what a responsibility owns, what it may know, what it may call, what may call it, how trust changes across it, and what it must never quietly absorb.

## Operational ownership

- **Fetcher:** owns reads. Protected reads authenticate/authorize, use tenant-scoped database context, explicit Prisma selects, and DTO mapping.
- **Action:** owns mutations. It validates untrusted write input, authenticates/authorizes, may read state needed by the mutation, uses tenant-scoped persistence/transaction helpers, and returns an application-safe result.
- **Workflow:** owns domain business-logic orchestration. It composes existing Actions, Fetchers, integrations, utilities, types, schemas, and other established capabilities instead of rewriting them.
- **Prisma Select:** owns the exact typed persistence projection an operation needs.
- **DTO Mapper:** owns persistence-record to application-DTO conversion.
- **Transaction Helper:** owns atomic local database facts that must succeed or fail together.
- **Integration:** owns provider-specific mechanics: client setup plus capability helpers.
- **Auth/AuthZ:** own identity and authorization respectively. RLS is database containment, not a replacement for authorization.

## Data crossing

Persistence records should not casually become application contracts. Select only what is needed, derive the persistence record shape from that select, and deliberately map it into the DTO shape that may cross the boundary.

A DTO mapper normalizes persistence into application data. Locale formatting, display labels, risk badges, and other view decisions belong to the Feature or presentation owner. Conversely, a Feature should not reinterpret authorization, lifecycle legality, money, or provider truth as presentation logic.

## Trust progression

Untrusted runtime input becomes runtime-valid through schema validation; identity is established through Auth; access is decided through AuthZ; domain/database invariants are enforced at the operation that owns them; persistence commits atomically where required; DTO mapping produces the application-facing data shape.

Every translation across that progression is explicit. Validation proves shape, authentication proves identity, tenant scope proves containment, authorization proves permission/resource access, and a DTO proves only the application data contract. None substitutes for the others.
