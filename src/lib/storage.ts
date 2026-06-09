import { createClient, type SupabaseClient } from '@supabase/supabase-js'

/**
 * Storage bucket used for all admin-uploaded media (player photos,
 * product images, team avatars). Must exist in the Supabase project and
 * be marked **public** so the returned URLs are readable by the website.
 */
export const STORAGE_BUCKET = 'uploads'

let cached: SupabaseClient | null | undefined

/**
 * Returns a Supabase client for server-side storage operations, or `null`
 * when storage isn't configured (so callers can fall back to data URLs).
 *
 * Prefers the service-role key (bypasses storage RLS) when available,
 * otherwise uses the public publishable/anon key — which works as long as
 * the bucket has a policy permitting uploads.
 */
export function getStorageClient(): SupabaseClient | null {
  if (cached !== undefined) return cached

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.SUPABASE_SERVICE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url || !key) {
    cached = null
    return cached
  }

  cached = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  })
  return cached
}
