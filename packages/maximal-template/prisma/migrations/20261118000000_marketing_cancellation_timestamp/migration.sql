-- Additive planning timestamp only; this migration never dispatches campaigns.
ALTER TABLE "Campaign" ADD COLUMN "canceledAt" TIMESTAMPTZ(6);
