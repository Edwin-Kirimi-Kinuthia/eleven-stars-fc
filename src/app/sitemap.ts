import type { MetadataRoute } from 'next'
import { SITE_URL } from '@/lib/site'
import prisma from '@/lib/db'

// DB-backed → render at request time (cheap, cached by crawlers anyway).
export const dynamic = 'force-dynamic'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date()

  // Public, indexable static routes (auth/admin/account are excluded).
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`,         lastModified: now, changeFrequency: 'daily',   priority: 1.0 },
    { url: `${SITE_URL}/about`,    lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${SITE_URL}/academy`,  lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${SITE_URL}/squad`,    lastModified: now, changeFrequency: 'weekly',  priority: 0.8 },
    { url: `${SITE_URL}/fixtures`, lastModified: now, changeFrequency: 'daily',   priority: 0.9 },
    { url: `${SITE_URL}/blog`,     lastModified: now, changeFrequency: 'weekly',  priority: 0.7 },
    { url: `${SITE_URL}/shop`,     lastModified: now, changeFrequency: 'weekly',  priority: 0.7 },
    { url: `${SITE_URL}/tickets`,  lastModified: now, changeFrequency: 'daily',   priority: 0.9 },
    { url: `${SITE_URL}/donate`,   lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
  ]

  // Dynamic routes — best effort; if the DB is unavailable we still ship the
  // static sitemap rather than failing the whole route.
  let dynamicRoutes: MetadataRoute.Sitemap = []
  try {
    const [posts, players] = await Promise.all([
      prisma.blogPost.findMany({
        where: { published: true },
        select: { slug: true, updatedAt: true },
      }),
      prisma.player.findMany({ select: { id: true, updatedAt: true } }),
    ])

    dynamicRoutes = [
      ...posts.map((p) => ({
        url: `${SITE_URL}/blog/${p.slug}`,
        lastModified: p.updatedAt ?? now,
        changeFrequency: 'monthly' as const,
        priority: 0.6,
      })),
      ...players.map((p) => ({
        url: `${SITE_URL}/squad/${p.id}`,
        lastModified: p.updatedAt ?? now,
        changeFrequency: 'monthly' as const,
        priority: 0.6,
      })),
    ]
  } catch {
    /* DB unavailable — static routes are enough to get indexed. */
  }

  return [...staticRoutes, ...dynamicRoutes]
}
