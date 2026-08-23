import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Frontmatter image paths are written as "public/images/…" so they are easy to
 * find on disk. Vite serves public/ at the site base, so the prefix becomes
 * BASE_URL — which on GitHub Pages is "/sahteiin/", not "/". Idempotent: a
 * path that already starts with the base is returned unchanged.
 */
export function withBase(path: string): string {
  if (!path || typeof path !== "string") return path;
  const base = import.meta.env.BASE_URL; // always has a trailing slash
  let p = path;
  if (p.startsWith("public/")) p = p.slice(7);
  p = p.replace(/^\/+/, "");
  if (("/" + p).startsWith(base)) return "/" + p;
  return base + p;
}
