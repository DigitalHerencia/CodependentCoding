# Technical Requirements Document

> **Instructions for Users:**  
> This template defines the technical architecture, stack choices, and implementation details for your project. It complements the PRD by specifying HOW the system will be built. The Loaded Vibes framework will parse this document to configure DevCycles appropriately.
>
> **Fill out all required sections** marked with `[Required]`. Optional sections can be removed if not applicable.
>
> **Requirement ID Format:** Use `REQ-TECH-<NUMBER>` (e.g., `REQ-TECH-001`)

---

<!-- SECTION: metadata -->

## Document Control

| Field        | Value                        |
| ------------ | ---------------------------- |
| Product Name | [Your Product Name]          |
| Version      | 1.0.0                        |
| Last Updated | [YYYY-MM-DD]                 |
| Owner        | [Technical Lead Name]        |
| Status       | Draft / In Review / Approved |

---

<!-- SECTION: stack -->

## 1. Technology Stack [Required]

### 1.1 Core Stack

| Component          | Technology   | Version | Justification                                                |
| ------------------ | ------------ | ------- | ------------------------------------------------------------ |
| **Framework**      | Next.js      | 15.x    | React-based, server-side rendering, excellent DX             |
| **Language**       | TypeScript   | 5.x     | Type safety, better tooling, fewer runtime errors            |
| **Database**       | PostgreSQL   | 16.x    | Relational data, ACID compliance, mature ecosystem           |
| **ORM**            | Prisma       | 5.x     | Type-safe queries, excellent migrations, Next.js integration |
| **Authentication** | Clerk        | Latest  | Managed auth, pre-built UI, enterprise features              |
| **Styling**        | Tailwind CSS | 3.x     | Utility-first, fast development, small bundle                |
| **Hosting**        | Vercel       | -       | Native Next.js support, edge functions, zero config          |

### 1.2 Development Tools

| Tool                | Purpose    | Version |
| ------------------- | ---------- | ------- |
| **Package Manager** | pnpm       | 9.x     |
| **Linter**          | ESLint     | 9.x     |
| **Formatter**       | Prettier   | 3.x     |
| **Testing (Unit)**  | Vitest     | Latest  |
| **Testing (E2E)**   | Playwright | Latest  |
| **Type Checking**   | TypeScript | 5.x     |

### 1.3 Supporting Services

| Service            | Purpose                  | Required?   | Provider                  |
| ------------------ | ------------------------ | ----------- | ------------------------- |
| **Email**          | Transactional emails     | Yes         | Resend / SendGrid         |
| **File Storage**   | User uploads             | Optional    | AWS S3 / Cloudflare R2    |
| **Analytics**      | Usage tracking           | Optional    | Vercel Analytics          |
| **Error Tracking** | Exception monitoring     | Recommended | Sentry                    |
| **Logging**        | Application logs         | Optional    | Axiom / Datadog           |
| **Cache**          | Performance optimization | Optional    | Vercel KV / Upstash Redis |

**Technical Requirements:**

1. **REQ-TECH-001:** THE SYSTEM SHALL use Next.js 15 with App Router for all routes
2. **REQ-TECH-002:** THE SYSTEM SHALL enforce TypeScript strict mode across the codebase
3. **REQ-TECH-003:** THE SYSTEM SHALL use Prisma for all database operations
4. **REQ-TECH-004:** THE SYSTEM SHALL use Clerk for authentication and authorization

---

<!-- SECTION: architecture -->

## 2. System Architecture [Required]

### 2.1 Architecture Pattern

**Pattern:** Monolithic / Microservices / Serverless / Hybrid

**Chosen:** [Your choice]

**Justification:** [Why this pattern fits your project]

### 2.2 High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         Client Layer                         │
│  (Next.js React Components, Client-Side Logic)               │
└──────────────────┬──────────────────────────────────────────┘
                   │
                   │ HTTP/HTTPS
                   │
┌──────────────────▼──────────────────────────────────────────┐
│                     Application Layer                        │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐          │
│  │   Pages     │  │   API       │  │   Server    │          │
│  │   Routes    │  │   Routes    │  │   Actions   │          │
│  └─────────────┘  └─────────────┘  └─────────────┘          │
└──────────────────┬──────────────────────────────────────────┘
                   │
                   │
