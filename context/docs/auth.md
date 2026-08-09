---
title: Loaded Vibes Security and Provider Boundary
artifact: auth-security
status: active
product: Loaded Vibes
authority: source-of-truth
---

# Loaded Vibes Security and Provider Boundary

Loaded Vibes itself does not need user accounts, organization tenancy, billing, or a hosted project database for the initial product.

The CLI and stateless web configurator configure source output. They do not become an identity platform.

## Generator boundaries

- Do not request, persist, log, or transmit Clerk, Stripe, Neon, GitHub, or Vercel secrets.
- Do not automatically provision or mutate external provider resources unless a future Issue explicitly adds that user-facing capability.
- Treat recipe/config input and target paths as untrusted.
- Do not overwrite unrelated non-empty directories.
- Avoid unsafe shell interpolation.

## Generated application boundaries

Generated apps use the Loaded Vibes-owned Hipster Stack identity and authorization model:

- Clerk owns authentication/session identity.
- The application database owns local users, organizations, memberships, roles/capabilities, resource policy, and workflow authority.
- Stripe, Cloudinary, Hugging Face, and Mapbox are reached only through server-owned adapters; their credentials never become application authorization truth.
- Stripe owns provider payment state; application workflows interpret provider state.
- RLS is tenant containment defense in depth, not a replacement for application authorization.

These are fixed implementation properties of the golden application, not normal generator questions.

## Web configurator

Initial configurator state should remain client/local/stateless where practical. Do not add auth merely to save a recipe that can be copied or downloaded.
