# Security

Report vulnerabilities privately through **GitHub Security Advisories**.

Do not open a public Issue containing:

- credentials;
- API keys;
- tokens;
- private keys;
- exploit details;
- sensitive production data;
- information that would materially increase the risk of exploitation before a fix exists.

## Security Boundaries

Secrets remain server-side environment variables or provider-managed secrets.

Only explicitly public environment variables may reach the browser.

No secrets belong in:

- `public/`;
- Markdown;
- downloadable definitions;
- screenshots;
- examples;
- generated client bundles.

Repository examples use placeholders rather than working credentials.

## Untrusted Input

Configuration input is untrusted input and must be validated at the appropriate boundary.

Server Actions and Route Handlers must:

- validate input;
- authenticate where identity is required;
- authorize protected operations server-side;
- avoid trusting client-supplied ownership, organization, role, or permission claims;
- return bounded errors rather than provider internals or secrets.

Client-side checks may improve the interface.

They are not authorization.

## Public Surfaces

Public architecture documentation, Ontologies, Simples, TypeScripture material, demonstrations, and stateless Anthimeria configuration do not require authentication merely to be read.

Authentication becomes necessary only when functionality introduces identity-bound or private state.

## Generated Material

Generated definitions and examples must not contain secrets.

Provider credentials, database credentials, deployment credentials, and privileged tokens must not be exposed to the browser or committed as project examples.

## Disclosure

Security reports should include enough information to reproduce and understand the issue without publishing sensitive material publicly.

Security fixes should be validated before disclosure.
