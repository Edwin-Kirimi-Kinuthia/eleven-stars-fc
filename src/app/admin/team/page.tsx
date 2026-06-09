'use client'

import { useState, useEffect } from 'react'
import { Pencil, Save, X, Plus, Trash2, Loader2 } from 'lucide-react'
import ImageUpload from '@/components/admin/ImageUpload'

interface Member {
  id: string
  name: string
  role: string
  bio?: string | null
  avatar?: string | null
}

const roleOptions = [
  'Team Captain & Founder',
  'Head Coach',
  'Assistant Coach',
  'Team Manager',
  'Club Chairman',
  'Secretary',
  'Treasurer',
  'Technical Director',
  'Fitness Coach',
  'Goalkeeper Coach',
  'Kit Manager',
]

const inputClass = 'w-full px-3 py-2.5 rounded-xl text-white text-sm outline-none'
const inputStyle = { background: '#1A1A1A', border: '1px solid rgba(255,255,255,0.1)' }

export default function AdminTeamPage() {
  const [members, setMembers] = useState<Member[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editForm, setEditForm] = useState<Partial<Member>>({})
  const [showNew, setShowNew] = useState(false)
  const [newForm, setNewForm] = useState({ name: '', role: 'Head Coach', bio: '', avatar: '' })
  const [saving, setSaving] = useState(false)

  useEffect(() => { fetchMembers() }, [])

  const fetchMembers = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/team')
      const data = await res.json()
      setMembers(Array.isArray(data) ? data : [])
    } catch (e) {
      console.error(e)
      setMembers([])
    } finally {
      setLoading(false)
    }
  }

  const startEdit = (m: Member) => { setEditingId(m.id); setEditForm({ ...m }) }
  const cancelEdit = () => { setEditingId(null); setEditForm({}) }

  const saveEdit = async () => {
    if (!editingId) return
    setSaving(true)
    try {
      const res = await fetch(`/api/team/${editingId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editForm),
      })
      if (res.ok) { await fetchMembers(); cancelEdit() }
    } catch (e) { console.error(e) }
    finally { setSaving(false) }
  }

  const deleteMember = async (id: string) => {
    if (!confirm('Remove this member?')) return
    try {
      const res = await fetch(`/api/team/${id}`, { method: 'DELETE' })
      if (res.ok) await fetchMembers()
    } catch (e) { console.error(e) }
  }

  const addMember = async () => {
    setSaving(true)
    try {
      const res = await fetch('/api/team', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newForm),
      })
      if (res.ok) {
        await fetchMembers()
        setNewForm({ name: '', role: 'Head Coach', bio: '', avatar: '' })
        setShowNew(false)
      }
    } catch (e) { console.error(e) }
    finally { setSaving(false) }
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
          <h1 className="text-white text-2xl font-black">Team Management</h1>
          <p className="text-gray-400 text-sm mt-0.5">Edit coaches, staff, and board members</p>
        </div>
        <button
          onClick={() => setShowNew(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-white text-sm font-semibold transition-all hover:scale-105"
          style={{ background: 'linear-gradient(135deg, #E91E8C, #C4186F)' }}
        >
          <Plus size={16} /> Add Member
        </button>
      </div>

      {/* Add new form */}
      {showNew && (
        <div className="rounded-2xl p-6 space-y-4" style={{ background: '#141414', border: '1px solid rgba(233,30,140,0.2)' }}>
          <h3 className="text-white font-bold text-sm">New Management Member</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-gray-400 text-xs block mb-1.5">Full Name</label>
              <input
                value={newForm.name}
                onChange={e => setNewForm(p => ({ ...p, name: e.target.value }))}
                placeholder="e.g. John Maina"
                className={inputClass}
                style={inputStyle}
              />
            </div>
            <div>
              <label className="text-gray-400 text-xs block mb-1.5">Role</label>
              <select
                value={newForm.role}
                onChange={e => setNewForm(p => ({ ...p, role: e.target.value }))}
                className={inputClass}
                style={{ ...inputStyle, cursor: 'pointer' }}
              >
                {roleOptions.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="text-gray-400 text-xs block mb-1.5">Bio / Description</label>
            <textarea
              value={newForm.bio}
              onChange={e => setNewForm(p => ({ ...p, bio: e.target.value }))}
              placeholder="Brief description of their role and background…"
              rows={2}
              className="w-full px-3 py-2.5 rounded-xl text-white text-sm outline-none resize-none"
              style={inputStyle}
            />
          </div>
          <ImageUpload
            value={newForm.avatar || null}
            onChange={url => setNewForm(p => ({ ...p, avatar: url }))}
            label="Photo (optional)"
          />
          <div className="flex gap-3">
            <button
              onClick={addMember}
              disabled={saving || !newForm.name.trim()}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-white text-sm font-bold disabled:opacity-50"
              style={{ background: 'linear-gradient(135deg, #E91E8C, #C4186F)' }}
            >
              {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />} Add
            </button>
            <button
              onClick={() => setShowNew(false)}
              className="px-5 py-2.5 rounded-xl text-gray-300 text-sm"
              style={{ background: 'rgba(255,255,255,0.06)' }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Members list */}
      {members.length === 0 ? (
        <div className="p-10 rounded-2xl bg-surface border border-white/8 text-center">
          <p className="text-gray-400 text-sm">No team members yet. Add the first one above.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {members.map(member => {
            const isCaptain = member.role === 'Team Captain & Founder'
            return (
              <div
                key={member.id}
                className="rounded-2xl p-5"
                style={{
                  background: isCaptain ? 'linear-gradient(135deg, #140a0f, #1a0812)' : '#141414',
                  border: isCaptain ? '1px solid rgba(233,30,140,0.25)' : '1px solid rgba(255,255,255,0.06)',
                }}
              >
                {editingId === member.id ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-gray-400 text-xs block mb-1.5">Full Name</label>
                        <input
                          value={editForm.name ?? ''}
                          onChange={e => setEditForm(p => ({ ...p, name: e.target.value }))}
                          className={inputClass}
                          style={inputStyle}
                        />
                      </div>
                      <div>
                        <label className="text-gray-400 text-xs block mb-1.5">Role</label>
                        <select
                          value={editForm.role ?? ''}
                          onChange={e => setEditForm(p => ({ ...p, role: e.target.value }))}
                          className={inputClass}
                          style={{ ...inputStyle, cursor: 'pointer' }}
                        >
                          {roleOptions.map(r => <option key={r} value={r}>{r}</option>)}
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="text-gray-400 text-xs block mb-1.5">Bio / Description</label>
                      <textarea
                        value={editForm.bio ?? ''}
                        onChange={e => setEditForm(p => ({ ...p, bio: e.target.value }))}
                        rows={2}
                        className="w-full px-3 py-2.5 rounded-xl text-white text-sm outline-none resize-none"
                        style={inputStyle}
                      />
                    </div>
                    <ImageUpload
                      value={editForm.avatar ?? null}
                      onChange={url => setEditForm(p => ({ ...p, avatar: url }))}
                      label="Photo (optional)"
                    />
                    <div className="flex gap-3">
                      <button
                        onClick={saveEdit}
                        disabled={saving}
                        className="flex items-center gap-2 px-5 py-2 rounded-xl text-white text-sm font-bold disabled:opacity-50"
                        style={{ background: 'linear-gradient(135deg, #E91E8C, #C4186F)' }}
                      >
                        {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />} Save
                      </button>
                      <button
                        onClick={cancelEdit}
                        className="w-8 h-8 flex items-center justify-center rounded-xl text-gray-400 hover:text-white"
                        style={{ background: 'rgba(255,255,255,0.06)' }}
                      >
                        <X size={14} />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start gap-4">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center text-lg font-black flex-shrink-0 overflow-hidden"
                      style={{
                        background: isCaptain ? 'linear-gradient(135deg, #E91E8C, #C4186F)' : 'rgba(255,255,255,0.06)',
                        color: '#fff',
                      }}
                    >
                      {member.avatar ? (
                        <img src={member.avatar} alt={member.name} className="w-full h-full object-cover" />
                      ) : (
                        member.name ? member.name.charAt(0) : '?'
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-bold text-sm">{member.name || <span className="text-gray-500 italic">Name not set</span>}</p>
                      <p className="text-xs font-semibold mb-1" style={{ color: isCaptain ? '#E91E8C' : '#C9A84C' }}>{member.role}</p>
                      <p className="text-gray-400 text-sm leading-relaxed">
                        {member.bio || <span className="italic text-gray-600">No description added yet</span>}
                      </p>
                    </div>
                    <div className="flex gap-1 flex-shrink-0">
                      <button
                        onClick={() => startEdit(member)}
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-white transition-all hover:bg-white/10"
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        onClick={() => deleteMember(member.id)}
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-red-400 transition-all hover:bg-red-500/10"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
