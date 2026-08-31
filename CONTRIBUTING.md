# Contributing

This is a personal project.

Changes should preserve the existing architecture rather than create competing abstractions for concepts the repository already owns.

## Before Changing Something

Search the existing implementation and architecture material for the semantic owner of the thing being changed.

Prefer:

1. reuse;
2. migration;
3. rename;
4. adaptation;
5. replacement only when the existing implementation cannot satisfy the requirement.

Do not introduce a second authority for an existing concept.

## Architecture

Preserve the repository grammar:

```text
Routes adapt.
Features orchestrate.
Pure presentation renders.
Fetchers read.
Actions adapt mutations.
Workflows coordinate use cases.
Schemas validate.
Authorization decides.
Transactions preserve invariants.
Integration adapters own provider mechanics.
Webhooks reconcile external truth.
```

Keep server-only behavior server-only.

Do not leak database access, authorization logic, credentials, provider secrets, or privileged operations into Client Components.

## Changes

Keep each change bounded and reviewable.

A change should have a clear outcome rather than becoming an excuse to redesign unrelated parts of the repository.

Generated architecture should remain deterministic and inspectable.

Working code should be migrated before equivalent replacements are created.

## Validation

Install dependencies with the repository package manager:

```powershell
corepack enable
corepack prepare pnpm@11.1.1 --activate
pnpm install --frozen-lockfile
```

Before considering a change complete:

```powershell
pnpm validate
```

Do not report a check as passing unless it was actually executed.

## Pull Requests

A pull request should state:

- what changed;
- why it changed;
- what architecture or product surface owns the change;
- what validation was actually executed;
- anything intentionally left unresolved.

Do not include credentials, private keys, provider secrets, production data, or private operational material in a pull request.

## License

By contributing code or documentation to this repository, you agree that your contribution may be distributed under the repository's MIT License.
