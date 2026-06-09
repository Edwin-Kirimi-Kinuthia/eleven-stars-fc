'use client'

import { useState } from 'react'
import ManualPaymentModal from '@/components/ui/ManualPaymentModal'
import PageHeader from '@/components/ui/PageHeader'
import { Ticket } from 'lucide-react'

export default function TicketsPage() {
  const [selectedMatch, setSelectedMatch] = useState(0)
  const [selectedType, setSelectedType] = useState('regular')
  const [payOpen, setPayOpen] = useState(false)

  const matches = [
    { name: 'Eleven Stars FC vs TBD', date: 'Date TBA', venue: 'Meru Stadium' },
  ]

  const types = [
    { id: 'regular', name: 'Regular',  price: 200 },
  ]

  const selectedPrice = types.find(t => t.id === selectedType)?.price || 200

  return (
    <div className="bg-base text-white">
      <PageHeader eyebrow="Match Access" title="Buy" highlight="Tickets" description="Secure your seat for Conference League action." />

      <section className="py-20 lg:py-28">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="space-y-8">

            {/* Match selection */}
            <div>
              <label className="block text-sm font-bold mb-4 text-gray-400">Choose Match</label>
              <div className="space-y-3">
                {matches.map((m, i) => (
                  <button key={i}
                    onClick={() => setSelectedMatch(i)}
                    className={`w-full p-5 rounded-2xl border-2 transition-all text-left ${
                      selectedMatch === i
                        ? 'bg-pink/10 border-pink text-white'
                        : 'bg-surface border-white/8 hover:border-white/15 text-gray-300'
                    }`}>
                    <p className="font-black text-base mb-1">{m.name}</p>
                    <p className="text-xs text-gray-400">{m.date} · {m.venue}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Ticket type */}
            <div>
              <label className="block text-sm font-bold mb-4 text-gray-400">Ticket Type</label>
              <div className="grid grid-cols-3 gap-3">
                {types.map(t => (
                  <button key={t.id}
                    onClick={() => setSelectedType(t.id)}
                    className={`p-4 rounded-2xl border-2 transition-all text-center ${
                      selectedType === t.id
                        ? 'bg-pink/10 border-pink'
                        : 'bg-surface border-white/8 hover:border-white/15'
                    }`}>
                    <p className={`font-black text-sm ${selectedType === t.id ? 'text-pink' : 'text-white'}`}>{t.name}</p>
                    <p className={`text-xs mt-1 ${selectedType === t.id ? 'text-pink' : 'text-gray-500'}`}>KES {t.price}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Summary */}
            <div className="rounded-2xl bg-gradient-to-br from-pink/8 via-surface to-surface border border-pink/20 p-8">
              <div className="flex items-center justify-between mb-6">
                <span className="text-gray-400">Price per Ticket</span>
                <p className="text-4xl font-black gradient-text-pink">KES {selectedPrice}</p>
              </div>
              <p className="text-sm text-gray-400 mb-6">
                Tickets are delivered digitally via SMS after payment. Present your M-Pesa confirmation at the gate.
              </p>
              <button
                onClick={() => setPayOpen(true)}
                className="btn-shimmer w-full py-4 rounded-full bg-pink hover:bg-pink-dark text-white font-bold transition-colors">
                <Ticket className="inline mr-2" size={18} />
                Proceed to Payment
              </button>
            </div>

            {/* Info */}
            <div className="rounded-2xl bg-surface border border-white/8 p-6">
              <p className="text-gray-400 text-sm leading-relaxed">
                <strong className="text-white">How it works:</strong> Select your match and ticket type, complete payment via M-Pesa STK Push, and your ticket details will be sent to your phone immediately. No refunds are possible once purchased.
              </p>
            </div>

          </div>

        </div>
      </section>

      <ManualPaymentModal
        isOpen={payOpen}
        onClose={() => setPayOpen(false)}
        amount={selectedPrice}
        description={`Eleven Stars FC Ticket · ${types.find(t => t.id === selectedType)?.name}`}
        onSuccess={() => {}}
      />
    </div>
  )
}
