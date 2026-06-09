'use client'

import { useState } from 'react'
import { Heart, Star, Trophy, Users, CheckCircle, Zap } from 'lucide-react'
import StkPushModal from '@/components/ui/StkPushModal'
import PageHeader from '@/components/ui/PageHeader'

const presets = [500, 1000, 2500, 5000, 10000]

const sponsorTiers = [
  {
    name: 'Bronze Sponsor',
    amount: 10000,
    icon: Trophy,
    color: '#CD7F32',
    perks: ['Logo on club website', 'Social media mention', 'Match day programme listing'],
  },
  {
    name: 'Silver Sponsor',
    amount: 50000,
    icon: Star,
    color: '#C0C0C0',
    perks: ['All Bronze perks', 'Logo on training kit', 'Banner at home matches', 'Quarterly club report'],
    popular: false,
  },
  {
    name: 'Gold Sponsor',
    amount: 150000,
    icon: Zap,
    color: '#C9A84C',
    perks: ['All Silver perks', 'Logo on match jersey', 'VIP tickets for season', 'Press release & PR mention', 'Naming rights for one fixture'],
    popular: true,
  },
]

const impactItems = [
  { icon: Users, label: 'KES 500', desc: 'Covers a player\'s training session' },
  { icon: Trophy, label: 'KES 2,500', desc: 'Provides match day equipment' },
  { icon: Heart, label: 'KES 10,000', desc: 'Funds travel for an away match' },
  { icon: Star, label: 'KES 50,000', desc: 'Sponsors a full month of training' },
]

