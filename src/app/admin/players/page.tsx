'use client'

import { useState, useEffect } from 'react'
import { Plus, Search, Star, Pencil, Trash2, Loader2 } from 'lucide-react'
import PlayerStatsForm from '@/components/admin/PlayerStatsForm'
import ImageUpload from '@/components/admin/ImageUpload'

interface Player {
  id: string
  number: number
  name: string
  position: string
  nationality: string
  isCaptain: boolean
  goals?: number
  assists?: number
  appearances?: number
  tackles?: number
  interceptions?: number
  clearances?: number
  blocks?: number
  passes?: number
  passCompletion?: number
  saves?: number
  cleanSheets?: number
  goalsAgainst?: number
  shots?: number
  shotAccuracy?: number
  dribbles?: number
  fifaRegistered?: boolean
  photo?: string
  bio?: string
  drills?: string
}

const positionColors: Record<string, { bg: string; text: string }> = {
  Goalkeeper: { bg: 'rgba(251,191,36,0.15)', text: '#FBBF24' },
  Defender: { bg: 'rgba(59,130,246,0.15)', text: '#60A5FA' },
  'Center Back': { bg: 'rgba(59,130,246,0.15)', text: '#60A5FA' },
  Midfielder: { bg: 'rgba(34,197,94,0.15)', text: '#4ADE80' },
  Forward: { bg: 'rgba(233,30,140,0.15)', text: '#E91E8C' },
}

