'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Plus, Pencil, Trash2, Eye, BookOpen, Tag, Loader2 } from 'lucide-react'

interface BlogPost {
  id: string
  title: string
  category: string
  slug: string
  published: boolean
  createdAt: string
}

const categoryColors: Record<string, string> = {
  'Match Day': '#E91E8C',
  Training: '#4ADE80',
  News: '#60A5FA',
  Announcement: '#C9A84C',
}

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { fetchPosts() }, [])

  const fetchPosts = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/blog?all=true')
      const data = await res.json()
      setPosts(Array.isArray(data) ? data : [])
    } catch (e) { console.error(e); setPosts([]) }
    finally { setLoading(false) }
  }

  const deletePost = async (id: string) => {
    if (!confirm('Delete this post? This cannot be undone.')) return
    try {
      const res = await fetch(`/api/blog/${id}`, { method: 'DELETE' })
      if (res.ok) await fetchPosts()
    } catch (e) { console.error(e) }
  }

  const togglePublish = async (post: BlogPost) => {
    try {
      const res = await fetch(`/api/blog/${post.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ published: !post.published }),
      })
      if (res.ok) await fetchPosts()
    } catch (e) { console.error(e) }
  }

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-screen">
        <Loader2 size={32} className="text-pink animate-spin" />
      </div>
    )
  }

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-white text-2xl font-black">Blog Posts</h1>
          <p className="text-gray-400 text-sm mt-0.5">
            {posts.filter(p => p.published).length} published · {posts.filter(p => !p.published).length} draft
          </p>
        </div>
        <Link
          href="/admin/blog/new"
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-white text-sm font-semibold transition-all hover:scale-105"
          style={{ background: 'linear-gradient(135deg, #E91E8C, #C4186F)' }}
        >
          <Plus size={16} /> Write Post
        </Link>
      </div>

      <div className="space-y-3">
        {posts.length === 0 ? (
          <div
            className="rounded-2xl p-16 text-center"
            style={{ background: '#141414', border: '1px solid rgba(255,255,255,0.06)' }}
          >
            <BookOpen size={40} className="mx-auto mb-4 opacity-20" style={{ color: '#E91E8C' }} />
            <p className="text-gray-400 text-sm mb-4">No posts yet</p>
            <Link
              href="/admin/blog/new"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-white text-sm font-semibold"
              style={{ background: 'linear-gradient(135deg, #E91E8C, #C4186F)' }}
            >
              <Plus size={14} /> Write your first post
            </Link>
          </div>
        ) : (
          posts.map(post => (
            <div
              key={post.id}
              className="flex items-center gap-4 p-5 rounded-2xl transition-all hover:scale-[1.005]"
              style={{ background: '#141414', border: '1px solid rgba(255,255,255,0.06)' }}
            >
              <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(233,30,140,0.12)' }}>
                <BookOpen size={17} style={{ color: '#E91E8C' }} />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold"
                    style={{ background: `${categoryColors[post.category] ?? '#E91E8C'}20`, color: categoryColors[post.category] ?? '#E91E8C' }}
                  >
                    <Tag size={9} /> {post.category}
                  </span>
                  <span
                    className="px-2 py-0.5 rounded-full text-xs font-semibold"
                    style={{
                      background: post.published ? 'rgba(34,197,94,0.15)' : 'rgba(255,255,255,0.06)',
                      color: post.published ? '#4ADE80' : '#6B7280',
                    }}
                  >
                    {post.published ? 'Published' : 'Draft'}
                  </span>
                </div>
                <p className="text-white font-semibold text-sm truncate">{post.title}</p>
                <p className="text-gray-500 text-xs mt-0.5">
                  {new Date(post.createdAt).toLocaleDateString('en-KE', { day: 'numeric', month: 'short', year: 'numeric' })}
                </p>
              </div>

              <div className="flex items-center gap-1 flex-shrink-0">
                <Link
                  href={`/blog/${post.slug}`}
                  target="_blank"
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-white transition-all hover:bg-white/10"
                  title="View post"
                >
                  <Eye size={14} />
                </Link>
                <Link
                  href={`/admin/blog/${post.id}/edit`}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-white transition-all hover:bg-white/10"
                  title="Edit post"
                >
                  <Pencil size={14} />
                </Link>
                <button
                  onClick={() => togglePublish(post)}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all hover:scale-105"
                  style={{
                    background: post.published ? 'rgba(255,255,255,0.06)' : 'rgba(34,197,94,0.15)',
                    color: post.published ? '#9CA3AF' : '#4ADE80',
                  }}
                >
                  {post.published ? 'Unpublish' : 'Publish'}
                </button>
                <button
                  onClick={() => deletePost(post.id)}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-red-400 transition-all hover:bg-red-500/10"
                  title="Delete post"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
