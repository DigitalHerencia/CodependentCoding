import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse, type NextRequest } from "next/server";

import { DEFAULT_AUTH_REDIRECT_PATH, SIGN_IN_PATH } from "@/lib/auth/redirects";
import { baseEnv } from "@/lib/utils/env";
import { isDevelopment } from "@/lib/constants/mode";

/*
 * proxy.ts only gates (CC-ROUTE-002): a signed-out visitor to a signed-in
 * page is sent to sign-in here, because those pages stream (Cache Components)
 * and a redirect thrown while rendering can no longer set a 3xx status. The
 * layouts and the data layer still check (CC-ROUTE-003); this is UX, never
 * enforcement. The root renders per request so Next.js and Clerk receive
 * the script nonce.
 *
 * Clerk hosts follow Clerk's CSP guide for @clerk/nextjs 7.9
 * (clerk.com/docs/guides/secure/best-practices/csp-headers): the Frontend API
 * host, *.protect.clerk.com (connect on any port: those hosts are not only on
 * 443), img.clerk.com and Cloudflare's challenge frame. Clerk's own default
 * directives in that version also send telemetry to clerk-telemetry.com.
 */

/** Path matchers (UX routing only; every page and data call re-checks access). */
const matches =
  (...patterns: RegExp[]) =>
  (request: NextRequest) =>
    patterns.some((pattern) => pattern.test(request.nextUrl.pathname));

const publicPages = [/^\/$/, /^\/(faq|terms|privacy|offline)\/?$/];
const clerkPages = [/^\/sign-(in|up)(\/|$)/];

const isClerkPage = matches(...clerkPages);
/** Reachable signed out: public pages, Clerk's pages, route handlers (they answer 401 themselves). */
const isSignedOutRoute = matches(
  ...publicPages,
  ...clerkPages,
  /^\/api\//,
  /^\/__clerk\//,
);

/** The Frontend API origin encoded in the publishable key (pk_<env>_<base64 "host$">). */
function clerkFrontendApi(): string | null {
  const key = baseEnv.value("NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY");
  const encoded = key?.split("_")[2];
  if (!encoded) return null;
  try {
    const host = atob(encoded).replace(/\$$/, "");
    return /^[a-z0-9.-]+$/i.test(host) ? `https://${host}` : null;
  } catch {
    return null;
  }
}

const shared = [
  "default-src 'self'",
  "object-src 'none'",
  "base-uri 'none'",
  "frame-ancestors 'none'",
  "form-action 'self'",
  "font-src 'self'",
  "manifest-src 'self'",
  "worker-src 'self' blob:",
  ...(isDevelopment ? [] : ["upgrade-insecure-requests"]),
];

export function noncePolicy(nonce: string): string {
  const fapi = clerkFrontendApi() ?? "";
  const dev = isDevelopment ? " 'unsafe-eval'" : "";
  return [
    ...shared,
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic'${dev} ${fapi} https://challenges.cloudflare.com https://*.protect.clerk.com`,
    // Clerk injects runtime CSS.
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob: https://img.clerk.com",
    `connect-src 'self' ${fapi} https://*.protect.clerk.com:* https://clerk-telemetry.com https://*.clerk-telemetry.com`,
    "frame-src 'self' https://challenges.cloudflare.com https://*.protect.clerk.com",
  ]
    .map((directive) => directive.replace(/\s+/g, " ").trim())
    .join("; ");
}

function withNonceCsp(request: NextRequest): NextResponse {
  const nonce = btoa(crypto.randomUUID());
  const policy = noncePolicy(nonce);
  const headers = new Headers(request.headers);
  headers.set("x-nonce", nonce);
  headers.set("Content-Security-Policy", policy);
  const response = NextResponse.next({ request: { headers } });
  response.headers.set("Content-Security-Policy", policy);
  return response;
}

const signedInGate = clerkMiddleware(async (auth, request) => {
  const { userId } = await auth();
  if (!userId && !isSignedOutRoute(request)) {
    return NextResponse.redirect(new URL(SIGN_IN_PATH, request.url));
  }
  if (userId && isClerkPage(request)) {
    return NextResponse.redirect(
      new URL(DEFAULT_AUTH_REDIRECT_PATH, request.url),
    );
  }
  return withNonceCsp(request);
});

export default signedInGate;

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|avif|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
    "/__clerk/(.*)",
  ],
};
