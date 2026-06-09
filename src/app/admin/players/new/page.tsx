'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Save, Upload } from 'lucide-react'

const positions = ['Goalkeeper', 'Defender', 'Midfielder', 'Forward']

export default function NewPlayerPage() {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [photoPreview, setPhotoPreview] = useState('')
  const [form, setForm] = useState({
    number: '',
    name: '',
    position: 'Midfielder',
    nationality: 'Kenya',
    age: '',
    bio: '',
    isCaptain: false,
    photo: '',
    goals: '0',
    assists: '0',
    appearances: '0',
  })

  const set = (field: string, value: string | boolean) =>
    setForm(prev => ({ ...prev, [field]: value }))

  const [pendingFile, setPendingFile] = useState<File | null>(null)

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setPendingFile(file)
    const reader = new FileReader()
    reader.onload = () => setPhotoPreview(reader.result as string)
    reader.readAsDataURL(file)
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name.trim()) { setError('Player name is required'); return }
    if (!form.number) { setError('Jersey number is required'); return }
    setSaving(true)
    setError('')

    try {
      let photoUrl = ''
      if (pendingFile) {
        const fd = new FormData()
        fd.append('file', pendingFile)
        const uploadRes = await fetch('/api/upload', { method: 'POST', body: fd })
        if (uploadRes.ok) {
          const { url } = await uploadRes.json()
          photoUrl = url
        }
      }

      const res = await fetch('/api/players', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          number: parseInt(form.number),
          name: form.name.trim(),
          position: form.position,
          nationality: form.nationality,
          isCaptain: form.isCaptain,
          photo: photoUrl || null,
          goals: parseInt(form.goals) || 0,
          assists: parseInt(form.assists) || 0,
          appearances: parseInt(form.appearances) || 0,
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to save player')
      }

      router.push('/admin/players')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save player')
      setSaving(false)
    }
  }

  const inputClass = "w-full px-4 py-3 rounded-xl text-white text-sm outline-none transition-all"
  const inputStyle = { background: '#1E1E1E', border: '1px solid rgba(255,255,255,0.08)' }

  return (
    <div className="p-6 lg:p-8 max-w-2xl">
      <div className="flex items-center gap-3 mb-8">
        <Link href="/admin/players" className="text-gray-400 hover:text-white transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-white text-2xl font-black">Add Player</h1>
          <p className="text-gray-400 text-sm mt-0.5">Register a new squad member</p>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-xl text-sm text-red-400" style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)' }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-5">

        {/* Photo upload */}
        <div className="flex items-center gap-5 p-5 rounded-2xl" style={{ background: '#141414', border: '1px solid rgba(255,255,255,0.06)' }}>
          <div
            className="w-20 h-20 rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden"
            style={{ background: 'rgba(233,30,140,0.15)' }}
          >
            {photoPreview
              ? <img src={photoPreview} alt="preview" className="w-full h-full object-cover" />
              : <span className="text-2xl font-black" style={{ color: '#E91E8C' }}>{form.name ? form.name.charAt(0).toUpperCase() : '?'}</span>
            }
          </div>
          <div>
            <p className="text-white text-sm font-semibold mb-1">Player Photo</p>
            <p className="text-gray-400 text-xs mb-3">Upload a clear headshot photo</p>
            <label className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold text-white cursor-pointer transition-all hover:scale-105" style={{ background: 'rgba(255,255,255,0.08)', display: 'inline-flex' }}>
              <Upload size={13} /> Choose Photo
              <input type="file" accept="image/*" className="hidden" onChange={handlePhotoChange} />
            </label>
          </div>
        </div>

        {/* Basic info */}
        <div className="rounded-2xl p-5 space-y-4" style={{ background: '#141414', border: '1px solid rgba(255,255,255,0.06)' }}>
          <h3 className="text-white font-bold text-sm uppercase tracking-wider">Player Info</h3>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-gray-300 text-xs font-medium block mb-1.5">Jersey Number <span className="text-[#E91E8C]">*</span></label>
              <input type="number" value={form.number} onChange={e => set('number', e.target.value)} placeholder="e.g. 9" min="1" max="99" required className={inputClass} style={inputStyle} />
            </div>
            <div>
              <label className="text-gray-300 text-xs font-medium block mb-1.5">Age</label>
              <input type="number" value={form.age} onChange={e => set('age', e.target.value)} placeholder="e.g. 24" className={inputClass} style={inputStyle} />
            </div>
          </div>

          <div>
            <label className="text-gray-300 text-xs font-medium block mb-1.5">Full Name <span className="text-[#E91E8C]">*</span></label>
            <input type="text" value={form.name} onChange={e => set('name', e.target.value)} placeholder="e.g. John Kamau" required className={inputClass} style={inputStyle} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-gray-300 text-xs font-medium block mb-1.5">Position <span className="text-[#E91E8C]">*</span></label>
              <select value={form.position} onChange={e => set('position', e.target.value)} className={inputClass} style={{ ...inputStyle, cursor: 'pointer' }}>
                {positions.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
            <div>
              <label className="text-gray-300 text-xs font-medium block mb-1.5">Nationality</label>
              <input type="text" value={form.nationality} onChange={e => set('nationality', e.target.value)} className={inputClass} style={inputStyle} />
            </div>
          </div>

          <label className="flex items-center gap-3 cursor-pointer group">
            <div
              onClick={() => set('isCaptain', !form.isCaptain)}
              className="relative w-11 h-6 rounded-full transition-all duration-300 flex-shrink-0"
              style={{ background: form.isCaptain ? '#E91E8C' : 'rgba(255,255,255,0.1)' }}
            >
              <div
                className="absolute top-0.5 w-5 h-5 rounded-full bg-white transition-all duration-300"
                style={{ left: form.isCaptain ? '22px' : '2px', boxShadow: '0 1px 3px rgba(0,0,0,0.4)' }}
              />
            </div>
            <span className="text-gray-300 text-sm">Mark as Team Captain</span>
          </label>
        </div>

        {/* Stats */}
        <div className="rounded-2xl p-5 space-y-4" style={{ background: '#141414', border: '1px solid rgba(255,255,255,0.06)' }}>
          <h3 className="text-white font-bold text-sm uppercase tracking-wider">Season Stats</h3>
          <div className="grid grid-cols-3 gap-4">
            {[
              { key: 'appearances', label: 'Appearances' },
              { key: 'goals', label: 'Goals' },
              { key: 'assists', label: 'Assists' },
            ].map(({ key, label }) => (
              <div key={key}>
                <label className="text-gray-300 text-xs font-medium block mb-1.5">{label}</label>
                <input type="number" value={form[key as keyof typeof form] as string} onChange={e => set(key, e.target.value)} min="0" className={inputClass} style={inputStyle} />
              </div>
            ))}
          </div>
        </div>

        {/* Bio */}
        <div className="rounded-2xl p-5 space-y-3" style={{ background: '#141414', border: '1px solid rgba(255,255,255,0.06)' }}>
          <h3 className="text-white font-bold text-sm uppercase tracking-wider">Player Bio</h3>
          <textarea
            value={form.bio}
            onChange={e => set('bio', e.target.value)}
            placeholder="Write a short bio about this player…"
            rows={4}
            className="w-full px-4 py-3 rounded-xl text-white text-sm outline-none resize-none transition-all"
            style={{ background: '#1E1E1E', border: '1px solid rgba(255,255,255,0.08)' }}
          />
        </div>

        <div className="flex items-center gap-3 pt-2">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-6 py-3 rounded-xl text-white font-bold text-sm transition-all hover:scale-105 disabled:opacity-70"
            style={{ background: 'linear-gradient(135deg, #E91E8C, #C4186F)' }}
          >
            <Save size={15} />
            {saving ? 'Saving…' : 'Save Player'}
          </button>
          <Link
            href="/admin/players"
            className="px-6 py-3 rounded-xl text-gray-300 text-sm font-semibold transition-all hover:text-white"
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  )
}
