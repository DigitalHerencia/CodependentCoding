# quickstart.md — ChatGPT Archive Utility

This quickstart walks through local setup for development.

1) Install dependencies

```bash
npm install next@latest react@latest react-dom@latest typescript@latest prisma @prisma/client tailwindcss postcss autoprefixer @clerk/nextjs @clerk/backend zod @uploadthing/react @uploadthing/middleware @uploadthing/next
```

2) Tailwind setup

```bash
npx tailwindcss init -p
```

Update `tailwind.config.js` content array to:

```js
content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"]
```

3) Prisma

- create `prisma/schema.prisma` using `data-model.md` snippet
- run `npx prisma db push`

4) Env vars (create `.env` locally, do not commit)

- NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
- CLERK_SECRET_KEY=
- CLERK_PRODUCTION_WEBHOOK_SECRET=
- DATABASE_URL=
- DATABASE_URL_UNPOOLED=
- NEON_API_KEY=

5) Start dev server

```bash
npm run dev
```

6) Wrap your root layout in `<ClerkProvider>` (see README or Clerk docs)

7) Run tests (once implemented):

```bash
npm run test
```

Prepared during Phase 1 by automated plan generator.
