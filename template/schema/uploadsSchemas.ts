import { z } from "zod";

export const uploadDomainSchema = z.enum(["portal", "social"], {
  error: "Invalid file destination.",
});

const uploadSizeMessage = "Choose a non-empty file up to 750 KB.";

export const uploadFileSchema = z
  .file({ error: uploadSizeMessage })
  .min(1, { error: uploadSizeMessage })
  .max(750000, { error: uploadSizeMessage });
