import Link from 'next/link'
import type { Metadata } from 'next'
import {
  GraduationCap, BookOpen, Dumbbell, HeartHandshake, ShieldCheck, Users,
  Target, Trophy, Heart, Shield, Star, MapPin, ArrowRight, Sparkles, ShoppingBag,
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'Academy — Eleven Stars Nova Sports Academy',
  description:
    'Eleven Stars Nova Sports Academy nurtures young athletes in Meru County through sport, education and mentorship — building better athletes, better students, and better futures.',
}

const visionPillars = [
  { word: 'Together',    text: 'One academy, unified, working in partnership with others.',                       icon: Users },
  { word: 'Building',    text: "Planning for the future, building Kenya's sporting base.",                        icon: Trophy },
  { word: 'Powerbase',   text: 'Providing the expertise and exposure for positive, sustainable development.',     icon: Target },
  { word: 'Sustainable', text: 'Continued delivery on economic, environmental and social outcomes.',              icon: ShieldCheck },
  { word: 'Growth',      text: 'Empowering Meru, its young people and the local economy.',                        icon: Sparkles },
  { word: 'Development', text: 'Securing a brighter future and a path to self-sustainability for young athletes.', icon: GraduationCap },
]

const values = [
  { title: 'Teamwork',           desc: 'Working as one group toward a common goal — from the director level to our athletes.', icon: Users },
  { title: 'Respect & Diversity', desc: 'We respect ourselves and each other, embracing and celebrating our diversity.',       icon: HeartHandshake },
  { title: 'Integrity',          desc: 'A high regard for truth — we play by the rules and act ethically in all we do.',       icon: ShieldCheck },
  { title: 'Commitment',         desc: 'Devoted to the community we serve and to national child-protection standards.',        icon: Heart },
]

const offerings = [
  { title: 'High-Performance Training', desc: 'Comprehensive coaching clinics and a structured training programme to nurture talent and build character.', icon: Dumbbell },
  { title: 'Affordable Equipment',      desc: 'Football boots, balls and sporting gear at affordable prices so cost never keeps a young athlete off the pitch.', icon: ShoppingBag },
  { title: 'Academic Tuition',          desc: 'Tuition services at competitive rates — sport and education under one roof, building body and mind together.', icon: BookOpen },
  { title: 'Mentorship & Life Skills',  desc: 'Resilience, leadership, discipline and teamwork — support that extends far beyond the field.', icon: GraduationCap },
]

const impact = [
  { title: 'Drug Abuse & Crime Prevention', desc: 'A healthy alternative to drugs and negative peer pressure — keeping youth busy, confident and making positive choices.', icon: Shield },
  { title: 'Community Cohesion & Joy',      desc: 'Sport brings families and neighbours together, fostering unity, pride and shared purpose.', icon: Users },
  { title: 'Youth Empowerment',            desc: 'Critical life skills that improve opportunities in education, careers and community leadership.', icon: Sparkles },
  { title: 'Positive Social Impact',       desc: 'A protective factor against anti-social behaviour, raising wellbeing and a sense of belonging.', icon: Heart },
]

