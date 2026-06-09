'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Star, Check, Loader2 } from 'lucide-react'
import PageHeader from '@/components/ui/PageHeader'

interface Player {
  id: string
  number: number
  name: string
  position: string
  nationality: string
  isCaptain: boolean
  fifaRegistered?: boolean
  photo?: string | null
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
}

const posColors: Record<string, { bg: string; text: string }> = {
  Goalkeeper: { bg: 'bg-blue/10 text-blue-400', text: '#60A5FA' },
  Defender: { bg: 'bg-orange/10 text-orange-400', text: '#FB923C' },
  'Center Back': { bg: 'bg-blue/10 text-blue-400', text: '#60A5FA' },
  Midfielder: { bg: 'bg-purple/10 text-purple-400', text: '#A78BFA' },
  Forward: { bg: 'bg-pink/10 text-pink', text: '#E91E8C' },
}

export default function SquadClient() {
  const [players, setPlayers] = useState<Player[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/players')
      .then(res => res.json())
      .then(data => setPlayers(Array.isArray(data) ? data : []))
      .catch(() => setPlayers([]))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="bg-base text-white">
      <PageHeader eyebrow="Our Players" title="The" highlight="Squad" description="Eleven players. One mission. Conference League glory." />

      <section className="py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 size={32} className="text-pink animate-spin" />
            </div>
          ) : players.length === 0 ? (
            <div className="p-10 rounded-2xl bg-surface border border-white/8 text-center">
              <p className="text-gray-400 text-sm">
                Squad profiles will appear here as the team adds players.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
              {players.map(p => {
                const color = posColors[p.position] ?? posColors.Midfielder
                return (
                  <Link key={p.id} href={`/squad/${p.id}`}
                    className={`group block rounded-2xl border overflow-hidden transition-all hover:-translate-y-1 ${
                      p.isCaptain
                        ? 'bg-pink/8 border-pink/25 hover:border-pink/40'
                        : 'bg-surface border-white/8 hover:border-white/15'
                    }`}>
                    <div className={`h-1 w-full ${p.isCaptain ? 'bg-gradient-to-r from-pink via-gold to-pink' : 'bg-gradient-to-r from-white/20 to-transparent'}`} />
                    <div className={`aspect-square flex items-center justify-center text-6xl font-black ${
                      p.isCaptain
                        ? 'bg-gradient-to-br from-pink to-pink-dark text-white'
                        : 'bg-white/5 text-gray-700 group-hover:text-gray-600'
                    } relative overflow-hidden`}>
                      {p.photo ? (
                        <img src={p.photo} alt={p.name} className="absolute inset-0 w-full h-full object-cover" />
                      ) : (
                        p.name ? p.name.charAt(0).toUpperCase() : p.number
                      )}
                      {p.isCaptain && (
                        <div className="absolute -top-2 -right-2 size-7 rounded-full bg-gradient-to-br from-gold to-gold-light flex items-center justify-center z-10">
                          <Star size={13} fill="#080808" className="text-base" />
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div>
                          <p className="text-white font-black text-sm">{p.name || 'TBA'}</p>
                          <p className={`text-xs font-bold ${color.bg}`}>{p.position}</p>
                        </div>
                        {p.fifaRegistered && (
                          <div className="size-5 rounded-full bg-green-500/20 flex items-center justify-center" title="FIFA Registered">
                            <Check size={12} className="text-green-400" />
                          </div>
                        )}
                      </div>

                      {/* Position-specific stats */}
                      <div className="flex flex-wrap gap-2 text-xs text-gray-500 mb-2">
                        {p.position === 'Goalkeeper' && (
                          <>
                            <span>🛡️ {p.saves || 0}</span>
                            <span>✨ {p.cleanSheets || 0}</span>
                          </>
                        )}
                        {(p.position === 'Defender' || p.position === 'Center Back') && (
                          <>
                            <span>🛡️ {p.tackles || 0}</span>
                            <span>🎯 {p.interceptions || 0}</span>
                            <span>📍 {p.clearances || 0}</span>
                          </>
                        )}
                        {p.position === 'Midfielder' && (
                          <>
                            <span>🎯 {p.passes || 0}</span>
                            <span>📊 {p.passCompletion || 0}%</span>
                            <span>🛡️ {p.tackles || 0}</span>
                          </>
                        )}
                        {p.position === 'Forward' && (
                          <>
                            <span>⚽ {p.goals || 0}</span>
                            <span>🎯 {p.assists || 0}</span>
                            <span>🔫 {p.shots || 0}</span>
                          </>
                        )}
                        <span>🏃 {p.appearances || 0}</span>
                      </div>

                      <p className="text-gray-600 text-xs">#{p.number} · {p.nationality}</p>
                      <p className="text-pink text-[11px] font-bold mt-2 opacity-0 group-hover:opacity-100 transition-opacity">View profile →</p>
                    </div>
                  </Link>
                )
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