┌──────────────────▼──────────────────────────────────────────┐
│                      Business Logic Layer                    │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐          │
│  │  Services   │  │ Controllers │  │ Middleware  │          │
│  └─────────────┘  └─────────────┘  └─────────────┘          │
└──────────────────┬──────────────────────────────────────────┘
                   │
                   │
┌──────────────────▼──────────────────────────────────────────┐
│                       Data Access Layer                      │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐          │
│  │   Prisma    │  │   Models    │  │   Schemas   │          │
│  │   Client    │  │             │  │             │          │
│  └─────────────┘  └─────────────┘  └─────────────┘          │
└──────────────────┬──────────────────────────────────────────┘
                   │
                   │
┌──────────────────▼──────────────────────────────────────────┐
│                       Infrastructure Layer                   │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐          │
│  │ PostgreSQL  │  │  Clerk      │  │  External   │          │
│  │  Database   │  │  Auth       │  │  Services   │          │
│  └─────────────┘  └─────────────┘  └─────────────┘          │
└─────────────────────────────────────────────────────────────┘
```

### 2.3 Directory Structure

```
project-root/
├── src/
│   ├── app/                      # Next.js App Router
│   │   ├── (auth)/               # Auth-protected routes
│   │   ├── (public)/             # Public routes
│   │   ├── api/                  # API routes
│   │   └── layout.tsx            # Root layout
│   ├── components/               # React components
│   │   ├── ui/                   # Reusable UI components
│   │   └── features/             # Feature-specific components
│   ├── lib/                      # Shared utilities
│   │   ├── db.ts                 # Prisma client
│   │   ├── auth.ts               # Auth helpers
│   │   └── utils.ts              # General utilities
│   ├── services/                 # Business logic
│   ├── types/                    # TypeScript types
│   └── middleware.ts             # Next.js middleware
├── prisma/
│   ├── schema.prisma             # Database schema
│   ├── migrations/               # Migration files
│   └── seed.ts                   # Seed data
├── public/                       # Static assets
├── tests/                        # Test files
│   ├── unit/
│   ├── integration/
│   └── e2e/
├── .env                          # Environment variables
├── .env.example                  # Environment template
├── next.config.ts                # Next.js config
├── tailwind.config.ts            # Tailwind config
├── tsconfig.json                 # TypeScript config
├── package.json
└── README.md
```

**Technical Requirements:**

1. **REQ-TECH-101:** THE SYSTEM SHALL organize code using feature-based modules for maintainability
2. **REQ-TECH-102:** THE SYSTEM SHALL separate business logic from presentation logic
3. **REQ-TECH-103:** THE SYSTEM SHALL use Next.js middleware for authentication checks on protected routes

---

<!-- SECTION: database -->

## 3. Database Design [Required]

### 3.1 Database Strategy

**Type:** Relational / NoSQL / Hybrid

**Chosen:** Relational (PostgreSQL)

**Hosting:** Neon / Supabase / Railway / Vercel Postgres / Self-hosted

### 3.2 Schema Design Principles

- **Normalization:** 3NF (Third Normal Form) for transactional tables
- **Denormalization:** Strategic denormalization for read-heavy tables
- **Indexing Strategy:** Composite indexes on frequently queried columns
- **Soft Deletes:** Use `deletedAt` timestamp instead of hard deletes
- **Timestamps:** All tables include `createdAt` and `updatedAt`
- **UUIDs:** Use UUIDs for primary keys to enable distributed systems

### 3.3 Key Schema Entities

> Reference the Data Model section in your PRD. List the core entities here with technical details.

**Example:**

```prisma
model User {
  id            String    @id @default(uuid())
  email         String    @unique
  firstName     String
  lastName      String
  role          Role      @default(USER)
  emailVerified DateTime?
  image         String?
  posts         Post[]
  comments      Comment[]
  organizationId String?
  organization  Organization? @relation(fields: [organizationId], references: [id])
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  @@index([email])
  @@index([organizationId])
}

