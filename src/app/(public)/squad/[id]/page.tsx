import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, Star, Check, Flag, Hash, Dumbbell, PlayCircle } from 'lucide-react'
import prisma from '@/lib/db'
import type { Player } from '@prisma/client'
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'

const POS_COLOR: Record<string, string> = {
  Goalkeeper: '#FBBF24',
  Defender: '#60A5FA',
  'Center Back': '#60A5FA',
  Midfielder: '#4ADE80',
  Forward: '#E91E8C',
}

const STAT_LABEL: Record<string, string> = {
  appearances: 'Appearances',
  goals: 'Goals',
  assists: 'Assists',
  shots: 'Shots',
  shotAccuracy: 'Shot Accuracy',
  dribbles: 'Dribbles',
  tackles: 'Tackles',
  interceptions: 'Interceptions',
  clearances: 'Clearances',
  blocks: 'Blocks',
  passes: 'Passes',
  passCompletion: 'Pass Completion',
  saves: 'Saves',
  cleanSheets: 'Clean Sheets',
  goalsAgainst: 'Goals Against',
}
const PERCENT_STATS = new Set(['shotAccuracy', 'passCompletion'])

function statsForPosition(position: string): (keyof Player)[] {
  switch (position) {
    case 'Goalkeeper':
      return ['saves', 'cleanSheets', 'goalsAgainst', 'appearances']
    case 'Defender':
    case 'Center Back':
      return ['tackles', 'interceptions', 'clearances', 'blocks', 'appearances']
    case 'Midfielder':
      return ['passes', 'passCompletion', 'tackles', 'assists', 'appearances']
    case 'Forward':
      return ['goals', 'assists', 'shots', 'shotAccuracy', 'dribbles', 'appearances']
    default:
      return ['appearances', 'goals', 'assists']
  }
}

/** Build a YouTube embed URL from common share/watch/shorts links. Returns null if not YouTube. */
function youtubeEmbed(url: string): string | null {
  try {
    const u = new URL(url)
    const host = u.hostname.replace('www.', '')
    if (host === 'youtu.be') return `https://www.youtube.com/embed/${u.pathname.slice(1)}`
    if (host.endsWith('youtube.com')) {
      if (u.pathname.startsWith('/watch')) return `https://www.youtube.com/embed/${u.searchParams.get('v')}`
      if (u.pathname.startsWith('/shorts/')) return `https://www.youtube.com/embed/${u.pathname.split('/')[2]}`
      if (u.pathname.startsWith('/embed/')) return url
    }
    return null
  } catch {
    return null
  }
}

type Drill = { title: string; url: string }
function parseDrills(raw: string | null): Drill[] {
  if (!raw) return []
  try {
    const arr = JSON.parse(raw)
    if (!Array.isArray(arr)) return []
    return arr.filter((d): d is Drill => d && typeof d.url === 'string' && d.url.length > 0)
  } catch {
    return []
  }
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params
  let player: Player | null = null
  try {
    player = await prisma.player.findUnique({ where: { id } })
  } catch { /* DB unavailable */ }
  if (!player) return { title: 'Player' }
  return {
    title: `${player.name} · #${player.number}`,
    description: `${player.name} — ${player.position} for Eleven Stars FC.`,
  }
}

