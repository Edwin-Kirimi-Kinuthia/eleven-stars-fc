import Image from 'next/image'
import Link from 'next/link'
import { Eye, Target, Heart, Star, Trophy, Users, ArrowRight, MapPin, Zap, Shield, TrendingUp } from 'lucide-react'
import prisma from '@/lib/db'
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'About Us — Eleven Stars FC',
  description: 'The history, vision, mission and management of Eleven Stars FC. Born in Meru. Rising to greatness.',
}

const milestones = [
  {
    year: '2022',
    title: 'The Dream Begins',
    icon: Star,
    color: '#E91E8C',
    description: "Wesley Mwenda gathers eleven passionate players from Meru and forms Eleven Stars FC. With no budget but boundless belief, the journey begins on local pitches with one shared dream.",
  },
  {
    year: '2023',
    title: 'Building the Squad',
    icon: Users,
    color: '#C9A84C',
    description: "The club grows — local tournaments, a growing reputation, and community support attract more talented players. Eleven Stars becomes a name that people in Meru know and respect.",
  },
  {
    year: '2024',
    title: 'Sponsors & Structure',
    icon: Shield,
    color: '#E91E8C',
    description: "Akash Ltd and Moxi Aluminium become official sponsors — a turning point that enables professional kits, better training facilities, and a real path toward national competition.",
  },
  {
    year: '2026',
    title: 'Conference League',
    icon: Trophy,
    color: '#C9A84C',
    description: "History is made. Eleven Stars FC earns promotion to the Conference League — becoming the first club from Meru County to compete at this national stage. A county celebrates.",
  },
]

