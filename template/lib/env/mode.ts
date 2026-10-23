/**
 * Build mode. Not secret and inlined by Next.js, so client and vendored
 * components may import it; every other variable lives in a server-only
 * `lib/env/<owner>.ts`.
 */
export const isDevelopment = process.env.NODE_ENV === "development";
export const isProduction = process.env.NODE_ENV === "production";