export default async function PlayerProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  let player: Player | null = null
  try {
    player = await prisma.player.findUnique({ where: { id } })
  } catch { /* DB unavailable */ }

  if (!player) notFound()

  const accent = POS_COLOR[player.position] ?? '#E91E8C'
  const stats = statsForPosition(player.position)
  const drills = parseDrills(player.drills)

  return (
    <div className="bg-base text-white min-h-screen">
      {/* ── HERO ─────────────────────────────────── */}
      <section className="relative pt-24 pb-12 sm:pt-28 sm:pb-16"
        style={{ background: `radial-gradient(ellipse 80% 60% at 50% 0%, ${accent}22 0%, transparent 65%)` }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/squad" className="inline-flex items-center gap-2 text-gray-400 hover:text-white text-sm font-semibold mb-8 transition-colors">
            <ArrowLeft size={16} /> Back to Squad
          </Link>

          <div className="flex flex-col sm:flex-row gap-8 items-center sm:items-stretch">
            {/* Photo */}
            <div className="relative w-48 h-48 sm:w-56 sm:h-56 rounded-3xl overflow-hidden shrink-0 flex items-center justify-center text-7xl font-black"
              style={{ background: player.photo ? '#111' : `linear-gradient(135deg, ${accent}, #0A0A0A)`, border: `1px solid ${accent}40` }}>
              {player.photo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={player.photo} alt={player.name} className="w-full h-full object-cover" />
              ) : (
                <span className="text-white/90">{player.name.charAt(0).toUpperCase()}</span>
              )}
              {player.isCaptain && (
                <div className="absolute top-3 right-3 size-9 rounded-full bg-gradient-to-br from-gold to-gold-light flex items-center justify-center">
                  <Star size={16} fill="#080808" className="text-base" />
                </div>
              )}
            </div>

            {/* Identity */}
            <div className="flex-1 flex flex-col justify-center text-center sm:text-left">
              <div className="flex items-center justify-center sm:justify-start gap-3 mb-3">
                <span className="inline-flex items-center gap-1 text-sm font-black px-3 py-1 rounded-full"
                  style={{ background: `${accent}1A`, color: accent }}>
                  <Hash size={13} /> {player.number}
                </span>
                <span className="px-3 py-1 rounded-full text-sm font-bold"
                  style={{ background: `${accent}1A`, color: accent }}>
                  {player.position}
                </span>
                {player.isCaptain && (
                  <span className="px-3 py-1 rounded-full text-sm font-bold bg-gold/15 text-gold">Captain</span>
                )}
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight mb-3">{player.name}</h1>

              <div className="flex items-center justify-center sm:justify-start gap-4 text-gray-400 text-sm">
                <span className="inline-flex items-center gap-1.5"><Flag size={14} className="text-gold" /> {player.nationality}</span>
                {player.fifaRegistered && (
                  <span className="inline-flex items-center gap-1.5 text-green-400">
                    <span className="size-4 rounded-full bg-green-500/20 flex items-center justify-center"><Check size={11} /></span>
                    FIFA Registered
                  </span>
                )}
              </div>

              {player.bio && (
                <p className="text-gray-400 text-sm leading-relaxed mt-5 max-w-2xl">{player.bio}</p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS ────────────────────────────────── */}
      <section className="py-12 lg:py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-black mb-6 flex items-center gap-3">
            <div className="h-7 w-1 rounded-full" style={{ background: accent }} />
            Season Stats
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {stats.map(key => {
              const value = (player![key] as number | null) ?? 0
              return (
                <div key={key} className="rounded-2xl bg-surface border border-white/8 p-6 text-center">
                  <p className="text-4xl font-black mb-1" style={{ color: accent }}>
                    {value}{PERCENT_STATS.has(key as string) ? '%' : ''}
                  </p>
                  <p className="text-gray-400 text-sm font-semibold">{STAT_LABEL[key as string] ?? key}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── TRAINING & DRILLS ────────────────────── */}
      <section className="pb-20 lg:pb-28">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-black mb-6 flex items-center gap-3">
            <Dumbbell size={24} style={{ color: accent }} /> Training &amp; Drills
          </h2>

          {drills.length === 0 ? (
            <div className="rounded-2xl bg-surface border border-white/8 p-8 text-center">
              <p className="text-gray-400 text-sm">No drills uploaded yet for {player.name}.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {drills.map((drill, i) => {
                const embed = youtubeEmbed(drill.url)
                return (
                  <div key={i} className="rounded-2xl bg-surface border border-white/8 overflow-hidden">
                    {embed ? (
                      <div className="relative w-full" style={{ aspectRatio: '16 / 9' }}>
                        <iframe
                          src={embed}
                          title={drill.title || `Drill ${i + 1}`}
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          className="absolute inset-0 w-full h-full"
                        />
                      </div>
                    ) : (
                      <a href={drill.url} target="_blank" rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 w-full py-12 bg-white/5 hover:bg-white/10 transition-colors text-pink font-bold">
                        <PlayCircle size={22} /> Watch drill
                      </a>
                    )}
                    <div className="p-4">
                      <p className="font-bold text-white text-sm">{drill.title || `Drill ${i + 1}`}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
