import Link from 'next/link'
import { Calendar, Tag, ArrowLeft, User } from 'lucide-react'
import prisma from '@/lib/db'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  try {
    const post = await prisma.blogPost.findUnique({ where: { slug } })
    if (post) return { title: post.title, description: post.excerpt }
  } catch { /* ignore */ }
  return { title: 'Blog Post' }
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params

  let post: { title: string; excerpt: string; content: string; category: string; author: string; coverImage?: string | null; createdAt: Date } | null = null
  try {
    post = await prisma.blogPost.findFirst({ where: { slug, published: true } })
  } catch { /* DB unavailable */ }

  if (!post) {
    return notFound()
  }

  return (
    <div style={{ background: '#0A0A0A' }}>

      {/* Cover */}
      <div
        className="w-full py-28 relative overflow-hidden"
        style={{ background: 'radial-gradient(ellipse 70% 60% at 50% 0%, rgba(233,30,140,0.2) 0%, transparent 70%), #0A0A0A' }}
      >
        {post.coverImage && (
          <div className="absolute inset-0">
            <img src={post.coverImage} alt="" className="w-full h-full object-cover opacity-20" />
            <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, transparent 0%, #0A0A0A 85%)' }} />
          </div>
        )}
        <div className="max-w-3xl mx-auto px-4 relative z-10">
          <Link href="/blog" className="inline-flex items-center gap-2 text-gray-400 hover:text-white text-sm mb-8 transition-colors">
            <ArrowLeft size={14} /> Back to Blog
          </Link>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold mb-4" style={{ background: 'rgba(233,30,140,0.15)', color: '#E91E8C' }}>
            <Tag size={10} /> {post.category}
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-white leading-tight mb-6">{post.title}</h1>
          <div className="flex items-center gap-4 text-sm text-gray-400">
            <span className="flex items-center gap-1.5">
              <Calendar size={13} />
              {new Date(post.createdAt).toLocaleDateString('en-KE', { day: 'numeric', month: 'long', year: 'numeric' })}
            </span>
            <span className="flex items-center gap-1.5"><User size={13} /> {post.author}</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-4 py-14 pb-24">
        <div
          className="prose prose-invert max-w-none text-gray-300 leading-relaxed space-y-5"
          style={{ lineHeight: '1.8' }}
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        <div className="mt-14 pt-8" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <Link href="/blog" className="inline-flex items-center gap-2 text-[#E91E8C] text-sm font-semibold hover:gap-3 transition-all">
            <ArrowLeft size={14} /> All Posts
          </Link>
        </div>
      </div>
    </div>
  )
}
