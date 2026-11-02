import { securityDisclosure } from "@/content/security";

export function GET() {
  return new Response(
    [
      `Contact: ${securityDisclosure.contact}`,
      `Expires: ${securityDisclosure.expires}`,
      "Preferred-Languages: en",
      `Policy: ${securityDisclosure.policy}`,
      `Canonical: ${securityDisclosure.canonical}`,
      "",
    ].join("\n"),
    { headers: { "Content-Type": "text/plain; charset=utf-8" } },
  );
}
