"use server";

import { uploadWorkspaceAssetWorkflow } from "@/lib/workflows/uploadsWorkflows";

export async function uploadWorkspaceAsset(formData: FormData) {
  return uploadWorkspaceAssetWorkflow(formData);
}
