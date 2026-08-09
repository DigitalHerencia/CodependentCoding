# Architecture

React Server Components are the default. Protected data moves through self-securing fetchers with explicit selects and DTO mappers. Browser mutations enter thin Server Actions, continue through named workflows, and persist through transaction helpers. Presentation layers never import Prisma or provider SDKs.
