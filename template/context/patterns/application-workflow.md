# Application workflow

A workflow coordinates one named use case across authorization, policies, persistence, provider adapters, audit/outbox behavior, and cache intent. It contains no JSX or framework navigation and keeps provider calls outside database transactions.
