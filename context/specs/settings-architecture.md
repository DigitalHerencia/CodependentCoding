# Settings architecture normalization

Approved scope from the owner request, tracked by [Issue #388](https://github.com/DigitalHerencia/CodependentCoding/issues/388).

- Preserve the tenant shell, navigation contributions and the Members, Integrations and Billing routes. Use CRM as a read-only architecture reference.
- Settings composes pages, skeletons and owner capabilities. Invitation forms stay with Invitations; identity, profiles, membership administration, subscription records and provider configuration remain with their respective owners.
- Preserve tenant-scoped directory access and independent mutation authorization. Bound and order directory reads and pending invitations. Display invitation controls according to their applicable permissions and keep invitation tokens within the existing share flow.
- Derive installed integration inventory from module contributions. Show configuration presence without inferring connectivity or operational health. Keep provider metadata privileged. Render billing from the authorized local subscription and distinguish missing records and configuration.
- Verify changed source with `lint:fix`, `format:write`, `typegen` and `typecheck` and record evidence. Authored tests are unexecuted. No builds, database operations, provider calls, invitation delivery, financial effects or deployments.
