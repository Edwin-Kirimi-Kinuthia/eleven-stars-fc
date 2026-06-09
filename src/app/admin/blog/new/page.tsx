'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Save, Upload, X, Loader2 } from 'lucide-react'
import dynamic from 'next/dynamic'

const BlogEditor = dynamic(() => import('@/components/admin/BlogEditor'), {
  ssr: false,
  loading: () => (
    <div className="rounded-2xl p-8 text-center" style={{ background: '#1A1A1A', border: '1px solid rgba(255,255,255,0.08)' }}>
      <p className="text-gray-400 text-sm">Loading editor…</p>
    </div>
  ),
})

const categories = ['Match Day', 'Training', 'News', 'Announcement']

export default function NewBlogPostPage() {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [uploadingCover, setUploadingCover] = useState(false)
  const [publishMode, setPublishMode] = useState<'draft' | 'publish'>('publish')
  const [form, setForm] = useState({
    title: '',
    category: 'News',
    content: '',
    coverImage: '',
    youtubeUrl: '',
  })

  const set = (field: string, value: string) => setForm(prev => ({ ...prev, [field]: value }))

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploadingCover(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      const res = await fetch('/api/upload', { method: 'POST', body: formData })
      if (res.ok) {
        const data = await res.json()
        set('coverImage', data.url)
      }
    } catch (err) {
      console.error('Cover upload failed', err)
      alert('Failed to upload cover image. Please try again.')
    } finally {
      setUploadingCover(false)
    }
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.title.trim()) { alert('Please enter a post title.'); return }
    if (!form.content || form.content === '<p></p>') { alert('Please write some content.'); return }

    setSaving(true)
    try {
      // Append YouTube embed to content if provided
      let content = form.content
      if (form.youtubeUrl.trim()) {
        content += `<iframe src="${form.youtubeUrl.replace('watch?v=', 'embed/')}" title="Video" allowfullscreen></iframe>`
      }

      const res = await fetch('/api/blog', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: form.title.trim(),
          content,
          coverImage: form.coverImage || null,
          category: form.category,
          published: publishMode === 'publish',
        }),
      })

      if (res.ok) {
        router.push('/admin/blog')
      } else {
        const data = await res.json()
        alert(data.error || 'Failed to save post. Please try again.')
      }
    } catch (err) {
      console.error(err)
      alert('Failed to save post. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const inputClass = 'w-full px-4 py-3 rounded-xl text-white text-sm outline-none transition-all'
  const inputStyle = { background: '#1E1E1E', border: '1px solid rgba(255,255,255,0.08)' }

  return (
    <div className="p-6 lg:p-8 max-w-3xl">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <Link href="/admin/blog" className="text-gray-400 hover:text-white transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-white text-2xl font-black">Write Post</h1>
          <p className="text-gray-400 text-sm mt-0.5">Share news, match reports, and updates</p>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-5">

        {/* Cover image */}
        <div className="rounded-2xl overflow-hidden" style={{ background: '#141414', border: '1px solid rgba(255,255,255,0.06)' }}>
          {form.coverImage ? (
            <div className="relative h-48 bg-gray-800">
              <img src={form.coverImage} alt="Cover" className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => set('coverImage', '')}
                className="absolute top-3 right-3 p-1.5 rounded-lg text-white"
                style={{ background: 'rgba(0,0,0,0.6)' }}
              >
                <X size={14} />
              </button>
            </div>
          ) : (
            <label
              className="flex flex-col items-center justify-center h-36 cursor-pointer transition-all hover:bg-white/[0.02]"
              style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}
            >
              {uploadingCover ? (
                <Loader2 size={22} className="mb-2 text-pink animate-spin" />
              ) : (
                <Upload size={22} className="mb-2 text-gray-500" />
              )}
              <span className="text-gray-400 text-sm font-medium">
                {uploadingCover ? 'Uploading…' : 'Click to upload cover photo / poster'}
              </span>
              <span className="text-gray-600 text-xs mt-1">JPG, PNG, WebP — max 5 MB</span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                disabled={uploadingCover}
                onChange={handleCoverUpload}
              />
            </label>
          )}

          <div className="p-5 space-y-4">
            {/* Category */}
            <div className="flex flex-wrap gap-2">
              {categories.map(cat => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => set('category', cat)}
                  className="px-3 py-1.5 rounded-full text-xs font-semibold transition-all"
                  style={
                    form.category === cat
                      ? { background: '#E91E8C', color: '#fff' }
                      : { background: 'rgba(255,255,255,0.06)', color: '#9CA3AF' }
                  }
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Title */}
            <input
              type="text"
              value={form.title}
              onChange={e => set('title', e.target.value)}
              placeholder="Post title — e.g. 'We Beat FC Tharaka 3–1 in a Thriller'"
              required
              className="w-full px-0 py-2 bg-transparent text-white text-2xl font-black outline-none placeholder-gray-600 border-b"
              style={{ borderColor: 'rgba(255,255,255,0.06)' }}
            />
          </div>
        </div>

        {/* Rich text editor */}
        <div>
          <p className="text-gray-400 text-xs font-medium mb-2 uppercase tracking-wider">Post Content</p>
          <BlogEditor content={form.content} onChange={val => set('content', val)} />
        </div>

        {/* Video embed */}
        <div className="rounded-2xl p-5 space-y-3" style={{ background: '#141414', border: '1px solid rgba(255,255,255,0.06)' }}>
          <p className="text-white font-bold text-sm">Add a Video (optional)</p>
          <p className="text-gray-400 text-xs">Paste a YouTube link to embed a match highlight or training clip.</p>
          <input
            type="url"
            value={form.youtubeUrl}
            onChange={e => set('youtubeUrl', e.target.value)}
            placeholder="https://youtube.com/watch?v=…"
            className={inputClass}
            style={inputStyle}
          />
        </div>

        {/* Publish options */}
        <div className="rounded-2xl p-5" style={{ background: '#141414', border: '1px solid rgba(255,255,255,0.06)' }}>
          <p className="text-white font-bold text-sm mb-3">Publish Settings</p>
          <div className="flex gap-3">
            {(['publish', 'draft'] as const).map(mode => (
              <button
                key={mode}
                type="button"
                onClick={() => setPublishMode(mode)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all"
                style={
                  publishMode === mode
                    ? { background: mode === 'publish' ? 'rgba(34,197,94,0.2)' : 'rgba(255,255,255,0.1)', color: mode === 'publish' ? '#4ADE80' : '#fff', border: `1px solid ${mode === 'publish' ? 'rgba(34,197,94,0.4)' : 'rgba(255,255,255,0.2)'}` }
                    : { background: 'rgba(255,255,255,0.04)', color: '#6B7280', border: '1px solid rgba(255,255,255,0.06)' }
                }
              >
                {mode === 'publish' ? '🟢 Publish now' : '🔘 Save as draft'}
              </button>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 pt-2">
          <button
            type="submit"
            disabled={saving || uploadingCover}
            className="flex items-center gap-2 px-6 py-3 rounded-xl text-white font-bold text-sm transition-all hover:scale-105 disabled:opacity-70"
            style={{ background: 'linear-gradient(135deg, #E91E8C, #C4186F)' }}
          >
            {saving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
            {saving ? 'Saving…' : publishMode === 'publish' ? 'Publish Post' : 'Save Draft'}
          </button>
          <Link
            href="/admin/blog"
            className="px-5 py-3 rounded-xl text-gray-400 text-sm font-semibold transition-all hover:text-white"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  )
}
