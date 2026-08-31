# Authentication, Authorization, and Trust Boundaries

# 1. Scope

The public Codependent Coding website is documentation-first and demonstration-first. Authentication is not a prerequisite for reading public product, architecture, Ontology, Simples, Maximal Template, or TypeScripture content.

# 2. Public-by-Default Surfaces

- Landing page.
- Ontologies catalog and public definitions.
- Simples catalogs and demonstrations.
- Anthimeria when operating as a stateless/local configuration tool.
- Maximal Template documentation/demonstration.
- TypeScripture documentation.
- Loaded Vibes public documentation.
- Public definition download/copy actions that contain no private state.

# 3. Authentication Boundary

Authentication becomes necessary only when a feature introduces user-owned or organization-owned persistent state, private artifacts, billing, saved configurations, collaboration, account management, or other identity-bound behavior.

- Do not introduce login gates around public architecture content.
- Do not infer authorization from UI visibility.
- Any future authenticated capability must be enforced server-side.
- Authentication provider integration must remain replaceable at the application boundary and must not become the domain model itself.

# 4. Authorization Model

When authenticated product capabilities exist, authorization MUST be explicit and server-determined.

```text
Request
↓
Authenticated identity
↓
Membership / ownership context
↓
Permission or policy evaluation
↓
Authorized workflow
↓
Server operation / transaction
```
- Deny by default when required authorization context is absent.
- Client-side checks may improve UX but never constitute enforcement.
- Organization-scoped data requires organization membership/permission checks before reads or writes.
- Workflows must call authorization at the appropriate boundary before protected effects.
- Privileged operations must not be exposed through public route handlers merely because the UI hides them.

# 5. Anthimeria Security Model

- Stateless configuration does not require identity.
- Configuration input is untrusted input and must be schema-validated.
- Generated/downloaded definitions must not contain secrets.
- The browser must not receive provider secret keys, database credentials, deployment credentials, or privileged tokens.
- If share URLs exist, encode only safe bounded configuration state or store state behind an opaque identifier with appropriate access control.
- Do not execute arbitrary user-provided code as part of configuration preview.

# 6. Server Actions and Route Handlers

- Validate input at the boundary.
- Authenticate where identity is required.
- Authorize before protected reads/writes.
- Return bounded errors rather than provider internals or secrets.
- Do not trust hidden form fields, route params, organization IDs, or client-supplied role claims.
- Use idempotency/transaction protections where a mutation can create duplicate or financially consequential effects.

# 7. Secrets

- Secrets remain server-side environment variables or provider-managed secrets.
- Only explicitly public environment variables may reach the browser.
- No secrets in public/, Markdown, downloadable definitions, screenshots, examples, or generated client bundles.
- Repository examples use placeholders, never working credentials.

# 8. Error and Logging Requirements

- Public errors are user-readable and non-sensitive.
- Authentication failures distinguish unauthenticated from unauthorized states where appropriate without leaking protected resource details.
- Logs may include request/event identifiers but should avoid tokens, secrets, full payment payloads, and unnecessary personal data.
- Security-sensitive failures must be observable server-side without exposing implementation details to the browser.

# 9. Future Account Features

If saved projects, billing, organizations, collaboration, or private Arrangements are added, this document must be extended with the concrete identity provider, session model, membership model, permission matrix, persistence boundaries, webhook verification, and account lifecycle. Those details are not invented here because the current supplied site requirements do not establish them as existing product behavior.
