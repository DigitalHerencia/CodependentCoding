# Segment 2 Plan

```yaml
Segment: 2 - TypeScripture replacement and documentation authority
Outcome: Replace the active legacy documentation index with one TypeScripture reader that renders the paired 24-chapter Book of Knowledge and Book of Implementation directly from context/10-authority/typescripture.
Existing implementation to reuse: The existing server-only filesystem docs adapter, catch-all /docs route, Markdown-to-React renderer, shared shell, and the canonical chapter map plus preserved chapter Markdown.
Files/owners to change: apps/web/lib/docs.tsx becomes the TypeScripture source adapter and renderer; apps/web/app/docs/[[...slug]]/page.tsx becomes the paired-book reader; apps/web/app/globals.css owns reader presentation; web metadata and execution records receive the current identity.
Compatibility adapters (if any): Existing apps/web/content remains untouched as migration/provenance evidence but stops owning active /docs routes; exact branded Codependent Coding Knowledge System wording is reconciled at render time where the controlling identity map supersedes it, without mutating canonical source bytes.
Focused validation: Assert 24 unique chapter pairs and 48 readable source files from 00-Chapter-Map.json; scan rendered active copy for the superseded branded identity; run web typecheck, targeted ESLint/Prettier, production build/static route enumeration, and browser smoke for overview, both books, pair switching, deep-link anchors, narrow layout, and console errors.
Deletion/removal deferred until: Legacy apps/web/content docs/provenance/pattern files remain as migration evidence; removal or archival belongs to final cleanup only after all source-backed detail Docs links use TypeScripture.
```