enum Role {
  ADMIN
  USER
  GUEST
}
```

### 3.4 Migration Strategy

**Approach:** Prisma Migrate (declarative)

**Workflow:**

1. Update `schema.prisma`
2. Run `prisma migrate dev --name <migration-name>`
3. Review generated SQL
4. Commit migration files to Git
5. Apply in production with `prisma migrate deploy`

**Technical Requirements:**

1. **REQ-TECH-201:** THE SYSTEM SHALL use Prisma migrations for all schema changes
2. **REQ-TECH-202:** THE SYSTEM SHALL test migrations on a staging environment before production deployment
3. **REQ-TECH-203:** THE SYSTEM SHALL implement database indexes on all foreign keys and frequently queried fields
4. **REQ-TECH-204:** THE SYSTEM SHALL use soft deletes for user-generated content (posts, comments, etc.)

### 3.5 Seed Data

**Purpose:** Provide development/testing data

**Location:** `prisma/seed.ts`

**Includes:**

- [ ] Admin user
- [ ] Test users (5-10)
- [ ] Sample content
- [ ] Reference data (categories, tags, etc.)

**Technical Requirements:**

1. **REQ-TECH-205:** THE SYSTEM SHALL provide seed scripts for local development
2. **REQ-TECH-206:** THE SYSTEM SHALL never run seed scripts in production

---

<!-- SECTION: api -->

## 4. API Design [Required]

### 4.1 API Strategy

**Type:** REST / GraphQL / tRPC / Server Actions

**Chosen:** [Your choice]

**Justification:** [Why this approach]

### 4.2 API Conventions

**URL Structure:**

- `/api/v1/[resource]` - Versioned REST APIs
- `/api/[resource]` - Unversioned internal APIs
- Server Actions for mutations from UI

**HTTP Methods:**

- `GET` - Retrieve resources
- `POST` - Create resources
- `PUT` - Update entire resource
- `PATCH` - Partial update
- `DELETE` - Delete resource

**Response Format:**

```typescript
{
  data: T | T[],
  meta?: {
    page: number,
    limit: number,
    total: number
  },
  error?: {
    code: string,
    message: string,
    details?: unknown
  }
}
```

**Status Codes:**

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `429` - Rate Limited
- `500` - Internal Server Error

### 4.3 Key Endpoints

| Method | Endpoint         | Description       | Auth Required |
| ------ | ---------------- | ----------------- | ------------- |
| POST   | /api/auth/login  | User login        | No            |
| POST   | /api/auth/signup | User registration | No            |
| GET    | /api/users/me    | Get current user  | Yes           |
| GET    | /api/posts       | List posts        | Optional      |
| POST   | /api/posts       | Create post       | Yes           |
| GET    | /api/posts/:id   | Get post by ID    | Optional      |
| PATCH  | /api/posts/:id   | Update post       | Yes (owner)   |
| DELETE | /api/posts/:id   | Delete post       | Yes (owner)   |

**Technical Requirements:**

1. **REQ-TECH-301:** THE SYSTEM SHALL version all public APIs with `/api/v1/` prefix
2. **REQ-TECH-302:** THE SYSTEM SHALL implement rate limiting on all API endpoints (100 req/min per IP)
3. **REQ-TECH-303:** THE SYSTEM SHALL validate request payloads using Zod schemas
4. **REQ-TECH-304:** THE SYSTEM SHALL return consistent error responses with `code`, `message`, and `details` fields
5. **REQ-TECH-305:** THE SYSTEM SHALL log all API requests with method, path, duration, and status code

---

<!-- SECTION: auth-technical -->

## 5. Authentication & Authorization (Technical Details) [Required]

### 5.1 Authentication Implementation

**Provider:** Clerk

**Features:**

- [ ] Email/Password
- [ ] OAuth (Google, GitHub)
- [ ] Magic Links
- [ ] Session Management
- [ ] Account Linking

**Session Management:**

- **Token Type:** JWT
- **Access Token Expiry:** 1 hour
- **Refresh Token Expiry:** 7 days
- **Storage:** HTTP-only cookies
- **Rotation:** Yes, on use

**Technical Requirements:**

1. **REQ-TECH-401:** THE SYSTEM SHALL use Clerk SDK for all authentication operations
2. **REQ-TECH-402:** THE SYSTEM SHALL store session tokens in HTTP-only, secure, same-site cookies
3. **REQ-TECH-403:** THE SYSTEM SHALL implement automatic token refresh before expiry
4. **REQ-TECH-404:** THE SYSTEM SHALL revoke all user sessions on password change

### 5.2 Authorization Implementation

**Model:** RBAC (Role-Based Access Control)

**Implementation:**

- **Role Storage:** Database (User.role field)
- **Permission Checks:** Middleware + Server Actions
- **Client-Side:** UI shows/hides based on role (not security boundary)
- **Server-Side:** Enforce on all data operations

**Middleware Example:**

```typescript
export async function requireAuth() {
  const session = await auth();
  if (!session) {
    redirect('/login');
  }
  return session;
}

