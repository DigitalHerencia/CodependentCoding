# research.md — ChatGPT Archive Utility

## Decision log

1) Storage backend (production)
Decision: Use S3-compatible object storage (initial recommendation: AWS S3).
Rationale: Widely supported, well-documented SDKs, presigned URL support for edge deployments; works with Vercel serverless via presigned uploads.
Alternatives considered: DigitalOcean Spaces (compatible, cheaper), Backblaze B2 (cheaper but smaller ecosystem). Choice depends on org preferences and compliance.

2) Duplicate uploads handling
Decision: Deduplicate by checksum, present user with option to link to existing archive on conflict.
Rationale: Avoids wasted storage while providing clarity to users.
Alternatives: silent dedupe (may confuse users), always store duplicates (wasteful).

3) Webhook processing
Decision: Process Clerk webhooks synchronously for basic upserts with idempotency checks; if throughput grows, move to queued background processing.
Rationale: Simpler to implement initially; meets a 5s SLA for low-to-moderate webhook rates.

4) Tech stack confirmations
Decision: Proceed with Next.js (App Router), Prisma + Neon, Clerk for auth, Tailwind for UI. These are implementation preferences from PRD; plan remains agnostic in core spec while implementation uses them.

## Open research items (NEEDS CLARIFICATION)

- Production storage provider preference and retention policy
- Expected webhook throughput / peak rate for sizing
- Compliance requirements (GDPR/HIPAA)

## Research tasks

- Validate S3 access patterns under Vercel constraints (presigned vs server-mediated uploads)
- Evaluate uploadthing vs custom presigned URL approach for edge compatibility and resumable uploads
- Determine Neon connection pooling recommendations for serverless (prisma, connection handling)

Prepared during Phase 0 by automated plan generator.
