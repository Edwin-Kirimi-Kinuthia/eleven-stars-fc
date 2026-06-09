'use client'

import { useState } from 'react'
import { Heart, Star, Users, Target } from 'lucide-react'
import ManualPaymentModal from '@/components/ui/ManualPaymentModal'
import PageHeader from '@/components/ui/PageHeader'

const donationTiers = [
  { name: 'Bronze Star',  amount: 5000,  desc: 'Support basic operations', perks: ['Digital certificate', 'Social media shout-out'] },
  { name: 'Silver Star',  amount: 15000, desc: 'Fund training & gear', perks: ['Digital certificate', 'Social media shout-out', 'Match day invite'] },
  { name: 'Gold Star',    amount: 50000, desc: 'Sponsor player development', perks: ['Digital certificate', 'Social media shout-out', 'Match day invite', 'Name on website'] },
]

export default function DonatePage() {
  const [customAmount, setCustomAmount] = useState('')
  const [selectedTier, setSelectedTier] = useState(0)
  const [payOpen, setPayOpen] = useState(false)
  const [amount, setAmount] = useState(donationTiers[0].amount)

  const handleSelectTier = (idx: number) => {
    setSelectedTier(idx)
    setAmount(donationTiers[idx].amount)
    setCustomAmount('')
  }

  const handleCustomAmount = (val: string) => {
    setCustomAmount(val)
    setAmount(parseInt(val) || 0)
    setSelectedTier(-1)
  }

  return (
    <div className="bg-base text-white">
      <PageHeader eyebrow="Support the Club" title="Make a" highlight="Donation" description="Help Eleven Stars FC reach new heights in the Conference League." />

      <section className="py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Why donate */}
          <div className="mb-20">
            <h2 className="text-3xl font-black mb-8 text-center">How Your Donation Helps</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {[
                { icon: Target, title: 'Player Development', desc: 'Fund training camps, coaching, and skill development.' },
                { icon: Users, title: 'Team Operations', desc: 'Support travel, accommodation, and match preparations.' },
                { icon: Star, title: 'Community Growth', desc: 'Build grassroots football programs in Meru County.' },
              ].map(({ icon: Icon, title, desc }) => (
                <div key={title} className="rounded-2xl bg-surface border border-white/8 p-8 text-center hover:border-white/15 transition-colors">
                  <div className="size-14 rounded-xl bg-gold/10 text-gold flex items-center justify-center mx-auto mb-5">
                    <Icon size={24} />
                  </div>
                  <h3 className="font-black text-lg mb-2">{title}</h3>
                  <p className="text-gray-400 text-sm">{desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Donation tiers */}
          <div className="mb-20">
            <h2 className="text-3xl font-black mb-8 text-center">Choose Your Support Level</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {donationTiers.map((tier, idx) => (
                <button key={tier.name}
                  onClick={() => handleSelectTier(idx)}
                  className={`rounded-2xl border-2 p-8 transition-all text-left ${
                    selectedTier === idx
                      ? 'bg-pink/10 border-pink shadow-lg shadow-pink/20'
                      : 'bg-surface border-white/8 hover:border-white/15'
                  }`}>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className={`font-black text-lg ${selectedTier === idx ? 'text-pink' : 'text-white'}`}>{tier.name}</h3>
                    <Star size={18} fill={selectedTier === idx ? '#E91E8C' : 'none'} className={selectedTier === idx ? 'text-pink' : 'text-gray-600'} />
                  </div>
                  <p className="gradient-text-pink font-black text-3xl mb-1">KES {tier.amount.toLocaleString()}</p>
                  <p className="text-gray-500 text-sm mb-5">{tier.desc}</p>
                  <div className="space-y-2">
                    {tier.perks.map(perk => (
                      <div key={perk} className="flex items-center gap-2 text-xs text-gray-400">
                        <span className="w-1 h-1 rounded-full bg-gray-600" />
                        {perk}
                      </div>
                    ))}
                  </div>
                </button>
              ))}
            </div>

            {/* Custom amount */}
            <div className="max-w-md mx-auto">
              <label className="block text-sm font-bold mb-3 text-gray-400 text-center">Or enter a custom amount (KES)</label>
              <input
                type="number"
                value={customAmount}
                onChange={e => handleCustomAmount(e.target.value)}
                placeholder="Enter amount"
                className="w-full px-6 py-4 rounded-full bg-surface border border-white/8 text-white placeholder-gray-600 focus:outline-none focus:border-gold"
              />
            </div>
          </div>

          {/* Payment summary */}
          {amount > 0 && (
            <div className="max-w-md mx-auto mb-12">
              <div className="rounded-2xl bg-gradient-to-br from-gold/10 via-surface to-surface border border-gold/20 p-8">
                <p className="text-gray-400 text-sm mb-2">Donation Amount</p>
                <p className="gradient-text-gold font-black text-4xl mb-6">KES {amount.toLocaleString()}</p>
                <button
                  onClick={() => setPayOpen(true)}
                  className="btn-shimmer w-full py-4 rounded-full bg-pink hover:bg-pink-dark text-white font-bold transition-colors flex items-center justify-center gap-2">
                  <Heart size={18} />
                  Donate via M-Pesa
                </button>
              </div>
            </div>
          )}

          {/* Sponsors section */}
          <div className="mt-24 pt-16 border-t border-white/8">
            <h2 className="text-3xl font-black mb-8 text-center">Become an Official Sponsor</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
              {[
                { name: 'Akash Ltd', tier: 'Premium Sponsor', desc: 'Akash Ltd has been a vital partner in Eleven Stars FC\'s rise to the Conference League.' },
                { name: 'Moxi Aluminium', tier: 'Premium Sponsor', desc: 'Moxi Aluminium supports the team\'s training facilities and equipment needs.' },
              ].map(s => (
                <div key={s.name} className="rounded-2xl bg-surface border border-gold/20 p-8 hover:border-gold/40 transition-colors">
                  <p className="gradient-text-gold font-black text-2xl mb-1">{s.name}</p>
                  <p className="text-gold text-xs font-bold mb-3">{s.tier}</p>
                  <p className="text-gray-400 text-sm">{s.desc}</p>
                </div>
              ))}
            </div>
            <div className="text-center">
              <p className="text-gray-500 mb-4">Interested in becoming a sponsor? Contact us at <span className="text-gold font-semibold">info@elevenstarsfc.co.ke</span></p>
            </div>
          </div>

        </div>
      </section>

      <ManualPaymentModal
        isOpen={payOpen}
        onClose={() => setPayOpen(false)}
        amount={amount}
        description={`Eleven Stars FC Donation · KES ${amount.toLocaleString()}`}
        onSuccess={() => setAmount(0)}
      />
    </div>
  )
}
