# Chapter 03: Architecture Contract

**The Book of Knowledge™**

## Definition

Architecture defines significant responsibilities, boundaries, dependency direction, trust progression, and state ownership. The directory tree is evidence of that architecture, not the architecture by itself.

## Canonical grammar

Routes adapt HTTP/framework concerns. Features orchestrate presentation. Components render. Fetchers read. Actions mutate. Schemas validate runtime input. Authentication establishes identity. Authorization decides access. Database helpers select, map, and preserve atomicity. Integrations own provider mechanics. Workflows compose existing capabilities into domain business operations.

## The `lib` idea

`lib` is the operations/infrastructure area. Calling it "server operations" is useful shorthand, but `server` would be too narrow because generic utilities, constants, and similar helpers are not inherently server-only. The physical name remains `lib`; "operations" and "infrastructure" describe what it mostly means.

## Concern-first ownership

Provider status does not decide placement by itself. Clerk belongs to authentication because identity is a first-class concern. Neon/Prisma belong to persistence because the database is a first-class concern. Other provider-specific capabilities belong under integrations.

## Domain organization

Actions, Fetchers, Workflows, Types, and Schemas are organized by business domain using predictable names. This keeps related behavior discoverable without inventing a generic service layer.

## Boundary rule

Do not duplicate lower-level behavior merely to satisfy a layer. Workflows compose established Actions, Fetchers, integrations, utilities, types, and schemas. Actions and Fetchers own their respective mutation/read boundaries. Database helpers remain database helpers.
