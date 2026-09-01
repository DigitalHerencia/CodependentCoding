import "server-only";

import { clerkClient } from "@clerk/nextjs/server";

export async function getClerk() {
  return await clerkClient();
}
