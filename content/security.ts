// Owner-approved public page copy; preserve wording.

import { siteOperator } from "@/content/public";

export const securityDisclosure = {
  contact:
    "https://github.com/DigitalHerencia/CodependentCoding/security/advisories/new",
  expires: "2027-10-31T23:59:59Z",
  policy: siteOperator.securityUrl,
  canonical: "https://codependentcoding.vercel.app/.well-known/security.txt",
} as const;

export const securityCopy = {
  kicker: "On security",
  title: "We take security very seriously.",
  lines: [
    "Our policies do not put users' data at risk.",
    "Their PII already got leaked... just not by us.",
  ],
} as const;