export async function requireRole(role: Role) {
  const session = await requireAuth();
  if (session.user.role !== role) {
    throw new Error('Insufficient permissions');
  }
  return session;
}
```

**Technical Requirements:**

1. **REQ-TECH-405:** THE SYSTEM SHALL enforce authorization checks on the server side for all protected operations
2. **REQ-TECH-406:** THE SYSTEM SHALL never trust client-side authorization decisions
3. **REQ-TECH-407:** THE SYSTEM SHALL log all authorization failures with user ID and attempted action

---

<!-- SECTION: frontend -->

## 6. Frontend Architecture

### 6.1 Component Strategy

**Approach:** Server Components by default, Client Components when needed

**Client Component Use Cases:**

- Interactive UI (forms, modals, dropdowns)
- Browser APIs (localStorage, geolocation)
- Event handlers (onClick, onChange)
- State management (useState, useReducer)
- Effects (useEffect, useLayoutEffect)

**Server Component Benefits:**

- Zero JavaScript sent to client
- Direct database access
- Reduced bundle size
- Better SEO

### 6.2 State Management

**Strategy:** React Context / Zustand / Server State Only

**Chosen:** [Your choice]

**Justification:** [Why this approach]

**Implementation:**

- **Server State:** TanStack Query (React Query) for data fetching
- **Client State:** useState + Context for local UI state
- **URL State:** Next.js searchParams for shareable state
- **Form State:** React Hook Form with Zod validation

**Technical Requirements:**

1. **REQ-TECH-501:** THE SYSTEM SHALL use Server Components by default unless interactivity is required
2. **REQ-TECH-502:** THE SYSTEM SHALL implement optimistic updates for better UX
3. **REQ-TECH-503:** THE SYSTEM SHALL use TanStack Query for data fetching with appropriate cache strategies

### 6.3 Styling Strategy

**Framework:** Tailwind CSS

**Organization:**

- **Global Styles:** `app/globals.css`
- **Component Styles:** Tailwind classes
- **Theme:** Tailwind config with design tokens
- **Responsive:** Mobile-first with Tailwind breakpoints

**Design System:**

```typescript
// tailwind.config.ts
{
  theme: {
    extend: {
      colors: {
        primary: {...},
        secondary: {...}
      },
      spacing: {...},
      typography: {...}
    }
  }
}
```

**Technical Requirements:**

1. **REQ-TECH-504:** THE SYSTEM SHALL use Tailwind CSS for all styling
2. **REQ-TECH-505:** THE SYSTEM SHALL maintain a design system with consistent colors, spacing, and typography
3. **REQ-TECH-506:** THE SYSTEM SHALL use mobile-first responsive design

---

<!-- SECTION: testing -->

## 7. Testing Strategy [Required]

### 7.1 Testing Pyramid

```
           ┌─────────┐
           │   E2E   │  10% - Critical user journeys
           └─────────┘
         ┌─────────────┐
         │ Integration │  20% - API + Database interactions
         └─────────────┘
     ┌───────────────────┐
     │    Unit Tests      │  70% - Business logic, utilities
     └───────────────────┘
