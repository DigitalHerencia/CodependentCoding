import "server-only";

import { clerkClient } from "@clerk/nextjs/server";

export const Clerk = await clerkClient();
