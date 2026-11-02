import type { Metadata } from "next";

import { NotFoundPage } from "@/components/blocks/error-pages";
import { DocumentShell } from "@/components/shells/document-shell";

import "@/app/globals.css";

export const metadata: Metadata = { title: "Not found" };

// Unmatched URLs skip every root layout, so this page brings its own document.
// It is prerendered (it cannot read the request), so under the nonce CSP its
// framework scripts do not run: the page is plain HTML with working links.
export default function GlobalNotFound() {
  return (
    <DocumentShell>
      <NotFoundPage title="Not found" />
    </DocumentShell>
  );
}