```

### 7.2 Test Types & Tools

| Test Type       | Tool                 | Coverage Goal  | Example                                |
| --------------- | -------------------- | -------------- | -------------------------------------- |
| **Unit**        | Vitest               | 80%            | Test utility functions, business logic |
| **Integration** | Vitest + Prisma Mock | 60%            | Test API routes with database          |
| **E2E**         | Playwright           | Critical paths | Test user registration flow            |
| **Visual**      | Chromatic (optional) | Key components | Test component rendering               |

### 7.3 Testing Requirements

**Technical Requirements:**

1. **REQ-TECH-601:** THE SYSTEM SHALL maintain minimum 80% code coverage for unit tests
2. **REQ-TECH-602:** THE SYSTEM SHALL have E2E tests for all critical user journeys (auth, checkout, etc.)
3. **REQ-TECH-603:** THE SYSTEM SHALL run tests automatically on every pull request
4. **REQ-TECH-604:** THE SYSTEM SHALL use test databases with seed data for integration tests
5. **REQ-TECH-605:** THE SYSTEM SHALL never run tests against production database

### 7.4 Test Organization

```
tests/
├── unit/
│   ├── lib/
│   │   └── utils.test.ts
│   └── services/
│       └── userService.test.ts
├── integration/
│   └── api/
│       └── posts.test.ts
└── e2e/
    ├── auth.spec.ts
    ├── posts.spec.ts
    └── fixtures/
        └── test-data.json
```

---

<!-- SECTION: devops -->

## 8. DevOps & Deployment [Required]

### 8.1 Environments

| Environment     | Purpose                | URL                 | Branch       |
| --------------- | ---------------------- | ------------------- | ------------ |
| **Development** | Local dev              | localhost:3000      | feature/\*   |
| **Preview**     | PR previews            | auto-generated      | \* (all PRs) |
| **Staging**     | Pre-production testing | staging.yourapp.com | develop      |
| **Production**  | Live app               | www.yourapp.com     | main         |

### 8.2 CI/CD Pipeline

**Platform:** GitHub Actions / Vercel

**Workflow:**

1. **On Pull Request:**

   - Run linter (ESLint)
   - Run type checking (TypeScript)
   - Run unit tests (Vitest)
   - Run integration tests
   - Generate preview deployment (Vercel)

2. **On Merge to Main:**

   - Run full test suite
   - Build production bundle
   - Deploy to production (Vercel)
   - Run E2E smoke tests
   - Notify team on Slack

3. **Daily (Cron):**
   - Run security audit (npm audit)
   - Check dependency updates (Renovate)

**Technical Requirements:**

1. **REQ-TECH-701:** THE SYSTEM SHALL run all tests before allowing merge to main branch
2. **REQ-TECH-702:** THE SYSTEM SHALL automatically deploy to production on merge to main
3. **REQ-TECH-703:** THE SYSTEM SHALL create preview deployments for all pull requests
4. **REQ-TECH-704:** THE SYSTEM SHALL notify team of deployment status via Slack/Discord

### 8.3 Environment Variables

**Management:** Vercel Environment Variables / Doppler

**Required Variables:**

```bash
# Database
DATABASE_URL="postgresql://..."
DIRECT_URL="postgresql://..."  # For migrations

# Auth
CLERK_SECRET_KEY="sk_..."
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_..."
CLERK_WEBHOOK_SECRET="whsec_..."

# Email
RESEND_API_KEY="re_..."

# External Services
SENTRY_DSN="https://..."
VERCEL_ANALYTICS_ID="..."