export default function AdminPlayersPage() {
  const [players, setPlayers] = useState<Player[]>([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingPlayer, setEditingPlayer] = useState<Player | null>(null)

  // Fetch players
  useEffect(() => {
    fetchPlayers()
  }, [])

  const fetchPlayers = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/players')
      const data = await res.json()
      // Ensure data is an array
      if (Array.isArray(data)) {
        setPlayers(data)
      } else {
        console.error('API returned non-array data:', data)
        setPlayers([])
      }
    } catch (error) {
      console.error('Error fetching players:', error)
      setPlayers([])
    } finally {
      setLoading(false)
    }
  }

  const filtered = players.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.position.toLowerCase().includes(search.toLowerCase())
  )

  const handleSavePlayer = async () => {
    if (!editingPlayer) return

    try {
      const method = editingPlayer.id.startsWith('new-') ? 'POST' : 'PATCH'
      const url = editingPlayer.id.startsWith('new-')
        ? '/api/players'
        : `/api/players/${editingPlayer.id}`

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingPlayer),
      })

      if (res.ok) {
        await fetchPlayers()
        setEditingId(null)
        setEditingPlayer(null)
      }
    } catch (error) {
      console.error('Error saving player:', error)
    }
  }

  const deletePlayer = async (id: string) => {
    if (!confirm('Delete this player?')) return

    try {
      const res = await fetch(`/api/players/${id}`, { method: 'DELETE' })
      if (res.ok) {
        await fetchPlayers()
      }
    } catch (error) {
      console.error('Error deleting player:', error)
    }
  }

  const startNewPlayer = () => {
    const newPlayer: Player = {
      id: `new-${Date.now()}`,
      number: Math.max(0, ...players.map(p => p.number)) + 1,
      name: '',
      position: 'Midfielder',
      nationality: 'Kenya',
      isCaptain: false,
      goals: 0,
      assists: 0,
      appearances: 0,
    }
    setEditingPlayer(newPlayer)
    setEditingId(newPlayer.id)
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
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-white text-2xl font-black">Players</h1>
          <p className="text-gray-400 text-sm mt-0.5">{players.length} squad members</p>
        </div>
        <button
          onClick={startNewPlayer}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-white text-sm font-semibold transition-all hover:scale-105"
          style={{ background: 'linear-gradient(135deg, #E91E8C, #C4186F)' }}
        >
          <Plus size={16} /> Add Player
        </button>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search players…"
          className="w-full pl-10 pr-4 py-2.5 rounded-xl text-white text-sm outline-none"
          style={{ background: '#141414', border: '1px solid rgba(255,255,255,0.08)' }}
        />
      </div>

      {/* Edit Modal */}
      {editingPlayer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70">
          <div className="bg-surface rounded-2xl border border-white/10 max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-4">
            <h2 className="text-white font-black text-xl">Edit Player</h2>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-gray-400 text-xs font-bold block mb-2">Name</label>
                <input
                  type="text"
                  value={editingPlayer.name}
                  onChange={(e) => setEditingPlayer({ ...editingPlayer, name: e.target.value })}
                  className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-lg text-white text-sm"
                />
              </div>
              <div>
                <label className="text-gray-400 text-xs font-bold block mb-2">Number</label>
                <input
                  type="number"
                  value={editingPlayer.number}
                  onChange={(e) => setEditingPlayer({ ...editingPlayer, number: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-lg text-white text-sm"
                />
              </div>
              <div>
                <label className="text-gray-400 text-xs font-bold block mb-2">Position</label>
                <select
                  value={editingPlayer.position}
                  onChange={(e) => setEditingPlayer({ ...editingPlayer, position: e.target.value })}
                  className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-lg text-white text-sm"
                >
                  <option>Goalkeeper</option>
                  <option>Defender</option>
                  <option>Center Back</option>
                  <option>Midfielder</option>
                  <option>Forward</option>
                </select>
              </div>
              <div>
                <label className="text-gray-400 text-xs font-bold block mb-2">Nationality</label>
                <input
                  type="text"
                  value={editingPlayer.nationality}
                  onChange={(e) => setEditingPlayer({ ...editingPlayer, nationality: e.target.value })}
                  className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-lg text-white text-sm"
                />
              </div>
            </div>

            <label className="flex items-center gap-2 p-3 rounded-lg bg-white/5 cursor-pointer">
              <input
                type="checkbox"
                checked={editingPlayer.isCaptain}
                onChange={(e) => setEditingPlayer({ ...editingPlayer, isCaptain: e.target.checked })}
              />
              <span className="text-white text-sm font-bold">Captain</span>
            </label>

            {/* Photo Upload */}
            <ImageUpload
              value={editingPlayer.photo || null}
              onChange={(url) => setEditingPlayer({ ...editingPlayer, photo: url })}
              label="Player Photo"
            />

            {/* Stats Form */}
            <PlayerStatsForm
              position={editingPlayer.position}
              stats={editingPlayer}
              onChange={(stats) => setEditingPlayer({ ...editingPlayer, ...stats })}
            />

            {/* Bio */}
            <div>
              <label className="text-gray-400 text-xs font-bold block mb-2">Bio / About</label>
              <textarea
                value={editingPlayer.bio || ''}
                onChange={(e) => setEditingPlayer({ ...editingPlayer, bio: e.target.value })}
                rows={3}
                placeholder="Short bio shown on the player's profile page…"
                className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-lg text-white text-sm resize-y"
              />
            </div>

            {/* Drills editor */}
            {(() => {
              let drills: { title: string; url: string }[] = []
              try { drills = editingPlayer.drills ? JSON.parse(editingPlayer.drills) : [] } catch { drills = [] }
              if (!Array.isArray(drills)) drills = []
              const commit = (next: { title: string; url: string }[]) =>
                setEditingPlayer({ ...editingPlayer, drills: next.length ? JSON.stringify(next) : '' })
              return (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-gray-400 text-xs font-bold">Training Drills (videos)</label>
                    <button
                      type="button"
                      onClick={() => commit([...drills, { title: '', url: '' }])}
                      className="text-pink text-xs font-bold hover:text-pink-light"
                    >
                      + Add drill
                    </button>
                  </div>
                  <p className="text-gray-600 text-[11px] mb-3">Paste a YouTube link (watch, shorts or youtu.be) to embed it, or any other video URL to link out.</p>
                  <div className="space-y-2">
                    {drills.length === 0 && (
                      <p className="text-gray-600 text-xs italic">No drills yet.</p>
                    )}
                    {drills.map((d, i) => (
                      <div key={i} className="flex gap-2">
                        <input
                          value={d.title}
                          onChange={(e) => { const n = [...drills]; n[i] = { ...n[i], title: e.target.value }; commit(n) }}
                          placeholder="Title"
                          className="w-1/3 px-3 py-2 bg-black/40 border border-white/10 rounded-lg text-white text-sm"
                        />
                        <input
                          value={d.url}
                          onChange={(e) => { const n = [...drills]; n[i] = { ...n[i], url: e.target.value }; commit(n) }}
                          placeholder="https://youtube.com/…"
                          className="flex-1 px-3 py-2 bg-black/40 border border-white/10 rounded-lg text-white text-sm"
                        />
                        <button
                          type="button"
                          onClick={() => commit(drills.filter((_, j) => j !== i))}
                          className="w-9 shrink-0 rounded-lg flex items-center justify-center text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-all"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )
            })()}

            {/* Actions */}
            <div className="flex gap-2 pt-4">
              <button
                onClick={handleSavePlayer}
                className="flex-1 px-4 py-2.5 rounded-lg bg-pink hover:bg-pink-dark text-white font-bold transition-colors"
              >
                Save Player
              </button>
              <button
                onClick={() => { setEditingId(null); setEditingPlayer(null) }}
                className="flex-1 px-4 py-2.5 rounded-lg bg-white/10 hover:bg-white/15 text-gray-300 font-bold transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Players Table */}
      <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="grid grid-cols-12 px-5 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500" style={{ background: '#141414', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <span className="col-span-1">#</span>
          <span className="col-span-4">Name</span>
          <span className="col-span-3">Position</span>
          <span className="col-span-2">Nationality</span>
          <span className="col-span-2 text-right">Actions</span>
        </div>

        {filtered.map(player => {
          const posColor = positionColors[player.position]
          return (
            <div key={player.id} className="grid grid-cols-12 px-5 py-4 items-center transition-colors hover:bg-white/[0.02]" style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
              <span className="col-span-1 text-gray-400 text-sm font-bold">{player.number}</span>
              <span className="col-span-4 flex items-center gap-2">
                <span className="text-white text-sm font-semibold">{player.name}</span>
                {player.isCaptain && <Star size={12} fill="#C9A84C" style={{ color: '#C9A84C' }} />}
              </span>
              <span className="col-span-3">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold" style={{ background: posColor.bg, color: posColor.text }}>
                  {player.position}
                </span>
              </span>
              <span className="col-span-2 text-gray-400 text-sm">{player.nationality}</span>
              <div className="col-span-2 flex items-center justify-end gap-2">
                <button
                  onClick={() => { setEditingPlayer(player); setEditingId(player.id) }}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-white transition-all hover:bg-white/10"
                >
                  <Pencil size={14} />
                </button>
                <button
                  onClick={() => deletePlayer(player.id)}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-red-400 transition-all hover:bg-red-500/10"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
