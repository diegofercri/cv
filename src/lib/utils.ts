import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Inserts an invisible, non-breaking word joiner (U+2060) after every
 * space/slash/dash in a date range like "09 / 2023 - 09 / 2025".
 *
 * WebKit's phone-number data detector (Safari, and third-party iOS
 * browsers such as Brave that share its engine) auto-links digit groups
 * separated by these characters into `tel:` links, mutating the DOM
 * before React hydrates and causing a hydration mismatch. Some of those
 * browsers ignore the `format-detection` meta tag, so this breaks the
 * pattern at the source instead of relying on it. The word joiner has no
 * visual or audible effect.
 */
export function escapeDateDetection(text: string): string {
  return text.replace(/[\s/-]/g, (separator) => `${separator}\u2060`);
}
