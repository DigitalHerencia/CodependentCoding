import type { ModuleDefinition } from "@/types/moduleTypes";

export const mediaModule = {
  id: "media",
  integration: {
    name: "Cloudinary",
    purpose: "Image transformation and media delivery",
    env: [
      "CLOUDINARY_CLOUD_NAME",
      "CLOUDINARY_API_KEY",
      "CLOUDINARY_API_SECRET",
    ],
  },
} satisfies ModuleDefinition;