export default async function AboutPage() {
  let management: { id: string; name: string; role: string; bio?: string | null; avatar?: string | null }[] = []
  try {
    management = await prisma.teamMember.findMany({ orderBy: { createdAt: 'asc' } })
  } catch { /* DB unavailable */ }

  const foundingMember = management.find(m => m.role === 'Team Captain & Founder')

  return (
    <div className="bg-base text-white overflow-x-hidden">

      {/* HERO */}
      <section className="relative min-h-screen flex flex-col items-center justify-center py-24"
        style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px)', backgroundSize: '60px 60px' }}>
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 90% 60% at 50% -10%, rgba(233,30,140,0.14) 0%, transparent 65%)' }} />
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 50% 40% at 85% 85%, rgba(201,168,76,0.07) 0%, transparent 60%)' }} />

        {/* Decorative stars */}
        {([
          [14, 8, '#E91E8C', 0.55, 14],
          [22, 91, '#C9A84C', 0.45, 9],
          [60, 6, '#E91E8C', 0.35, 7],
          [72, 93, '#C9A84C', 0.4, 11],
          [38, 13, '#fff', 0.25, 5],
          [48, 88, '#fff', 0.2, 6],
        ] as [number, number, string, number, number][]).map(([top, left, color, opacity, size], i) => (
          <div key={i} className="absolute pointer-events-none" style={{ top: `${top}%`, left: `${left}%`, opacity }}>
            <svg width={size} height={size} viewBox="0 0 10 10"><polygon points="5,0 6.2,3.8 10,3.8 7,6.2 8.2,10 5,7.6 1.8,10 3,6.2 0,3.8 3.8,3.8" fill={color} /></svg>
          </div>
        ))}

        <div className="relative z-10 max-w-5xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-8 text-xs font-bold tracking-widest uppercase" style={{ background: 'rgba(233,30,140,0.1)', border: '1px solid rgba(233,30,140,0.3)', color: '#E91E8C' }}>
            <MapPin size={11} /> Meru, Kenya · Est. 2022
          </div>

          <h1 className="font-black leading-[0.88] mb-6">
            <span className="block text-[clamp(3.5rem,13vw,9.5rem)] tracking-tight" style={{ background: 'linear-gradient(135deg, #fff 20%, #E91E8C 55%, #C9A84C 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              ELEVEN
            </span>
            <span className="block text-[clamp(3.5rem,13vw,9.5rem)] tracking-tight text-white">
              STARS FC
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-gray-400 mb-12 max-w-xl mx-auto leading-relaxed">
            Born in the heart of <span className="text-white font-semibold">Meru</span>. Built on passion.
            Writing the county&apos;s most exciting football story.
          </p>

          <div className="inline-grid grid-cols-2 sm:grid-cols-4 gap-px rounded-2xl overflow-hidden" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
            {[
              { value: '2022', label: 'Founded' },
              { value: '2026', label: 'Conference League' },
              { value: 'Meru', label: 'Home County' },
              { value: '1st', label: 'From Meru in CL' },
            ].map(({ value, label }) => (
              <div key={label} className="px-7 py-5" style={{ background: 'rgba(8,8,8,0.85)' }}>
                <p className="font-black text-xl text-white">{value}</p>
                <p className="text-gray-500 text-xs mt-0.5">{label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 opacity-30">
          <div className="w-px h-10" style={{ background: 'linear-gradient(to bottom, transparent, #E91E8C)' }} />
          <div className="size-1.5 rounded-full bg-pink" />
        </div>
      </section>

      {/* ORIGIN STORY */}
      <section className="py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-6 text-xs font-bold uppercase tracking-widest" style={{ background: 'rgba(201,168,76,0.1)', border: '1px solid rgba(201,168,76,0.25)', color: '#C9A84C' }}>
                <Zap size={11} /> Our Origin Story
              </div>
              <h2 className="text-4xl sm:text-5xl font-black leading-tight mb-6">
                From Zero to<br />
                <span style={{ background: 'linear-gradient(135deg, #E91E8C, #C9A84C)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Conference League</span>
              </h2>
              <div className="space-y-5 text-gray-400 leading-relaxed">
                <p>Eleven Stars FC was born in the heart of Meru — a club created not just to play football, but to represent a community, inspire a generation, and prove that talent from Meru can compete at the highest levels.</p>
                <p>Founded by <span className="text-gold font-semibold">Wesley Mwenda</span>, whose love for the game drove him to build something lasting, the club started with nothing but a vision and eleven determined players ready to give everything.</p>
                <p>From humble beginnings on local pitches to earning promotion to the <span className="text-white font-semibold">Conference League</span> in 2026, Eleven Stars FC now carries the hopes and dreams of an entire county.</p>
              </div>
            </div>
            <div>
              <blockquote className="relative p-8 sm:p-10 rounded-3xl" style={{ background: 'linear-gradient(135deg, rgba(233,30,140,0.08), rgba(10,10,10,0.98))', border: '1px solid rgba(233,30,140,0.2)' }}>
                <div className="absolute top-6 right-8 text-8xl font-black opacity-10 leading-none select-none" style={{ color: '#E91E8C' }}>&ldquo;</div>
                <p className="relative text-xl sm:text-2xl font-bold text-white leading-relaxed mb-8">
                  We are not just playing football. We are writing Meru&apos;s story.
                </p>
                <div className="flex items-center gap-4">
                  <div className="size-14 rounded-full bg-gradient-to-br from-pink to-pink-dark flex items-center justify-center text-white font-black text-xl shadow-lg" style={{ boxShadow: '0 8px 24px rgba(233,30,140,0.4)' }}>W</div>
                  <div>
                    <p className="text-white font-bold">Wesley Mwenda</p>
                    <p className="text-pink text-sm font-semibold">Team Captain &amp; Founder</p>
                  </div>
                </div>
              </blockquote>
            </div>
          </div>
        </div>
      </section>

      {/* JOURNEY TIMELINE */}
      <section className="py-20 lg:py-32" style={{ background: 'rgba(255,255,255,0.012)' }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-4 text-xs font-bold uppercase tracking-widest" style={{ background: 'rgba(233,30,140,0.1)', border: '1px solid rgba(233,30,140,0.25)', color: '#E91E8C' }}>
              <TrendingUp size={11} /> The Journey
            </div>
            <h2 className="text-4xl sm:text-5xl font-black">Road to the Conference</h2>
            <p className="text-gray-500 mt-3 max-w-sm mx-auto text-sm">From eleven friends with a dream to competing on the national stage.</p>
          </div>

          <div className="relative">
            {/* Vertical connecting line — desktop only */}
            <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-px hidden md:block" style={{ background: 'linear-gradient(to bottom, transparent 0%, rgba(233,30,140,0.5) 20%, rgba(201,168,76,0.5) 80%, transparent 100%)' }} />

            <div className="space-y-8 md:space-y-12">
              {milestones.map(({ year, title, icon: Icon, color, description }, i) => (
                <div key={i} className={`relative md:flex md:items-center ${i % 2 === 0 ? '' : 'md:flex-row-reverse'}`}>
                  {/* Card */}
                  <div className="md:w-[calc(50%-2.5rem)] p-6 sm:p-7 rounded-2xl transition-all hover:scale-[1.01]" style={{ background: '#0F0F0F', border: `1px solid ${color}22` }}>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="size-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: color + '18', color }}>
                        <Icon size={18} />
                      </div>
                      <span className="text-xs font-black tracking-widest px-3 py-1.5 rounded-full" style={{ background: color + '15', color }}>
                        {year}
                      </span>
                    </div>
                    <h3 className="text-white font-black text-xl mb-2">{title}</h3>
                    <p className="text-gray-400 text-sm leading-relaxed">{description}</p>
                  </div>

                  {/* Center dot */}
                  <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 size-6 rounded-full items-center justify-center z-10" style={{ background: '#080808', border: `3px solid ${color}`, boxShadow: `0 0 16px ${color}60` }}>
                    <div className="size-2.5 rounded-full" style={{ background: color }} />
                  </div>

                  {/* Spacer */}
                  <div className="hidden md:block md:w-[calc(50%-2.5rem)]" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* VISION MISSION VALUES */}
      <section className="py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-4xl sm:text-5xl font-black mb-3">What We Stand For</h2>
            <div className="h-1 w-20 rounded-full mx-auto" style={{ background: 'linear-gradient(90deg, #E91E8C, #C9A84C)' }} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: Eye, title: 'Vision', accent: '#E91E8C',
                text: 'To become the premier football club in Meru County — competing nationally, developing world-class talent, and being a source of pride for every resident of Meru.',
              },
              {
                icon: Target, title: 'Mission', accent: '#C9A84C',
                text: 'To provide a professional, well-resourced environment for players to grow. To engage the Meru community through football and build a financially sustainable club.',
              },
              {
                icon: Heart, title: 'Values', accent: '#E91E8C',
                list: ['Community first', 'Integrity on and off the pitch', 'Excellence in everything we do', 'Passion for the game', 'Respect for all'],
              },
            ].map(({ icon: Icon, title, accent, text, list }) => (
              <div key={title} className="relative rounded-2xl p-8 overflow-hidden group hover:scale-[1.02] transition-transform" style={{ background: '#0F0F0F', border: `1px solid ${accent}20` }}>
                <div className="absolute top-0 right-0 w-40 h-40 rounded-full blur-3xl opacity-8 group-hover:opacity-15 transition-opacity pointer-events-none" style={{ background: accent, transform: 'translate(40%, -40%)' }} />
                <div className="size-14 rounded-2xl mb-6 flex items-center justify-center" style={{ background: accent + '15', color: accent }}>
                  <Icon size={24} />
                </div>
                <h3 className="font-black text-2xl mb-4 text-white">{title}</h3>
                {text && <p className="text-gray-400 text-sm leading-relaxed">{text}</p>}
                {list && (
                  <ul className="space-y-2.5">
                    {list.map(v => (
                      <li key={v} className="flex items-center gap-3 text-sm text-gray-400">
                        <div className="size-1.5 rounded-full shrink-0" style={{ background: accent }} />
                        {v}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOUNDER SPOTLIGHT */}
      <section className="py-20 lg:py-32" style={{ background: 'rgba(255,255,255,0.012)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-3xl overflow-hidden" style={{ background: 'linear-gradient(135deg, rgba(233,30,140,0.1) 0%, rgba(8,8,8,0.98) 50%, rgba(201,168,76,0.05) 100%)', border: '1px solid rgba(233,30,140,0.2)' }}>
            <div className="absolute top-0 left-0 w-72 h-72 rounded-full blur-3xl opacity-10 pointer-events-none" style={{ background: '#E91E8C' }} />
            <div className="absolute bottom-0 right-0 w-72 h-72 rounded-full blur-3xl opacity-7 pointer-events-none" style={{ background: '#C9A84C' }} />

            <div className="relative p-8 sm:p-12 lg:p-16">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-8 text-xs font-bold uppercase tracking-widest" style={{ background: 'rgba(201,168,76,0.15)', border: '1px solid rgba(201,168,76,0.3)', color: '#C9A84C' }}>
                <Star size={10} fill="#C9A84C" /> The Man Behind the Club
              </div>

              <div className="flex flex-col sm:flex-row gap-8 items-start">
                <div className="relative shrink-0">
                  {foundingMember?.avatar ? (
                    <div className="size-28 rounded-2xl overflow-hidden" style={{ boxShadow: '0 0 40px rgba(233,30,140,0.35)' }}>
                      <Image src={foundingMember.avatar} alt="Wesley Mwenda" width={112} height={112} className="object-cover w-full h-full" />
                    </div>
                  ) : (
                    <div className="size-28 rounded-2xl flex items-center justify-center text-5xl font-black text-white" style={{ background: 'linear-gradient(135deg, #E91E8C, #C4186F)', boxShadow: '0 0 40px rgba(233,30,140,0.35)' }}>W</div>
                  )}
                  <div className="absolute -bottom-3 -right-3 size-10 rounded-full flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #C9A84C, #A8892E)' }}>
                    <Star size={16} fill="#000" className="text-black" />
                  </div>
                </div>

                <div className="flex-1">
                  <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black mb-1">Wesley Mwenda</h2>
                  <p className="font-semibold text-lg mb-6" style={{ color: '#E91E8C' }}>Team Captain &amp; Founder</p>
                  <p className="text-gray-400 leading-relaxed max-w-2xl mb-6">
                    {foundingMember?.bio ||
                      "Wesley Mwenda is not just the captain of Eleven Stars FC — he is its heartbeat. His vision of what football could mean for Meru drove him to build a club from scratch, rallying players, securing sponsors, and pushing the team to earn its place in the Conference League."}
                  </p>
                  <blockquote className="pl-5 text-gray-300 italic text-lg sm:text-xl font-medium" style={{ borderLeft: '4px solid #E91E8C' }}>
                    &ldquo;We are not just playing football. We are writing Meru&apos;s story.&rdquo;
                  </blockquote>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MANAGEMENT */}
      {management.length > 0 && (
        <section className="py-20 lg:py-32">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-4 mb-12">
              <div className="size-12 rounded-2xl flex items-center justify-center" style={{ background: 'rgba(233,30,140,0.1)' }}>
                <Users size={22} style={{ color: '#E91E8C' }} />
              </div>
              <div>
                <h2 className="text-3xl sm:text-4xl font-black">Club Management</h2>
                <p className="text-gray-500 text-sm">The people who make it happen</p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {management.map(({ id, name, role, bio, avatar }) => {
                const highlight = role === 'Team Captain & Founder'
                return (
                  <div key={id} className="rounded-2xl p-6 transition-all hover:scale-[1.02]" style={{ background: highlight ? 'linear-gradient(135deg, rgba(233,30,140,0.08), rgba(8,8,8,0.98))' : '#0F0F0F', border: `1px solid ${highlight ? 'rgba(233,30,140,0.25)' : 'rgba(255,255,255,0.07)'}` }}>
                    <div className="flex items-start gap-4">
                      <div className="size-14 rounded-xl flex items-center justify-center text-xl font-black text-white shrink-0 overflow-hidden" style={{ background: highlight ? 'linear-gradient(135deg, #E91E8C, #C4186F)' : 'rgba(255,255,255,0.08)' }}>
                        {avatar ? <img src={avatar} alt={name} className="w-full h-full object-cover" /> : name.charAt(0)}
                      </div>
                      <div className="min-w-0">
                        <p className="font-black text-base text-white mb-0.5">{name}</p>
                        <p className="text-xs font-semibold mb-3" style={{ color: highlight ? '#E91E8C' : '#C9A84C' }}>{role}</p>
                        {bio && <p className="text-gray-500 text-sm leading-relaxed">{bio}</p>}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </section>
      )}

      {/* SPONSORS & CTA */}
      <section className="py-20 lg:py-28" style={{ background: 'rgba(255,255,255,0.012)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-xs font-bold tracking-[0.3em] uppercase mb-10 text-gray-600">Official Club Sponsors</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-16">
            {['Akash Ltd', 'Moxi Aluminium'].map(s => (
              <div key={s} className="relative px-12 py-8 rounded-2xl overflow-hidden group transition-all hover:scale-[1.03]" style={{ background: '#0D0D0D', border: '1px solid rgba(201,168,76,0.2)' }}>
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity" style={{ background: 'linear-gradient(135deg, rgba(201,168,76,0.05), transparent)' }} />
                <p className="relative font-black text-3xl" style={{ background: 'linear-gradient(135deg, #C9A84C, #F0D080)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>{s}</p>
                <p className="relative text-gray-600 text-xs mt-1">Official Sponsor · Meru, Kenya</p>
              </div>
            ))}
          </div>

          <div className="relative rounded-3xl overflow-hidden p-12 sm:p-16" style={{ background: 'linear-gradient(135deg, rgba(233,30,140,0.1) 0%, rgba(8,8,8,0.98) 50%, rgba(233,30,140,0.05) 100%)', border: '1px solid rgba(233,30,140,0.2)' }}>
            <div className="absolute top-0 left-1/2 -translate-x-1/2 h-px w-4/5" style={{ background: 'linear-gradient(90deg, transparent, rgba(233,30,140,0.6), transparent)' }} />
            <h2 className="text-4xl sm:text-5xl font-black mb-4">Be Part of the Journey</h2>
            <p className="text-gray-500 mb-8 max-w-md mx-auto text-sm">Support Eleven Stars FC and help us write the next chapter of Meru football.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/donate" className="btn-shimmer px-8 py-4 rounded-full text-white font-bold transition-all hover:scale-105" style={{ background: 'linear-gradient(135deg, #E91E8C, #C4186F)' }}>Donate Now</Link>
              <Link href="/squad" className="px-8 py-4 rounded-full border border-white/15 hover:bg-white/8 text-gray-300 font-semibold transition-colors flex items-center justify-center gap-2">
                Meet the Squad <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  )
}
