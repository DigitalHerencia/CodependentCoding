# Chapter 14: Application Workflow

**The Book of Knowledge™**

## Definition

A Workflow is a domain-oriented **business-logic block**. It composes lower-level application capabilities into a business operation in the same general way that a UI block composes lower-level UI primitives into useful presentation.

## Responsibilities

A Workflow may combine multiple reads, perform read -> decision -> mutation sequences, calculate domain state, enforce a business transition, or coordinate a provider-backed process. It imports the Actions, Fetchers, integrations, utilities, types, and schemas it needs rather than rewriting those functions inside the Workflow.

## Ownership

Workflows are organized by domain: admin, AI, CRM, invoicing, marketing, organization, portal, projects, social, support, and whatever other business domains the application actually has. Their names follow `<domain>Workflows.ts`.

## Boundary

A Workflow owns composition and business meaning, not the lower-level mechanics it composes. Authentication remains Auth, authorization remains AuthZ, reads remain Fetchers, mutations remain Actions, provider mechanics remain Integrations, and atomic local persistence remains the database layer.

A one-to-one Workflow alias can be intentional when Workflows are being used as a stable business-operation facade, but aliases should not be manufactured merely to make every operation pass through another file.
