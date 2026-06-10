import Image from 'next/image'
import Link from 'next/link'
import { Ticket, Heart, Star, ArrowRight, Calendar, MapPin, ShoppingBag, Trophy, Zap } from 'lucide-react'
import prisma from '@/lib/db'

export const dynamic = 'force-dynamic'

export default async function HomePage() {
  let nextMatch: { homeTeam: string; awayTeam: string; date?: Date | null; venue: string; leagueName: string } | null = null
  try {
    nextMatch = await prisma.fixture.findFirst({
      where: { status: 'upcoming' },
      orderBy: { date: 'asc' },
    })
  } catch { /* DB unavailable, show defaults */ }

  const matchDate = nextMatch?.date
    ? new Date(nextMatch.date).toLocaleDateString('en-KE', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
    : null
  const matchTime = nextMatch?.date
    ? (() => {
        const d = new Date(nextMatch!.date!)
        const h = d.getHours(), m = d.getMinutes()
        return (h === 0 && m === 0) ? null : d.toLocaleTimeString('en-KE', { hour: '2-digit', minute: '2-digit' })
      })()
    : null

  return (
    <div className="bg-base text-white">

      {/* ── HERO ─────────────────────────────────── */}
      {/* Mobile renders a FLAT, single-paint section: no 100svh, no overflow
          clip, no stacked `absolute inset-0` decorative layers. That removes
          the viewport-tall composited layer that low-end Android GPUs can't
          repaint on scroll (the cause of the RGB-static / ghost-trail
          corruption). The rich layered hero is restored at `lg+` only. */}
      <section className="relative flex flex-col items-center justify-center px-4 pt-32 pb-20 text-center lg:min-h-[100svh] lg:overflow-hidden lg:px-0 lg:pt-0 lg:pb-0">
        {/* Decorative background layers — desktop only */}
        <div className="absolute inset-0 pointer-events-none hidden lg:block"
          style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(233,30,140,0.22) 0%, transparent 65%)' }} />
        <div className="absolute bottom-0 right-0 w-1/2 h-1/2 pointer-events-none hidden lg:block"
          style={{ background: 'radial-gradient(ellipse 60% 60% at 100% 100%, rgba(201,168,76,0.12) 0%, transparent 65%)' }} />

        {/* Watermark logo */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 opacity-[0.03] pointer-events-none hidden xl:block animate-spin-slow">
          <Image src="/logo.png" alt="" width={560} height={560} />
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">

          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full border border-gold/30 bg-gold/8 mb-10 animate-fade-up">
            <span className="relative flex size-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gold opacity-75" />
              <span className="relative inline-flex size-2 rounded-full bg-gold" />
            </span>
            <span className="gradient-text-gold text-xs font-bold tracking-widest uppercase">
              Conference League 2026 · Meru, Kenya
            </span>
          </div>

          {/* Headline */}
          <h1 className="font-black tracking-tighter leading-none mb-6 animate-fade-up delay-100"
            style={{ fontSize: 'clamp(3.5rem, 14vw, 10rem)' }}>
            <span className="text-white block">ELEVEN</span>
            <span className="gradient-text-pink block">STARS</span>
          </h1>

          {/* Divider */}
          <div className="flex items-center justify-center gap-4 mb-6 animate-fade-up delay-200">
            <div className="h-px w-20 bg-gradient-to-r from-transparent to-gold/50" />
            <p className="gradient-text-gold text-base font-bold tracking-[0.3em] uppercase">F.C · Meru</p>
            <div className="h-px w-20 bg-gradient-to-l from-transparent to-gold/50" />
          </div>

          <p className="text-gray-400 text-lg sm:text-xl max-w-lg mx-auto leading-relaxed mb-12 animate-fade-up delay-300">
            Meru&apos;s pride. Rising stars. Built from passion — competing with purpose.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-up delay-500">
            <Link href="/tickets"
              className="btn-shimmer inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-pink hover:bg-pink-dark text-white font-bold text-base transition-colors duration-200 shadow-lg shadow-pink/30">
              <Ticket size={18} /> Buy Match Tickets
            </Link>
            <Link href="/donate"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full border border-gold/40 bg-gold/8 hover:bg-gold/15 text-gold font-bold text-base transition-colors duration-200">
              <Heart size={18} /> Support the Club
            </Link>
            <Link href="/squad"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white font-semibold text-base transition-colors duration-200">
              View Squad <ArrowRight size={16} />
            </Link>
          </div>

          {/* Scroll hint — desktop only (mobile hero isn't full-height) */}
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 hidden lg:flex flex-col items-center gap-2 opacity-30 animate-float">
            <div className="w-px h-10 bg-gradient-to-b from-transparent to-pink" />
            <p className="text-xs tracking-widest uppercase text-gray-500">Scroll</p>
          </div>
        </div>
      </section>

      {/* ── SPONSORS ─────────────────────────────── */}
      <div className="border-y border-gold/15 bg-gold/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-12">
            <p className="text-gray-600 text-[11px] font-bold tracking-[0.25em] uppercase shrink-0">Official Sponsors</p>
            <div className="flex items-center gap-8">
              {['Akash Ltd', 'Moxi Aluminium'].map((name, i) => (
                <div key={name} className="flex items-center gap-3">
                  {i > 0 && <div className="h-5 w-px bg-gold/25" />}
                  <div className="flex items-center gap-2.5">
                    <div className="size-8 rounded-lg bg-gold/15 border border-gold/20 flex items-center justify-center text-gold text-xs font-black">
                      {name[0]}
                    </div>
                    <span className="gradient-text-gold font-bold text-sm">{name}</span>
                  </div>
                </div>
              ))}
            </div>
            <Link href="/donate#sponsors" className="text-gray-600 hover:text-gold text-xs transition-colors flex items-center gap-1 shrink-0">
              Become a sponsor <ArrowRight size={11} />
            </Link>
          </div>
        </div>
      </div>

      {/* ── STATS ────────────────────────────────── */}
      <section className="py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {[
              { value: '11',   label: 'Squad Players',      sub: 'First XI',         icon: Trophy, color: 'pink' as const },
              { value: '2026', label: 'Conference League',  sub: 'Current Season',   icon: Star,   color: 'gold' as const },
              { value: '2',    label: 'Official Sponsors',  sub: 'Akash · Moxi',     icon: Heart,  color: 'pink' as const },
              { value: 'Meru', label: 'Home City',          sub: 'Meru County, KE',  icon: MapPin, color: 'gold' as const },
            ].map(({ value, label, sub, icon: Icon, color }) => (
              <div key={label}
                className="group rounded-2xl bg-surface border border-white/8 hover:border-white/15 transition-colors duration-300 overflow-hidden lg:transition-all lg:hover:-translate-y-1">
                <div className={`h-1 w-full ${color === 'pink' ? 'bg-gradient-to-r from-transparent via-pink to-transparent' : 'bg-gradient-to-r from-transparent via-gold to-transparent'} opacity-60`} />
                <div className="p-6 sm:p-8 text-center">
                  <div className={`size-12 rounded-xl mx-auto mb-5 flex items-center justify-center ${
                    color === 'pink' ? 'bg-pink/10 text-pink' : 'bg-gold/10 text-gold'
                  } lg:transition-transform lg:group-hover:scale-110 duration-300`}>
                    <Icon size={22} />
                  </div>
                  <p className="text-3xl sm:text-4xl font-black text-white mb-1">{value}</p>
                  <p className="text-white font-semibold text-sm mb-0.5">{label}</p>
                  <p className="text-gray-600 text-xs">{sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── NEXT MATCH ───────────────────────────── */}
      <section className="pb-24 lg:pb-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Section header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="h-7 w-1 rounded-full bg-pink bg-gradient-to-b from-pink to-gold" />
              <h2 className="text-2xl sm:text-3xl font-black text-white">Next Match</h2>
            </div>
            <Link href="/fixtures" className="flex items-center gap-1.5 text-sm font-medium text-pink hover:text-pink-light transition-colors">
              All fixtures <ArrowRight size={14} />
            </Link>
          </div>

          <div className="relative rounded-2xl bg-surface border border-white/8 overflow-hidden">
            {/* top accent */}
            <div className="h-1 bg-gradient-to-r from-pink via-gold to-pink" style={{ opacity: 0.7 }} />

            <div className="relative p-8 sm:p-10 lg:p-12">
              <div className="flex flex-col lg:flex-row items-center justify-between gap-10">

                {/* Teams */}
                <div className="flex-1">
                  <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink/10 border border-pink/20 text-pink text-xs font-bold uppercase tracking-wider mb-8">
                    <Zap size={11} fill="currentColor" /> {nextMatch?.leagueName ?? 'Conference League 2026'}
                  </span>

                  <div className="flex items-center gap-8 sm:gap-14">
                    {/* Home */}
                    <div className="text-center">
                      <div className="relative size-20 sm:size-24 rounded-full overflow-hidden ring-2 ring-pink/30 mx-auto mb-3">
                        <Image src="/logo.png" alt="Eleven Stars FC" fill sizes="96px" className="object-cover" />
                      </div>
                      <p className="text-white font-black text-lg sm:text-xl">{nextMatch?.homeTeam ?? 'Eleven Stars'}</p>
                      <p className="text-gray-600 text-sm mt-1">Home</p>
                    </div>

                    {/* VS */}
                    <div className="px-6 sm:px-8 py-3 sm:py-4 rounded-2xl bg-gold/10 border border-gold/25 text-gold font-black text-3xl sm:text-4xl">
                      VS
                    </div>

                    {/* Away */}
                    <div className="text-center">
                      <div className="size-20 sm:size-24 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-4xl font-black text-gray-600 mx-auto mb-3">
                        {nextMatch?.awayTeam?.charAt(0).toUpperCase() ?? '?'}
                      </div>
                      <p className="text-white font-black text-lg sm:text-xl">{nextMatch?.awayTeam ?? 'TBD'}</p>
                      <p className="text-gray-600 text-sm mt-1">Away</p>
                    </div>
                  </div>
                </div>

                {/* Info */}
                <div className="flex flex-col items-center lg:items-end gap-5">
                  <div className="space-y-3 text-sm text-gray-400">
                    <div className="flex items-center gap-2.5">
                      <Calendar size={15} className="text-pink shrink-0" />
                      {matchDate
                        ? matchTime ? `${matchDate} · ${matchTime}` : matchDate
                        : 'Date to be announced'}
                    </div>
                    <div className="flex items-center gap-2.5">
                      <MapPin size={15} className="text-pink shrink-0" />
                      {nextMatch?.venue ?? 'Meru Stadium, Meru'}
                    </div>
                  </div>
                  <Link href="/tickets"
                    className="btn-shimmer inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-pink hover:bg-pink-dark text-white font-bold transition-colors duration-200 shadow-lg shadow-pink/25">
                    <Ticket size={16} /> Get Tickets
                  </Link>
                </div>

              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── GET INVOLVED ─────────────────────────── */}
      <section className="pb-24 lg:pb-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="flex items-center gap-3 mb-10">
            <div className="h-7 w-1 rounded-full bg-gradient-to-b from-pink to-gold" />
            <h2 className="text-2xl sm:text-3xl font-black text-white">Get Involved</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: ShoppingBag,
                title: 'Club Shop',
                desc: 'Rep the pink and black. Official jerseys, scarves, caps and more.',
                href: '/shop',
                accent: 'pink' as const,
                cta: 'Shop Now',
              },
              {
                icon: Heart,
                title: 'Donate',
                desc: 'Help fund training, equipment, and travel for the squad. Every shilling matters.',
                href: '/donate',
                accent: 'gold' as const,
                cta: 'Donate Now',
              },
              {
                icon: Trophy,
                title: 'Our Story',
                desc: 'From humble Meru beginnings to the Conference League — learn who we are.',
                href: '/about',
                accent: 'pink' as const,
                cta: 'Read More',
              },
            ].map(({ icon: Icon, title, desc, href, accent, cta }) => (
              <Link key={href} href={href}
                className="group rounded-2xl bg-surface border border-white/8 hover:border-white/15 transition-colors duration-300 p-8 flex flex-col lg:transition-all lg:hover:-translate-y-1">
                <div className={`size-12 rounded-xl mb-6 flex items-center justify-center lg:transition-transform lg:group-hover:scale-110 duration-300 ${
                  accent === 'pink' ? 'bg-pink/10 text-pink' : 'bg-gold/10 text-gold'
                }`}>
                  <Icon size={24} />
                </div>
                <h3 className="text-white font-black text-xl mb-3">{title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed flex-1 mb-8">{desc}</p>
                <div className={`flex items-center gap-2 text-sm font-bold lg:group-hover:gap-3 lg:transition-all duration-200 ${
                  accent === 'pink' ? 'text-pink' : 'text-gold'
                }`}>
                  {cta} <ArrowRight size={14} />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ───────────────────────────── */}
      <section className="pb-24 lg:pb-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="cta-banner relative rounded-2xl overflow-hidden border border-pink/20 bg-gradient-to-br from-pink/10 via-surface to-surface">
            <div className="relative px-8 sm:px-12 py-16 sm:py-20 text-center max-w-3xl mx-auto">
              <div className="flex justify-center gap-1 mb-6">
                {[...Array(5)].map((_, i) => <Star key={i} size={18} fill="#C9A84C" className="text-gold" />)}
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-4 leading-tight">
                Meru&apos;s Team.<br />
                <span className="gradient-text-pink">Your Team.</span>
              </h2>
              <p className="text-gray-400 text-base sm:text-lg max-w-md mx-auto mb-10 leading-relaxed">
                Stand with Eleven Stars FC as we write a new chapter for football in Meru County.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/donate"
                  className="btn-shimmer px-8 py-4 rounded-full bg-pink hover:bg-pink-dark text-white font-bold transition-colors shadow-lg shadow-pink/25">
                  Support the Club
                </Link>
                <Link href="/squad"
                  className="px-8 py-4 rounded-full border border-white/15 hover:bg-white/8 text-gray-300 hover:text-white font-semibold transition-colors">
                  Meet the Squad
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  )
}
