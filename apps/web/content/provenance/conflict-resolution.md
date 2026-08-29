# Conflict Resolution Register

| ID | Competing claims | Resolution | Basis | Consequence |
|---|---|---|---|---|
| CON-001 | Codependent Coding is an agent implementation system vs the Bible itself | Knowledge System identity controls; agent execution is one contained subsystem | explicit current instruction outranks older project definition | agent docs no longer define whole identity |
| CON-002 | Loaded Vibes is only a generator vs Loaded Vibes is WebApp Architecture | Architecture is canonical identity; generator is a delivery mechanism that instantiates it | current hierarchy and scope | project docs reclassified as generator implementation evidence |
| CON-003 | Hipster Stack is an engineering system/doctrine vs a TechStack | It is concrete substrate; reusable patterns are governed by Codependent Coding™ and organize use of the stack | controlling hierarchy | prevents stack/doctrine collapse |
| CON-004 | Feature may perform page reads vs components may call fetchers directly | Server feature/loaders may call secure fetchers; pure UI components may not | route-feature and layer contracts | preserves RSC orchestration without UI data leakage |
| CON-005 | Actions perform authorization vs workflows authorize resources | Actions establish Actor; workflows authorize actual resource/current state; fetchers authorize their reads | action/workflow/auth sources | avoids duplicated incomplete checks |
| CON-006 | Application authz vs RLS as authority | Application authz decides; RLS contains | auth and security invariants | both are mandatory but non-duplicative |
| CON-007 | Existing webhook row means duplicate complete vs status/lease controls completion | Existing row proves receipt only; terminal status proves completion; lease controls ownership | webhook source | duplicates/failed/stale events remain safe and recoverable |
| CON-008 | Stripe redirect vs webhook/local entitlement authority | Redirect is presentation only; verified normalized local state controls product access | system and Stripe contracts | success page cannot grant access |
| CON-009 | Provider status may be domain lifecycle status vs separate models | Provider mirror, operation, and domain lifecycles remain distinct and explicitly mapped | lifecycle/webhook sources | avoids provider-domain state collapse |
| CON-010 | Next.js Server Component can query DB vs architecture requires fetcher | Capability does not establish ownership; protected application reads use fetchers | fetcher doctrine and layer contract | no direct Prisma in routes/features/components |
| CON-011 | Client action visibility is authz vs presentation only | UI may hide/disable, but action/workflow reauthorizes | auth and route-feature sources | no client-trusted authority |
| CON-012 | Pre-commit hooks vs PR validation | Hooks optional; repository scripts and PR/CI are authoritative | engineering-system source | low-friction local workflow without weakened gate |
| CON-013 | `Project` as common sample vs tenant/business kernel | Project is removable sample only | controlling tenant contract | generated product cannot hide tenancy/billing in sample domain |
| CON-014 | Vouch implementation constraints as generic doctrine | Promote only reusable compatible boundaries; keep routes/lifecycle/copy/product rules project-specific | source authority model | reference implementation cannot silently redefine architecture |

Every identified material conflict has one selected outcome. No alternative in this register remains simultaneously canonical.
