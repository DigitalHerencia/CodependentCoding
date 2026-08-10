# Integrations and provider ownership

The template includes supported server-side boundaries for Clerk, Neon/PostgreSQL, Stripe, Cloudinary, Hugging Face, Mapbox, and Vercel-oriented deployment. Billing and Stripe Connect are optional generated surfaces; the other boundaries are part of the fixed template foundation.

Loaded Vibes does not create provider accounts, collect secrets, provision infrastructure, run production migrations, register webhooks, choose commercial policy, or deploy for you.

Start from the generated `.env.example`. Configure provider projects and credentials in your own environments, run `loaded-vibes doctor`, then verify every provider-backed journey before production promotion.
