import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function safeHref(value: string | undefined | null) {
  if (!value) return "#";
  if (value.startsWith("#")) return value;
  if (
    value.startsWith("/") &&
    !value.startsWith("//") &&
    !value.startsWith("/\\")
  ) {
    return value;
  }

  try {
    const protocol = new URL(value).protocol;
    return ["https:", "http:", "mailto:", "tel:"].includes(protocol)
      ? value
      : "#";
  } catch {
    return "#";
  }
}

export function sanitizeCssValue(value: string) {
  return value.replace(/[;{}<>]/g, "").trim();
}