export default function AcademyPage() {
  return (
    <div className="academy-page bg-base text-white">

      {/* ── HERO ─────────────────────────────────── */}
      <section className="relative overflow-hidden pt-32 pb-20 lg:pt-40 lg:pb-28">
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 80% 55% at 50% 0%, rgba(233,30,140,0.18) 0%, transparent 65%)' }} />
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-gold/30 bg-gold/8 text-gold text-xs font-bold tracking-widest uppercase mb-8">
            <GraduationCap size={13} /> Youth Sports Academy · Meru, Kenya
          </div>
          <h1 className="font-black tracking-tight leading-[0.95] mb-6 text-4xl sm:text-6xl lg:text-7xl">
            <span className="text-white block">Eleven Stars Nova</span>
            <span className="gradient-text-pink block">Sports Academy</span>
          </h1>
          <p className="text-gray-400 text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed mb-10">
            Together, building the powerbase for sustainable athlete development and talent nurturing —
            identifying and raising the next generation of stars from Meru and beyond.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/donate"
              className="btn-shimmer inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-pink hover:bg-pink-dark text-white font-bold transition-colors duration-200 shadow-lg shadow-pink/30">
              <Heart size={18} /> Support the Academy
            </Link>
            <Link href="/about"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white font-semibold transition-colors duration-200">
              Our Story <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── MISSION ──────────────────────────────── */}
      <section className="py-20 lg:py-28 border-t border-white/5">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="h-7 w-1 rounded-full bg-pink bg-gradient-to-b from-pink to-gold" />
            <h2 className="text-2xl sm:text-3xl font-black text-white">Our Mission</h2>
          </div>
          <p className="text-gray-300 text-lg sm:text-xl leading-relaxed">
            Nova Academy exists to promote mass participation in sport and to empower young people —
            <span className="text-white font-semibold"> boys and girls from every background</span> — through holistic
            development. We provide comprehensive coaching clinics and a structured high-performance programme designed to
            nurture talent, build character, and prepare young athletes for success in sport <span className="text-white font-semibold">and in life</span>.
          </p>
        </div>
      </section>

      {/* ── WHAT WE DO ───────────────────────────── */}
      <section className="pb-20 lg:pb-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-10">
            <div className="h-7 w-1 rounded-full bg-pink bg-gradient-to-b from-pink to-gold" />
            <h2 className="text-2xl sm:text-3xl font-black text-white">What We Do</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: Target,        title: 'Identify Talent',      desc: 'We scout and identify promising athletes from Meru County and across Kenya.' },
              { icon: Trophy,        title: 'Fund Development',     desc: 'We source funding for the development, upkeep and education of every athlete we identify.' },
              { icon: GraduationCap, title: 'Train & Educate',      desc: 'Top-quality facilities and coaching, paired with academic support, to grow skill, character and competitive spirit.' },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="rounded-2xl bg-surface border border-white/8 p-8">
                <div className="size-12 rounded-xl mb-6 flex items-center justify-center bg-pink/10 text-pink">
                  <Icon size={24} />
                </div>
                <h3 className="text-white font-black text-xl mb-3">{title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>

          {/* Child protection highlight */}
          <div className="mt-6 rounded-2xl bg-gold/5 border border-gold/20 p-6 sm:p-8 flex flex-col sm:flex-row items-start gap-5">
            <div className="size-12 shrink-0 rounded-xl flex items-center justify-center bg-gold/10 text-gold">
              <ShieldCheck size={24} />
            </div>
            <div>
              <h3 className="text-white font-bold text-lg mb-2">Child protection first</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Safeguarding the rights of every young athlete — and the girl athlete in particular — sits at the heart of
                our mandate, backed by dedicated administration and full observance of national child-protection procedures.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── VISION ───────────────────────────────── */}
      <section className="pb-20 lg:pb-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl bg-surface border border-white/8 p-8 sm:p-12">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <p className="text-gold text-xs font-bold tracking-widest uppercase mb-4">Our Vision</p>
              <p className="text-2xl sm:text-3xl font-black text-white leading-snug">
                &ldquo;Together building the powerbase for sustainable athlete development and{' '}
                <span className="gradient-text-pink">talent nurturing.</span>&rdquo;
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {visionPillars.map(({ word, text, icon: Icon }) => (
                <div key={word} className="rounded-2xl bg-base border border-white/8 p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="size-10 rounded-lg flex items-center justify-center bg-gold/10 text-gold">
                      <Icon size={18} />
                    </div>
                    <h3 className="text-white font-bold">{word}</h3>
                  </div>
                  <p className="text-gray-500 text-sm leading-relaxed">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── VALUES ───────────────────────────────── */}
      <section className="pb-20 lg:pb-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-10">
            <div className="h-7 w-1 rounded-full bg-pink bg-gradient-to-b from-pink to-gold" />
            <h2 className="text-2xl sm:text-3xl font-black text-white">Our Values</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map(({ title, desc, icon: Icon }) => (
              <div key={title} className="rounded-2xl bg-surface border border-white/8 p-7">
                <div className="size-12 rounded-xl mb-5 flex items-center justify-center bg-pink/10 text-pink">
                  <Icon size={24} />
                </div>
                <h3 className="text-white font-black text-lg mb-2">{title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CHALLENGE & RESPONSE ─────────────────── */}
      <section className="pb-20 lg:pb-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <div className="rounded-2xl bg-surface border border-pink/20 p-8">
              <p className="text-pink text-xs font-bold tracking-widest uppercase mb-3">The Challenge</p>
              <p className="text-gray-300 leading-relaxed">
                Too many young people face drug abuse, idle time and a lack of safe, positive activities. With few structured
                outlets available, they are left vulnerable to negative influences and limited opportunity.
              </p>
            </div>
            <div className="rounded-2xl bg-surface border border-gold/20 p-8">
              <p className="text-gold text-xs font-bold tracking-widest uppercase mb-3">Our Response</p>
              <p className="text-gray-300 leading-relaxed">
                We are a community transformation hub that uses sport to combat drug abuse, reduce idle time and bring positive
                engagement back into neighbourhoods — pairing it with affordable equipment and academic support.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {impact.map(({ title, desc, icon: Icon }) => (
              <div key={title} className="rounded-2xl bg-surface border border-white/8 p-6">
                <div className="size-11 rounded-xl mb-4 flex items-center justify-center bg-gold/10 text-gold">
                  <Icon size={22} />
                </div>
                <h3 className="text-white font-bold text-base mb-2">{title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHAT WE OFFER ────────────────────────── */}
      <section className="pb-20 lg:pb-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-7 w-1 rounded-full bg-pink bg-gradient-to-b from-pink to-gold" />
            <h2 className="text-2xl sm:text-3xl font-black text-white">What We Offer</h2>
          </div>
          <p className="text-gray-500 mb-10 max-w-2xl">
            A supportive environment that builds better athletes, better students, and better futures for every child.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {offerings.map(({ title, desc, icon: Icon }) => (
              <div key={title} className="rounded-2xl bg-surface border border-white/8 p-7 flex flex-col">
                <div className="size-12 rounded-xl mb-5 flex items-center justify-center bg-pink/10 text-pink">
                  <Icon size={24} />
                </div>
                <h3 className="text-white font-black text-lg mb-3">{title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ───────────────────────────── */}
      <section className="pb-24 lg:pb-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-2xl overflow-hidden border border-pink/20 bg-gradient-to-br from-pink/10 via-surface to-surface">
            <div className="relative px-8 sm:px-12 py-16 sm:py-20 text-center max-w-3xl mx-auto">
              <div className="flex justify-center gap-1 mb-6">
                {[...Array(5)].map((_, i) => <Star key={i} size={18} fill="#C9A84C" className="text-gold" />)}
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-white mb-4 leading-tight">
                Back the next generation of <span className="gradient-text-pink">Meru talent.</span>
              </h2>
              <p className="text-gray-400 text-base sm:text-lg max-w-md mx-auto mb-10 leading-relaxed">
                Every contribution helps fund training, equipment and education for a young athlete with a dream.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/donate"
                  className="btn-shimmer px-8 py-4 rounded-full bg-pink hover:bg-pink-dark text-white font-bold transition-colors shadow-lg shadow-pink/25">
                  Support the Academy
                </Link>
                <Link href="/squad"
                  className="px-8 py-4 rounded-full border border-white/15 hover:bg-white/8 text-gray-300 hover:text-white font-semibold transition-colors">
                  Meet the Squad
                </Link>
              </div>
              <p className="mt-8 flex items-center justify-center gap-2 text-gray-600 text-sm">
                <MapPin size={14} className="text-gold" /> Based in Meru County, Kenya
              </p>
            </div>
          </div>
        </div>
      </section>

    </div>
  )
}
