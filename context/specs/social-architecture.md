# Social architecture normalization

The owner-approved scope is tracked by [Issue #389](https://github.com/DigitalHerencia/CodependentCoding/issues/389).

- Keep Calendar, Compose, and Media in the tenant shell. Preserve module navigation, dashboard contributions, permissions, and record registration. Read CRM as the architectural reference.
- Compose routes through Suspense, features and RHF forms, templates, and blocks. Keep copy and primitives in blocks. Workflows call authenticated reads and commands. Use the canonical domain types, schemas, selects, DTOs, and transaction helpers.
- Create draft aggregates atomically for unique active tenant accounts. Resolve providers on the server and preserve existing UTF-16 validation limits and independently authored variant content. Bind approval to the reviewed version and save approval and scheduling audit entries atomically. Validate the existing one-minute lead time and display and group schedules in UTC.
- Read dated posts and unscheduled posts separately, with deterministic bounds. Page eligible account references and load full variant text only for a requested post revision. Display persisted lifecycle evidence and distinguish local saves from external effects. Preserve stored publication fields and media associations. Remove uncalled association and publication writers. This scope includes no executable provider integration.
- Use uploads-owned asset metadata and private storage. Reauthorize and resolve identifiers on the server, cap transfers at 10 MiB, restrict previews to the existing raster allowlist, and keep browser artifact effects in the media island.
- Confirm internal dependency boundaries and scoped consumers. Run only changed-file lint and formatting, type generation, and type checking. Author regression assertions without executing tests. No builds, migrations, seeds, runtime/provider requests, or external publication.
- Deliver through an issue-linked pull request with permitted CI. The owner confirmed that Git-triggered Vercel preview and production deployments were disabled. Verify the merge, branch cleanup, Project status, and synchronized main.
