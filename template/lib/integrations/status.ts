import "server-only";

export type ProviderState = "CONFIGURED" | "MISSING SECRET";
export interface ProviderStatus {
  name: string;
  purpose: string;
  state: ProviderState;
  mode: "LIVE" | "SANDBOX" | "NOT PROVISIONED";
}

function configured(...values: Array<string | undefined>): ProviderState {
  return values.every((value) => Boolean(value?.trim()))
    ? "CONFIGURED"
    : "MISSING SECRET";
}

export function getProviderStatuses(): ProviderStatus[] {
  return [
    {
      name: "Stripe",
      purpose: "Subscription checkout, billing portal, and verified webhooks.",
      state: configured(
        process.env.STRIPE_SECRET_KEY,
        process.env.STRIPE_WEBHOOK_SECRET,
      ),
      mode: "SANDBOX",
    },
    {
      name: "Vercel Blob",
      purpose: "Private original files and application-owned object storage.",
      state: configured(process.env.BLOB_READ_WRITE_TOKEN),
      mode: "NOT PROVISIONED",
    },
    {
      name: "Cloudinary",
      purpose: "Image delivery, transformations, and media derivatives.",
      state: configured(
        process.env.CLOUDINARY_CLOUD_NAME,
        process.env.CLOUDINARY_API_KEY,
        process.env.CLOUDINARY_API_SECRET,
      ),
      mode: "NOT PROVISIONED",
    },
    {
      name: "SendGrid",
      purpose: "Transactional email and authenticated delivery events.",
      state: configured(
        process.env.SENDGRID_API_KEY,
        process.env.SENDGRID_FROM_EMAIL,
        process.env.SENDGRID_WEBHOOK_VERIFICATION_KEY,
      ),
      mode: "NOT PROVISIONED",
    },
    {
      name: "Hugging Face",
      purpose: "Text generation and embedding provider mechanics.",
      state: configured(process.env.HUGGINGFACE_ACCESS_TOKEN),
      mode: "NOT PROVISIONED",
    },
  ];
}
