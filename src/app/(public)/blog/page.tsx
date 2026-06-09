import Link from 'next/link'
import PageHeader from '@/components/ui/PageHeader'
import { Calendar, User, ArrowRight } from 'lucide-react'
import prisma from '@/lib/db'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Latest news, match reports, and updates from Eleven Stars FC.',
}

export const dynamic = 'force-dynamic'

export default async function BlogPage() {
  let posts: { id: string; slug: string; title: string; excerpt: string; category: string; author: string; coverImage?: string | null; createdAt: Date }[] = []
  try {
    posts = await prisma.blogPost.findMany({
      where: { published: true },
      orderBy: { createdAt: 'desc' },
    })
  } catch { /* DB unavailable */ }

  return (
    <div className="bg-base text-white">
      <PageHeader eyebrow="Latest Updates" title="Latest" highlight="News" description="Match reports, training updates, and club announcements." />

      <section className="py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {posts.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-400 text-lg">No posts yet. Check back soon!</p>
            </div>
          ) : (
            <div className="space-y-5">
              {posts.map(post => (
                <Link key={post.slug} href={`/blog/${post.slug}`}
                  className="group rounded-2xl bg-surface border border-white/8 hover:border-white/15 transition-all hover:-translate-y-1 overflow-hidden block">
                  <div className="h-1 w-full bg-gradient-to-r from-gold via-pink to-gold opacity-0 group-hover:opacity-100 transition-opacity" />
                  {post.coverImage && (
                    <div className="h-48 overflow-hidden">
                      <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    </div>
                  )}
                  <div className="p-8">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
                      <span className="inline-block px-3 py-1 rounded-full bg-pink/10 border border-pink/20 text-pink text-xs font-bold">
                        {post.category}
                      </span>
                      <time className="text-gray-500 text-sm">
                        {new Date(post.createdAt).toLocaleDateString('en-KE', { day: 'numeric', month: 'long', year: 'numeric' })}
                      </time>
                    </div>
                    <h3 className="text-2xl sm:text-3xl font-black mb-3 group-hover:text-pink transition-colors">{post.title}</h3>
                    <p className="text-gray-400 mb-5 leading-relaxed">{post.excerpt}</p>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <User size={14} /> {post.author}
                      </div>
                      <span className="text-pink font-bold flex items-center gap-1 group-hover:gap-2 transition-all">
                        Read More <ArrowRight size={14} />
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
