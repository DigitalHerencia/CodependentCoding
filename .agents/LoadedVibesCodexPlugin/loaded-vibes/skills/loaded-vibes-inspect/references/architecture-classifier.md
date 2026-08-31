# Architecture Classifier

Use this before creating or relocating code.

```text
STATIC PUBLIC PRESENTATION ONLY?
    app/(public) page + components/blocks

REACT HOOK FORM?
    feature form + components/ui

APPLICATION ORCHESTRATION?
    features/

PERSISTED DATABASE READ?
    lib/fetchers/

ORDINARY PERSISTED CRUD WRITE?
    lib/actions/

PRISMA SELECT?
    lib/db/selects/

DTO MAPPER?
    lib/db/dto/

ATOMIC DATABASE TRANSACTION?
    lib/db/transactions/

CLERK / AUTHENTICATION?
    lib/auth/

RBAC / ABAC / AUTHORIZATION?
    lib/authz/

PROVIDER-SPECIFIC EXTERNAL BEHAVIOR?
    lib/integrations/{provider}/

WEBHOOK HTTP LIFECYCLE?
    app/api/{provider}/.../route.ts

REUSABLE ORCHESTRATION OF APPLICATION LOGIC?
    lib/workflows/{domain}/

CACHE CONCERN?
    lib/cache/

CONSTANT?
    lib/constants/

TRUE GENERIC UTILITY?
    lib/utils/

PRISMA SCHEMA / MIGRATION / SEED?
    prisma/

RUNTIME INPUT VALIDATION?
    schemas/

SHARED COMPILE-TIME CONTRACT?
    types/
```

Do not invent another architectural layer when the responsibility already has a name.
