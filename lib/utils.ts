import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function safeHref(value: string | undefined, fallback = '#') {
  if (!value) return fallback;
  if (
    value.startsWith('/') ||
    value.startsWith('#') ||
    /^https?:\/\//.test(value)
  )
    return value;
  return fallback;
}

export function sanitizeCssValue(value: string) {
  return value.replace(/[;}]/g, '');
}
