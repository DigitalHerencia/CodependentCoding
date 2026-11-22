# Normalize the Maximal Template support bounded context

Delivery is tracked in [Issue #391](https://github.com/DigitalHerencia/CodependentCoding/issues/391). The owner’s support normalization request approves this scope and takes precedence over conflicting architecture guidance for support.

- Keep the existing eight tenant routes, controls, module registration, shared shell, and authenticated knowledge base. Use CRM as a read-only architecture reference.
- Route adapters provide Suspense and skeletons. Features and RHF forms compose templates and authenticated workflows. Templates compose support blocks. Blocks own primitives and presentation copy.
- Use the canonical support types, schemas, persistence helpers, RLS, fetchers and actions. Remove superseded files and inactive operations after checking their consumers.
- Derive actor, requester, author and organization from authenticated context. Preserve staff and customer relationship rules. Apply message visibility before selection, counts and serialization.
- Preserve organization-scoped atomic ticket numbering, reply append semantics, status transitions, version checks, and atomic audit entries. Preserve article slug uniqueness, editorial isolation, published reader access and optimistic updates.
- Bound and order list and conversation reads, make authorized history reachable, and aggregate the complete caller-visible active queue. Present stored deadlines and genuine queue metrics.
- Update affected test sources as needed. Execute only lint:fix, format:write, typegen and typecheck. Leave tests, builds, runtime services, seeds, migrations and provider traffic unexecuted.
- Deliver through the linked PR with fresh check evidence, merge after checks pass, clean up branches, verify main synchronization and record any unapplied migration.
