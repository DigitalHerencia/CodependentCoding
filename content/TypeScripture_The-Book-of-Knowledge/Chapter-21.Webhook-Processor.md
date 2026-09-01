# Chapter 21: Webhook Processor

**The Book of Knowledge™**

## Definition

A provider webhook crosses two boundaries. The framework route is the HTTP entry point; the provider webhook helper owns provider-specific webhook mechanics. Keeping those separate prevents route handlers from becoming giant provider-processing files.

## Separation

The Next.js `route.ts` receives the raw request, obtains the headers/body required by the provider, invokes the provider-specific verification/processing helper, and returns the HTTP response. The provider's `webhooks.ts` helper normally lives with that provider under `lib/integrations/<provider>/` and contains the provider-specific webhook functions used by the route.

Clerk can be an intentional exception when the webhook helpers are truly part of the authentication/identity concern; concern-first ownership beats a blanket rule that every vendor must live under integrations.

## Security and reliability

Verify webhook signatures according to the provider's rules before trusting event contents. External delivery may be duplicated, replayed, concurrent, delayed, or out of order. Consequential processing therefore needs idempotent effects where appropriate, and database facts that must commit together need atomic transaction handling.

Do not claim that a database transaction itself provides idempotency, and do not hold provider/network work open inside a long database transaction.
