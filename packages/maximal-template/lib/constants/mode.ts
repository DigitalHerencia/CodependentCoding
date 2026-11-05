/** Public build-mode flags are safe for browser components; credentials stay server-only. */
export const isDevelopment = process.env.NODE_ENV === "development";
export const isProduction = process.env.NODE_ENV === "production";
