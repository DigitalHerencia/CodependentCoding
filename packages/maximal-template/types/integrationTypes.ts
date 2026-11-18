/** Integration Types contracts and composition for the owning application slice. */
export type IntegrationStatus = {
  name: string;
  purpose: string;
  state: "CONFIGURED" | "MISSING SECRET";
  mode: "LIVE" | "DEMO MODE" | "UNAVAILABLE";
};