# Feature Flags
NEXT_PUBLIC_FEATURE_XYZ="true"
```

**Technical Requirements:**

1. **REQ-TECH-705:** THE SYSTEM SHALL validate required environment variables on startup
2. **REQ-TECH-706:** THE SYSTEM SHALL never commit `.env` files to version control
3. **REQ-TECH-707:** THE SYSTEM SHALL provide `.env.example` template with all required variables

### 8.4 Monitoring & Alerts

**Tools:**

- **Error Tracking:** Sentry
- **Performance Monitoring:** Vercel Analytics
- **Uptime Monitoring:** Better Uptime / UptimeRobot
- **Logs:** Vercel Logs / Axiom

**Alerts:**

- Error rate > 5% → Page on-call engineer
- Response time p95 > 1s → Investigate
- Uptime < 99.9% → Alert team
- Database connections > 80% → Scale up

**Technical Requirements:**

1. **REQ-TECH-708:** THE SYSTEM SHALL send error alerts to Slack/PagerDuty when error rate exceeds 5%
2. **REQ-TECH-709:** THE SYSTEM SHALL track Core Web Vitals (LCP, FID, CLS) and alert on degradation
3. **REQ-TECH-710:** THE SYSTEM SHALL retain logs for 30 days minimum

---

<!-- SECTION: performance-technical -->

## 9. Performance Optimization (Technical Details)

### 9.1 Next.js Optimization

**Strategies:**

- [ ] App Router with React Server Components
- [ ] Automatic code splitting per route
- [ ] Image optimization with `<Image>` component
- [ ] Font optimization with `next/font`
- [ ] Route prefetching for instant navigation
- [ ] Partial Pre-rendering (PPR) where applicable

### 9.2 Database Optimization

**Strategies:**

- [ ] Connection pooling (Prisma default: 10 connections)
- [ ] Database indexes on frequently queried fields
- [ ] Query optimization (avoid N+1 queries)
- [ ] Pagination for large result sets
- [ ] Database read replicas for read-heavy workloads (optional)

**Technical Requirements:**

1. **REQ-TECH-801:** THE SYSTEM SHALL use database connection pooling to prevent connection exhaustion
2. **REQ-TECH-802:** THE SYSTEM SHALL implement database indexes on all foreign keys and frequently queried fields
3. **REQ-TECH-803:** THE SYSTEM SHALL use `select` clauses to fetch only required fields

### 9.3 Caching Strategy

**Layers:**

- **Next.js Route Cache:** Static routes cached by default
- **React Cache:** `cache()` function for de-duplication
- **Database Cache:** Prisma query caching
- **CDN Cache:** Vercel Edge Network for static assets
- **Application Cache:** Vercel KV / Redis for user sessions, rate limiting

**Technical Requirements:**

1. **REQ-TECH-804:** THE SYSTEM SHALL implement appropriate cache headers for static assets (1 year)
2. **REQ-TECH-805:** THE SYSTEM SHALL use stale-while-revalidate for API responses where appropriate
3. **REQ-TECH-806:** THE SYSTEM SHALL implement cache invalidation on data mutations

---

<!-- SECTION: security-technical -->

## 10. Security Implementation (Technical Details)

### 10.1 Input Validation

**Strategy:** Zod schemas for all inputs

**Example:**

```typescript
import { z } from 'zod';

const CreatePostSchema = z.object({
  title: z.string().min(1).max(200),
  content: z.string().min(10).max(10000),
  published: z.boolean().default(false),
  tags: z.array(z.string()).max(10).optional(),
});

export type CreatePostInput = z.infer<typeof CreatePostSchema>;
```

**Technical Requirements:**

1. **REQ-TECH-901:** THE SYSTEM SHALL validate all user input using Zod schemas before processing
2. **REQ-TECH-902:** THE SYSTEM SHALL sanitize HTML input to prevent XSS attacks
3. **REQ-TECH-903:** THE SYSTEM SHALL use parameterized queries (Prisma) to prevent SQL injection

### 10.2 Security Headers

**Implementation:** Next.js middleware + `next.config.ts`

```typescript
// next.config.ts
const securityHeaders = [
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on',
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains',
  },
  {
    key: 'X-Frame-Options',
    value: 'SAMEORIGIN',
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff',
  },
  {
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin',
  },
  {
    key: 'Content-Security-Policy',
    value: "default-src 'self'; script-src 'self' 'unsafe-inline'; ...",
  },
];
```

**Technical Requirements:**

1. **REQ-TECH-904:** THE SYSTEM SHALL implement all OWASP recommended security headers
2. **REQ-TECH-905:** THE SYSTEM SHALL enforce HTTPS in production (HSTS header)
3. **REQ-TECH-906:** THE SYSTEM SHALL implement Content Security Policy to prevent XSS

### 10.3 Rate Limiting

**Implementation:** Vercel KV + Upstash Ratelimit

```typescript
import { Ratelimit } from '@upstash/ratelimit';
import { kv } from '@vercel/kv';

const ratelimit = new Ratelimit({
  redis: kv,
  limiter: Ratelimit.slidingWindow(100, '1 m'),
});

