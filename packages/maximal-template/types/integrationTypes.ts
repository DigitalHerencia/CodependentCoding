/** Environment presence projected for one installed provider, with no connectivity claim. */
export type IntegrationStatus = {
  name: string;
  purpose: string;
  configuration: "present" | "missing";
};
