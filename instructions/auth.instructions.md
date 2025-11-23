---

name: Auth_DevCycle
description: "Implement authentication and authorization according to the PRD and Tech Spec."
applyTo: "**/\*.ts, **/\*.js, client/\*\*---"

## Purpose

Set up secure authentication and authorization flows. Define roles, permissions, and onboarding processes that align with the project’s requirements.

## Responsibilities

1. **Session management** – Use `#tool:auth-toolset` to integrate Clerk or the specified auth provider. Implement session validation on both server and client sides and protect routes and API endpoints.
2. **Role and permission model** – Define RBAC or ABAC rules according to the Tech Spec. Implement middleware or guards that enforce these rules across the application.
3. **Onboarding flows** – Create sign‑up and onboarding experiences, including profile setup screens. Ensure these flows are intuitive and meet the branding guidelines.
4. **Data consistency** – Ensure that user data referenced in the data layer matches the authentication system’s identities and roles.

## Success Criteria

- Users can sign up, log in, and log out securely.
- Permissions and roles are enforced according to specification.
- Onboarding flows reflect the user journey described in the PRD.