export async function checkRateLimit(identifier: string) {
  const { success, limit, remaining } = await ratelimit.limit(identifier);
  return { success, limit, remaining };
}
```

**Technical Requirements:**

1. **REQ-TECH-907:** THE SYSTEM SHALL implement rate limiting on all public API endpoints (100 req/min per IP)
2. **REQ-TECH-908:** THE SYSTEM SHALL implement stricter rate limiting on auth endpoints (10 req/min per IP)
3. **REQ-TECH-909:** THE SYSTEM SHALL return 429 status code with Retry-After header when rate limit exceeded

---

<!-- SECTION: dependencies -->

## 11. Dependencies & Constraints

### 11.1 Core Dependencies

**Production:**

```json
{
  "@clerk/nextjs": "^5.0.0",
  "@prisma/client": "^5.0.0",
  "next": "15.0.0",
  "react": "^19.0.0",
  "react-dom": "^19.0.0",
  "zod": "^3.22.0"
}
```

**Development:**

```json
{
  "@types/node": "^20.0.0",
  "@types/react": "^19.0.0",
  "eslint": "^9.0.0",
  "prettier": "^3.0.0",
  "prisma": "^5.0.0",
  "typescript": "^5.0.0",
  "vitest": "^1.0.0"
}
```

### 11.2 Technical Constraints

**Browser Support:**

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

**Device Support:**

- Desktop (1920x1080 minimum)
- Tablet (768x1024)
- Mobile (375x667 minimum)

**Network Requirements:**

- Minimum 3G connection
- Graceful degradation on poor connectivity

**Technical Requirements:**

1. **REQ-TECH-1001:** THE SYSTEM SHALL support the latest 2 major versions of Chrome, Firefox, Safari, and Edge
2. **REQ-TECH-1002:** THE SYSTEM SHALL be fully responsive on screen sizes from 375px to 1920px wide
3. **REQ-TECH-1003:** THE SYSTEM SHALL degrade gracefully on slow/unstable network connections

---

<!-- SECTION: migration -->

## 12. Migration & Deployment Plan [Optional]

> Fill this out if migrating from an existing system

### 12.1 Data Migration

**Source System:** [Legacy system name]

**Target System:** [New system name]

**Migration Strategy:**

- [ ] Export data from source
- [ ] Transform data to new schema
- [ ] Validate data integrity
- [ ] Import to target database
- [ ] Verify migration success
- [ ] Rollback plan

**Technical Requirements:**

1. **REQ-TECH-1101:** THE SYSTEM SHALL migrate all user data without loss
2. **REQ-TECH-1102:** THE SYSTEM SHALL validate data integrity post-migration with automated tests

### 12.2 Deployment Strategy

**Approach:** Blue-Green / Rolling / Canary

**Chosen:** [Your choice]

**Rollback Plan:**

1. Detect deployment issue
2. Revert to previous deployment
3. Notify team
4. Investigate root cause

---

<!-- SECTION: glossary-technical -->

## 13. Technical Glossary

| Term                 | Definition                                                                    |
| -------------------- | ----------------------------------------------------------------------------- |
| **Server Component** | React component that runs on the server and sends HTML to the client          |
| **Server Action**    | Server-side function that can be called from client components                |
| **Middleware**       | Code that runs before a request is completed (Next.js)                        |
| **ORM**              | Object-Relational Mapping - Prisma maps database tables to TypeScript objects |
| **JWT**              | JSON Web Token - self-contained authentication token                          |
| **CSP**              | Content Security Policy - HTTP header to prevent XSS attacks                  |
| **HSTS**             | HTTP Strict Transport Security - forces HTTPS connections                     |
| **[Your Term]**      | [Your definition]                                                             |

---

## 14. Validation Checklist

Before submitting this Technical Requirements document, ensure:

- [ ] All required sections are filled out
- [ ] Technology stack is clearly defined with versions
- [ ] Architecture diagram is included
- [ ] Database schema is defined or referenced
- [ ] API endpoints are documented
- [ ] Authentication and authorization strategy is clear
- [ ] Testing strategy is comprehensive
- [ ] CI/CD pipeline is defined
- [ ] Performance optimization strategies are included
- [ ] Security measures are comprehensive
- [ ] All technical requirements follow EARS syntax where applicable
- [ ] No sensitive information (API keys, passwords, connection strings) is included
- [ ] Document has been reviewed by technical lead

---

**End of Technical Requirements Template**

> After filling out this template, save it as `.project-spec/TECH-REQUIREMENTS.md` in your project root. The Loaded Vibes framework will parse this document alongside your PRD during the Initialization DevCycle.
