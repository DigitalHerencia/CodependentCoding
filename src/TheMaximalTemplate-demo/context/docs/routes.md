# Routes

Route groups organize public, auth, onboarding, tenant, admin, billing, presentation, and API surfaces without adding URL segments. Pages validate route input, invoke features, and own framework navigation or `notFound`; they do not query Prisma directly.
