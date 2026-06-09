import Link from 'next/link'
import PageHeader from '@/components/ui/PageHeader'
import { Calendar, MapPin, Trophy, Clock } from 'lucide-react'
import prisma from '@/lib/db'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Fixtures & Results',
  description: 'Eleven Stars FC Conference League fixtures and match results.',
}

export const dynamic = 'force-dynamic'

function formatDate(d?: Date | null) {
  if (!d) return 'Date TBA'
  return new Date(d).toLocaleDateString('en-KE', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })
}
function formatTime(d?: Date | null) {
  if (!d) return null
  const dt = new Date(d)
  const h = dt.getHours(), m = dt.getMinutes()
  if (h === 0 && m === 0) return null
  return dt.toLocaleTimeString('en-KE', { hour: '2-digit', minute: '2-digit' })
}

export default async function FixturesPage() {
  type Fixture = { id: string; homeTeam: string; awayTeam: string; date?: Date | null; venue: string; status: string; leagueName: string; homeScore?: number | null; awayScore?: number | null }
  type Standing = { id: string; teamName: string; position: number; played: number; won: number; drawn: number; lost: number; gf: number; ga: number; points: number; isOurTeam: boolean }

  let upcoming: Fixture[] = [], completed: Fixture[] = [], standings: Standing[] = []

  try {
    const all = await prisma.fixture.findMany({ orderBy: { date: 'asc' } })
    upcoming = all.filter(f => f.status === 'upcoming')
    completed = all.filter(f => f.status === 'completed')
  } catch { /* DB unavailable */ }

  try {
    standings = await prisma.standing.findMany({ orderBy: { position: 'asc' } })
  } catch { /* DB unavailable */ }

  // Auto-calc table from results if no manual standings entered
  const useAutoTable = standings.length === 0

  return (
    <div className="bg-base text-white">
      <PageHeader eyebrow="2026 Season" title="Fixtures &" highlight="Results" description="Conference League schedule and match results." />

      <section className="py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">

          {/* Upcoming */}
          <div>
            <h2 className="text-2xl sm:text-3xl font-black mb-6 flex items-center gap-3">
              <Trophy size={24} className="text-pink" /> Upcoming Matches
            </h2>
            {upcoming.length === 0 ? (
              <div className="rounded-2xl bg-surface border border-white/8 p-8 text-center">
                <p className="text-gray-400">No upcoming matches scheduled yet.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {upcoming.map(m => (
                  <div key={m.id} className="rounded-2xl bg-surface border border-white/8 p-6 hover:border-white/15 transition-colors">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div className="flex-1">
                        <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-2">{m.leagueName}</p>
                        <div className="flex items-center gap-3 mb-2">
                          <Calendar size={16} className="text-pink shrink-0" />
                          <span className="text-gray-400 text-sm">{formatDate(m.date)}{formatTime(m.date) ? ` · ${formatTime(m.date)}` : ''}</span>
                        </div>
                        <p className="text-xl font-black">{m.homeTeam} vs {m.awayTeam}</p>
                        <div className="flex items-center gap-3 mt-2 text-gray-400 text-sm">
                          <MapPin size={14} className="text-gold" /> {m.venue}
                        </div>
                      </div>
                      <Link href="/tickets" className="px-6 py-3 rounded-full bg-pink hover:bg-pink-dark text-white font-bold transition-colors whitespace-nowrap text-center">
                        Get Tickets
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Results */}
          <div>
            <h2 className="text-2xl sm:text-3xl font-black mb-6">Recent Results</h2>
            {completed.length === 0 ? (
              <div className="rounded-2xl bg-surface border border-white/8 p-8 text-center">
                <p className="text-gray-400">No results yet — the season is getting started!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {[...completed].reverse().map(m => {
                  const won = m.homeTeam === 'Eleven Stars FC' ? (m.homeScore ?? 0) > (m.awayScore ?? 0) : (m.awayScore ?? 0) > (m.homeScore ?? 0)
                  const drew = m.homeScore === m.awayScore
                  return (
                    <div key={m.id} className="rounded-2xl bg-surface border border-white/8 p-6">
                      <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-3">{m.leagueName} · {formatDate(m.date)}</p>
                      <div className="flex items-center gap-4">
                        <span className="text-white font-black text-lg flex-1 text-right">{m.homeTeam}</span>
                        <span className="px-5 py-2 rounded-xl font-black text-xl min-w-[80px] text-center" style={{ background: drew ? 'rgba(201,168,76,0.1)' : won ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)', color: drew ? '#C9A84C' : won ? '#4ADE80' : '#F87171' }}>
                          {m.homeScore} – {m.awayScore}
                        </span>
                        <span className="text-white font-black text-lg flex-1">{m.awayTeam}</span>
                      </div>
                      <div className="flex items-center gap-2 mt-3 text-gray-500 text-xs">
                        <MapPin size={11} className="text-gold" /> {m.venue}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {/* League Table */}
          <div>
            <h2 className="text-2xl sm:text-3xl font-black mb-6">League Table</h2>
            <div className="rounded-2xl bg-surface border border-white/8 overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/8 bg-surface-2">
                    <th className="px-3 py-4 text-left font-bold text-gray-400 w-8">#</th>
                    <th className="px-4 py-4 text-left font-bold text-gray-400">Team</th>
                    <th className="px-3 py-4 text-center font-bold text-gray-400">P</th>
                    <th className="px-3 py-4 text-center font-bold text-gray-400">W</th>
                    <th className="px-3 py-4 text-center font-bold text-gray-400">D</th>
                    <th className="px-3 py-4 text-center font-bold text-gray-400">L</th>
                    <th className="px-3 py-4 text-center font-bold text-gray-400 hidden sm:table-cell">GF</th>
                    <th className="px-3 py-4 text-center font-bold text-gray-400 hidden sm:table-cell">GA</th>
                    <th className="px-3 py-4 text-center font-bold text-gray-400">Pts</th>
                  </tr>
                </thead>
                <tbody>
                  {useAutoTable ? (
                    (() => {
                      const w = completed.filter(m => m.homeTeam === 'Eleven Stars FC' ? (m.homeScore ?? 0) > (m.awayScore ?? 0) : (m.awayScore ?? 0) > (m.homeScore ?? 0)).length
                      const d = completed.filter(m => m.homeScore === m.awayScore).length
                      const l = completed.length - w - d
                      return (
                        <tr className="border-b border-white/8 hover:bg-surface-2/50 transition-colors" style={{ background: 'rgba(233,30,140,0.04)' }}>
                          <td className="px-3 py-4 text-center text-gray-500 text-xs">1</td>
                          <td className="px-4 py-4 font-bold" style={{ color: '#E91E8C' }}>Eleven Stars FC</td>
                          <td className="px-3 py-4 text-center text-gray-400">{completed.length}</td>
                          <td className="px-3 py-4 text-center text-gray-400">{w}</td>
                          <td className="px-3 py-4 text-center text-gray-400">{d}</td>
                          <td className="px-3 py-4 text-center text-gray-400">{l}</td>
                          <td className="px-3 py-4 text-center text-gray-400 hidden sm:table-cell">—</td>
                          <td className="px-3 py-4 text-center text-gray-400 hidden sm:table-cell">—</td>
                          <td className="px-3 py-4 text-center text-pink font-bold">{w * 3 + d}</td>
                        </tr>
                      )
                    })()
                  ) : (
                    standings.map((s, i) => (
                      <tr key={s.id} className="border-b border-white/8 hover:bg-surface-2/50 transition-colors" style={{ background: s.isOurTeam ? 'rgba(233,30,140,0.04)' : undefined }}>
                        <td className="px-3 py-4 text-center text-gray-500 text-xs">{s.position || i + 1}</td>
                        <td className="px-4 py-4 font-bold" style={{ color: s.isOurTeam ? '#E91E8C' : '#fff' }}>
                          {s.teamName}
                          {s.isOurTeam && <span className="ml-2 text-[10px] px-1.5 py-0.5 rounded-full bg-pink/15 text-pink font-semibold">Us</span>}
                        </td>
                        <td className="px-3 py-4 text-center text-gray-400">{s.played}</td>
                        <td className="px-3 py-4 text-center text-gray-400">{s.won}</td>
                        <td className="px-3 py-4 text-center text-gray-400">{s.drawn}</td>
                        <td className="px-3 py-4 text-center text-gray-400">{s.lost}</td>
                        <td className="px-3 py-4 text-center text-gray-400 hidden sm:table-cell">{s.gf}</td>
                        <td className="px-3 py-4 text-center text-gray-400 hidden sm:table-cell">{s.ga}</td>
                        <td className="px-3 py-4 text-center font-bold" style={{ color: s.isOurTeam ? '#E91E8C' : '#C9A84C' }}>{s.points}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            <p className="text-gray-500 text-xs mt-4 text-center">
              {useAutoTable ? 'Table auto-calculated from match results. Admin can set full standings in the admin panel.' : 'Updated by the admin as the season progresses.'}
            </p>
          </div>

        </div>
      </section>
    </div>
  )
}
