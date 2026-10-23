import type { ModuleDefinition } from "@/types/moduleTypes";

export const uploadsModule = {
  id: "uploads",
  integration: {
    name: "Vercel Blob",
    purpose: "Application-owned file storage",
    env: ["BLOB_READ_WRITE_TOKEN"],
  },
} satisfies ModuleDefinition;
