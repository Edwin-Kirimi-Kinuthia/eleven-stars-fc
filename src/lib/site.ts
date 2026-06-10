/* Canonical site URL, shared by metadata, robots.ts and sitemap.ts.
   Override per-environment with NEXT_PUBLIC_SITE_URL (no trailing slash). */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? 'https://elevenstars.co.ke'
).replace(/\/+$/, '')

export const SITE_NAME = 'Eleven Stars F.C'