export default function DonateClient() {
  const [amount, setAmount] = useState<number>(1000)
  const [customAmount, setCustomAmount] = useState('')
  const [isCustom, setIsCustom] = useState(false)
  const [payOpen, setPayOpen] = useState(false)
  const [donated, setDonated] = useState(false)

  const finalAmount = isCustom ? Number(customAmount) || 0 : amount

  const handlePreset = (val: number) => {
    setIsCustom(false)
    setCustomAmount('')
    setAmount(val)
  }

  const handleCustom = (val: string) => {
    setIsCustom(true)
    setCustomAmount(val)
  }

  return (
    <div style={{ background: '#080808' }}>
      <PageHeader eyebrow="Support the Club" title="Make a" highlight="Donation" description="Help Eleven Stars FC reach new heights in the Conference League." />

      <div className="max-w-6xl mx-auto px-6 sm:px-10 pb-20 space-y-16">

        {/* ── Donation Form ─────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">

          {/* Left: impact */}
          <div>
            <h2 className="text-white text-2xl font-bold mb-6">Your donation matters</h2>
            <div className="space-y-3 mb-8">
              {impactItems.map(({ icon: Icon, label, desc }) => (
                <div
                  key={label}
                  className="flex items-center gap-4 p-4 rounded-xl"
                  style={{ background: '#141414', border: '1px solid rgba(255,255,255,0.06)' }}
                >
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(233,30,140,0.15)' }}>
                    <Icon size={18} style={{ color: '#E91E8C' }} />
                  </div>
                  <div>
                    <p className="text-[#E91E8C] font-bold text-sm">{label}</p>
                    <p className="text-gray-400 text-sm">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <div
              className="p-5 rounded-xl"
              style={{ background: 'rgba(201,168,76,0.08)', border: '1px solid rgba(201,168,76,0.2)' }}
            >
              <p className="text-[#C9A84C] font-bold text-sm mb-1">Absa Paybill</p>
              <p className="text-white font-black text-2xl">Paybill: 000000</p>
              <p className="text-gray-400 text-sm">Account: ELEVENSTARS</p>
              <p className="text-gray-500 text-xs mt-2">You can also donate directly via Paybill</p>
            </div>
          </div>

          {/* Right: form */}
          <div
            className="rounded-2xl p-7"
            style={{ background: '#141414', border: '1px solid rgba(255,255,255,0.06)' }}
          >
            <h3 className="text-white font-bold text-xl mb-6">Make a Donation</h3>

            {/* Preset amounts */}
            <div>
              <p className="text-gray-400 text-sm mb-3">Choose an amount (KES)</p>
              <div className="grid grid-cols-3 gap-2 mb-3">
                {presets.map(val => (
                  <button
                    key={val}
                    onClick={() => handlePreset(val)}
                    className="py-3 rounded-xl text-sm font-bold transition-all duration-200 hover:scale-[1.03]"
                    style={
                      !isCustom && amount === val
                        ? { background: 'linear-gradient(135deg, #E91E8C, #C4186F)', color: '#fff' }
                        : { background: 'rgba(255,255,255,0.05)', color: '#D1D5DB', border: '1px solid rgba(255,255,255,0.08)' }
                    }
                  >
                    {val.toLocaleString()}
                  </button>
                ))}
                {/* Custom */}
                <button
                  onClick={() => setIsCustom(true)}
                  className="py-3 rounded-xl text-sm font-bold transition-all duration-200 hover:scale-[1.03]"
                  style={
                    isCustom
                      ? { background: 'linear-gradient(135deg, #E91E8C, #C4186F)', color: '#fff' }
                      : { background: 'rgba(255,255,255,0.05)', color: '#D1D5DB', border: '1px solid rgba(255,255,255,0.08)' }
                  }
                >
                  Custom
                </button>
              </div>

              {/* Custom input */}
              {isCustom && (
                <div className="mb-4">
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-bold">KES</span>
                    <input
                      type="number"
                      value={customAmount}
                      onChange={e => handleCustom(e.target.value)}
                      placeholder="Enter amount"
                      min="50"
                      className="w-full pl-14 pr-4 py-3 rounded-xl text-white text-sm outline-none"
                      style={{ background: '#1E1E1E', border: '1px solid rgba(233,30,140,0.4)' }}
                      autoFocus
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Amount summary */}
            <div
              className="flex items-center justify-between p-4 rounded-xl my-5"
              style={{ background: 'rgba(233,30,140,0.08)', border: '1px solid rgba(233,30,140,0.15)' }}
            >
              <span className="text-gray-400 text-sm">Donation amount</span>
              <span className="text-white font-black text-2xl">
                {finalAmount > 0 ? `KES ${finalAmount.toLocaleString()}` : '—'}
              </span>
            </div>

            <button
              onClick={() => { if (finalAmount >= 50) setPayOpen(true) }}
              disabled={finalAmount < 50}
              className="w-full py-4 rounded-xl text-white font-bold text-base transition-all pink-glow"
              style={{
                background: finalAmount >= 50 ? 'linear-gradient(135deg, #E91E8C, #C4186F)' : 'rgba(255,255,255,0.08)',
                color: finalAmount >= 50 ? '#fff' : '#6B7280',
                cursor: finalAmount >= 50 ? 'pointer' : 'not-allowed',
              }}
            >
              <Heart size={16} className="inline mr-2" fill="currentColor" />
              Donate via M-Pesa
            </button>

            {donated && (
              <div
                className="mt-4 p-4 rounded-xl flex items-center gap-3"
                style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.25)' }}
              >
                <CheckCircle size={18} style={{ color: '#4ADE80', flexShrink: 0 }} />
                <p className="text-green-300 text-sm font-medium">Thank you for your donation! You are a star.</p>
              </div>
            )}
          </div>
        </div>

        {/* ── Current Sponsors ──────────────────────────── */}
        <div id="sponsors">
          <h2 className="text-white text-2xl font-bold mb-2">Our Sponsors</h2>
          <p className="text-gray-400 text-sm mb-8">We are proud to be supported by these Meru-based businesses.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-4">
            {[
              { name: 'Akash Ltd', desc: 'Business solutions based in Meru, Kenya. A proud founding sponsor of Eleven Stars FC.' },
              { name: 'Moxi Aluminium', desc: 'Aluminium fabrication specialists in Meru. Supporting Meru sport and community.' },
            ].map(({ name, desc }) => (
              <div
                key={name}
                className="p-6 rounded-2xl flex items-start gap-5"
                style={{ background: '#141414', border: '1px solid rgba(201,168,76,0.2)' }}
              >
                <div
                  className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl font-black flex-shrink-0"
                  style={{ background: 'rgba(201,168,76,0.12)', color: '#C9A84C' }}
                >
                  {name.charAt(0)}
                </div>
                <div>
                  <p className="text-[#C9A84C] font-bold text-lg">{name}</p>
                  <p className="text-gray-400 text-sm leading-relaxed mt-1">{desc}</p>
                  <span
                    className="inline-block mt-2 px-2.5 py-0.5 rounded-full text-xs font-semibold"
                    style={{ background: 'rgba(201,168,76,0.15)', color: '#C9A84C' }}
                  >
                    Official Sponsor · Meru
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Sponsorship Tiers ─────────────────────────── */}
        <div>
          <h2 className="text-white text-2xl font-bold mb-2">Become a Sponsor</h2>
          <p className="text-gray-400 text-sm mb-8">
            Partner with Eleven Stars FC and put your brand in front of thousands of fans across Meru County.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {sponsorTiers.map(({ name, amount: tierAmount, icon: Icon, color, perks, popular }) => (
              <div
                key={name}
                className="rounded-2xl p-7 relative transition-all duration-300 hover:scale-[1.02]"
                style={{
                  background: popular ? 'linear-gradient(135deg, #140a0f, #1a0812)' : '#141414',
                  border: popular ? '1px solid rgba(201,168,76,0.35)' : '1px solid rgba(255,255,255,0.06)',
                }}
              >
                {popular && (
                  <span
                    className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-bold text-black"
                    style={{ background: '#C9A84C' }}
                  >
                    Most Popular
                  </span>
                )}
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-5" style={{ background: `${color}18` }}>
                  <Icon size={22} style={{ color }} />
                </div>
                <h3 className="text-white font-black text-xl mb-1">{name}</h3>
                <p className="font-black text-2xl mb-5" style={{ color }}>
                  KES {tierAmount.toLocaleString()}
                  <span className="text-gray-500 text-sm font-medium">/season</span>
                </p>
                <ul className="space-y-2 mb-7">
                  {perks.map(perk => (
                    <li key={perk} className="flex items-start gap-2 text-sm text-gray-300">
                      <CheckCircle size={14} className="mt-0.5 flex-shrink-0" style={{ color }} />
                      {perk}
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => { setIsCustom(true); setCustomAmount(String(tierAmount)); setPayOpen(true) }}
                  className="w-full py-3 rounded-xl font-bold text-sm transition-all hover:scale-[1.02]"
                  style={
                    popular
                      ? { background: 'linear-gradient(135deg, #C9A84C, #E8C76A)', color: '#000' }
                      : { background: 'rgba(255,255,255,0.06)', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' }
                  }
                >
                  Sponsor Now
                </button>
              </div>
            ))}
          </div>
        </div>

      </div>

      <StkPushModal
        isOpen={payOpen}
        onClose={() => setPayOpen(false)}
        amount={finalAmount}
        description="Donation — Eleven Stars FC"
        onSuccess={() => { setPayOpen(false); setDonated(true) }}
      />
    </div>
  )
}
