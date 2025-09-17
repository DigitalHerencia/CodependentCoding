
# Codex Code Review Checklist

- [ ] Security: No obvious injection/XSS/SSRF/SSRF vectors. Secrets not committed.
- [ ] Correctness: Behavior matches spec and tests.
- [ ] Tests: New tests added, and existing tests unaffected.
- [ ] Types: TypeScript types are strict and errors resolved.
- [ ] Performance: No obvious O(n^2) regressions in hot paths.
- [ ] Accessibility: UI changes meet basic accessibility requirements.
- [ ] Docs: README or quickstart updated if necessary.

Reviewers should add comments for any failed checks and request changes.
