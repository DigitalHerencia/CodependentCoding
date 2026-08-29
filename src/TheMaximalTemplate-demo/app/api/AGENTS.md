# Route handlers and webhooks

Webhook handlers follow `verify -> parse -> claim idempotently -> reconcile -> acknowledge`. Signature verification uses the raw body. Provider events are notifications of external truth, not trusted application commands.
