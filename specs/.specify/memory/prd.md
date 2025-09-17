Product Requirements Document — ChatGPT Archive Utility
===============================================

Overview
--------

ChatGPT Archive Utility (working name) is a secure web app to archive, index, and manage exported ChatGPT conversations and attachments. It will use Next.js App Router (React 19, TS5), Clerk for auth (universal login), Neon Postgres with Prisma ORM for storage, Tailwind v4 + shadcn UI for components, and a server-first architecture following React Server Components and Server Actions patterns.

Goals & Success Metrics
-----------------------

- Users can sign up and sign in using Clerk universal login (100% of flows tested).
- Clerk user lifecycle events upsert to Neon within 5s after webhook delivery (99% success rate).
- Prisma migrations run successfully against Neon unpooled URL and Prisma client generates.
- App deploys on Vercel with environment variables; production build passes.

Core Features (MVP)
-------------------

1. Authentication & user sync
   - Universal login via Clerk
   - Server webhook handler that upserts Clerk user profile to Neon via Prisma
2. Archive CRUD
   - Create, read, update, delete archived conversation metadata and attachments
   - Server Actions for mutations and validations with Zod
3. Attachments storage
   - Local uploads (dev) and S3-compatible for prod (Vercel/Edge-compatible)
4. Admin dashboard
   - List users and archive counts

Non-Functional Requirements
---------------------------

- TypeScript strict mode
- Server-first rendering; only use client components where necessary
- Clear separation: components/ (pure UI) vs features/ (business logic)
- Tests for webhook handler and core Prisma helpers
- Secrets never committed to git; Vercel/GitHub Secrets for production

Architecture & Flow
-------------------

- Browser -> Next.js App Router (RSC)
- Clerk handles auth (Universal Login) and issues webhooks to /api/clerk/webhook-handler
- Webhook handler verifies HMAC using Clerk webhook secret and upserts to Neon via Prisma
- Server Actions implement mutations for archives

Data Model (initial)
--------------------

- User
  - id: uuid
  - clerkId: string (unique)
  - email: string?
  - firstName: string?
  - lastName: string?
- Archive
  - id: uuid
  - userId: uuid -> User
  - title: string
  - content: text
  - attachments: json
  - createdAt, updatedAt

Security Considerations
-----------------------

- Verify Clerk webhook signature using timing-safe comparison
- Use principle of least privilege for Neo/Postgres roles
- Validate and sanitize all inputs with Zod
- Rate-limit webhook endpoint in front (Vercel/edge or middleware) if needed

Developer & CI/CD Notes
-----------------------

- Repo should exclude .env from commits; use .gitignore
- Vercel environment variables must be set for DATABASE_URL, DATABASE_URL_UNPOOLED, CLERK_*, NEON_API_KEY
- Use prisma migrate dev with DATABASE_URL_UNPOOLED locally; runtime uses DATABASE_URL

AI-Agent & Copilot Optimization
------------------------------

- Keep commits small and single-purpose.
- Use explicit export names and simple functions so Copilot and AI agents can generate tests and follow-ups.
- Write Server Actions under lib/actions with 'use server' directives and clear Zod schemas.
- Provide unit tests for Prisma helpers; keep test database URL in .env.test locally.

Milestones & Timeline (estimates)
--------------------------------

- Scaffolding & auth (1 day)
- Prisma schema & migrations (0.5 day)
- Webhook handler & tests (0.5 day)
- Archives CRUD (1.5 days)
- UI polish + shadcn components (1 day)

Next Steps / Immediate TODOs
--------------------------

1. Initialize git repo and add .gitignore (do not commit .env)
2. Add package.json, tsconfig, and initial Next app layout with ClerkProvider
3. Add Prisma schema and lib/prisma.ts
4. Implement webhook handler and basic user upsert test

Appendix: environment variables (required)

- DATABASE_URL (runtime pooled)
- DATABASE_URL_UNPOOLED (migration)
- NEON_API_KEY
- NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
- CLERK_SECRET_KEY
- CLERK_PRODUCTION_WEBHOOK_SECRET
- CLERK_DEVELOPMENT_WEBHOOK_SECRET

🧱 2. Project Structure & Dependencies

Install your required stack:

npm install next@latest react@latest react-dom@latest typescript@latest \
prisma @prisma/client tailwindcss postcss autoprefixer \
@clerk/nextjs @clerk/backend zod @uploadthing/react \
@uploadthing/middleware @uploadthing/next

Set up Tailwind:

npx tailwindcss init -p

Tailwind config:
Update content array to include your app paths:

content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"]

🔑 3. Clerk Setup

Sign up on Clerk.dev

Get your keys

Add to .env:

NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
CLERK_PRODUCTION_WEBHOOK_SECRET=

Wrap app in \<ClerkProvider> in layout.tsx.

🧬 4. Prisma + Neon Setup

Prisma schema:

model User {
  id        String   @id @default(uuid())
  clerkId   String   @unique
  email     String?
  firstName String?
  lastName  String?
  archives  Archive[]
}

model Archive {
  id          String   @id @default(uuid())
  userId      String
  title       String
  content     String
  attachments Json
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  user        User     @relation(fields: [userId], references: [id])
}

Then run:

npx prisma db push

🎯 5. Server Actions + RSC Setup

Inside lib/actions/archive.ts:

'use server'
import { z } from 'zod'
// define your validation schema

Structure your project like:

/lib/actions
/lib/prisma.ts
/features/archive/
/components/

📦 6. ChatGPT ZIP File Handling

Use file input with edge-compatible uploaders like uploadthing
 or build your own using S3-compatible logic with presigned URLs (since you're deploying to Vercel).

Example S3 setup:

import { PutObjectCommand } from '@aws-sdk/client-s3'

Store uploaded .zip metadata in your Archive model and parse contents using a server action.

🔐 7. Webhook Handler

At /api/clerk/webhook-handler:

export async function POST(req: Request) {
  const rawBody = await req.text()
  const sig = req.headers.get("clerk-signature")!

  const isValid = verifyClerkWebhook(rawBody, sig)
  if (!isValid) return new Response("Invalid", { status: 401 })

  const event = JSON.parse(rawBody)
  // upsert to DB via Prisma
}

🧪 8. Testing

Run prisma generate and write unit tests for:

Clerk webhook upsert

Archive CRUD logic

Server actions

📤 9. Deploy to Vercel

Don’t commit .env (you know this)
Set Vercel environment variables:

DATABASE_URL

DATABASE_URL_UNPOOLED

NEON_API_KEY

CLERK_*

Push to GitHub → link repo in Vercel.
