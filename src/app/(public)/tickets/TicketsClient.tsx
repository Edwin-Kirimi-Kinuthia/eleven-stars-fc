'use client'

import { useState, useEffect } from 'react'
import { Ticket, Calendar, MapPin, Clock, Users, Minus, Plus, CheckCircle, Loader2 } from 'lucide-react'
import ManualPaymentModal from '@/components/ui/ManualPaymentModal'
import PageHeader from '@/components/ui/PageHeader'

interface TicketBatch {
  id: string
  fixtureId: string
  type: string
  price: number
  quantity: number
  sold: number
}

interface FixtureWithTickets {
  id: string
  homeTeam: string
  awayTeam: string
  date?: string | null
  venue: string
  leagueName: string
  tickets: TicketBatch[]
}

interface Selection {
  fixtureId: string
  ticketId: string
  type: string
  price: number
  qty: number
}

function formatDate(d?: string | null) {
  if (!d) return 'TBA'
  return new Date(d).toLocaleDateString('en-KE', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })
}

function formatTime(d?: string | null) {
  if (!d) return 'TBA'
  const dt = new Date(d)
  const h = dt.getHours(), m = dt.getMinutes()
  if (h === 0 && m === 0) return 'TBA'
  return dt.toLocaleTimeString('en-KE', { hour: '2-digit', minute: '2-digit' })
}

export default function TicketsClient() {
  const [fixtures, setFixtures] = useState<FixtureWithTickets[]>([])
  const [loading, setLoading] = useState(true)
  const [selection, setSelection] = useState<Selection | null>(null)
  const [payOpen, setPayOpen] = useState(false)
  const [purchased, setPurchased] = useState(false)

  useEffect(() => {
    Promise.all([
      fetch('/api/fixtures').then(r => r.json()),
      fetch('/api/tickets').then(r => r.json()),
    ])
      .then(([fixturesData, ticketsData]) => {
        const upcoming = (Array.isArray(fixturesData) ? fixturesData : []).filter(
          (f: { status: string }) => f.status === 'upcoming'
        )
        const allTickets: TicketBatch[] = Array.isArray(ticketsData) ? ticketsData : []
        const combined: FixtureWithTickets[] = upcoming.map((f: { id: string; homeTeam: string; awayTeam: string; date?: string | null; venue: string; leagueName: string }) => ({
          ...f,
          tickets: allTickets.filter(t => t.fixtureId === f.id),
        }))
        setFixtures(combined)
      })
      .catch(() => setFixtures([]))
      .finally(() => setLoading(false))
  }, [])

  const selectTicket = (fixtureId: string, ticketId: string, type: string, price: number) => {
    setSelection(prev =>
      prev?.fixtureId === fixtureId && prev?.ticketId === ticketId
        ? prev
        : { fixtureId, ticketId, type, price, qty: 1 }
    )
  }

  const updateQty = (delta: number) => {
    if (!selection) return
    const next = selection.qty + delta
    if (next < 1 || next > 10) return
    setSelection({ ...selection, qty: next })
  }

  const total = selection ? selection.price * selection.qty : 0
  const currentFixture = fixtures.find(f => f.id === selection?.fixtureId)

  return (
    <div style={{ background: '#080808' }}>
      <PageHeader eyebrow="Match Access" title="Buy" highlight="Tickets" description="Secure your seat for Conference League action." />

      <div className="max-w-4xl mx-auto px-4 pb-20 space-y-6">

        {/* How it works */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
          {[
            { step: '1', label: 'Choose a match', icon: Calendar },
            { step: '2', label: 'Pick ticket type & quantity', icon: Users },
            { step: '3', label: 'Pay via M-Pesa STK Push', icon: Ticket },
          ].map(({ step, label, icon: Icon }) => (
            <div key={step} className="flex items-center gap-4 p-4 rounded-xl" style={{ background: '#141414', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div className="w-9 h-9 rounded-full flex items-center justify-center font-black text-sm flex-shrink-0" style={{ background: 'rgba(233,30,140,0.15)', color: '#E91E8C' }}>
                {step}
              </div>
              <div>
                <Icon size={14} className="mb-0.5" style={{ color: '#E91E8C' }} />
                <p className="text-white text-sm font-medium">{label}</p>
              </div>
            </div>
          ))}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 size={32} className="text-pink animate-spin" />
          </div>
        ) : fixtures.length === 0 ? (
          <div className="p-10 rounded-2xl text-center" style={{ background: '#141414', border: '1px solid rgba(255,255,255,0.06)' }}>
            <Ticket size={40} className="mx-auto mb-4 opacity-20" style={{ color: '#E91E8C' }} />
            <p className="text-gray-400 text-sm">No tickets on sale yet. Check back closer to match day.</p>
          </div>
        ) : (
          fixtures.map(fixture => {
            const activeSelection = selection?.fixtureId === fixture.id ? selection : null
            return (
              <div key={fixture.id} className="rounded-2xl overflow-hidden" style={{ background: '#141414', border: '1px solid rgba(255,255,255,0.06)' }}>
                {/* Fixture header */}
                <div className="p-6" style={{ background: 'linear-gradient(135deg, #140a0f, #1a0812)', borderBottom: '1px solid rgba(233,30,140,0.15)' }}>
                  <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold mb-4" style={{ background: 'rgba(233,30,140,0.15)', color: '#E91E8C' }}>
                    {fixture.leagueName}
                  </span>
                  <div className="flex items-center gap-6 mb-4">
                    <span className="text-white font-black text-xl">{fixture.homeTeam}</span>
                    <span className="px-4 py-1.5 rounded-lg font-black text-xl" style={{ background: 'rgba(201,168,76,0.15)', color: '#C9A84C' }}>VS</span>
                    <span className="text-white font-black text-xl">{fixture.awayTeam}</span>
                  </div>
                  <div className="flex flex-wrap gap-5 text-sm text-gray-300">
                    <span className="flex items-center gap-1.5"><Calendar size={13} style={{ color: '#E91E8C' }} />{formatDate(fixture.date)}</span>
                    <span className="flex items-center gap-1.5"><Clock size={13} style={{ color: '#E91E8C' }} />{formatTime(fixture.date)}</span>
                    <span className="flex items-center gap-1.5"><MapPin size={13} style={{ color: '#E91E8C' }} />{fixture.venue}</span>
                  </div>
                </div>

                {/* Ticket types */}
                <div className="p-6 space-y-3">
                  {fixture.tickets.length === 0 ? (
                    <p className="text-gray-500 text-sm text-center py-4">Tickets for this match are not on sale yet.</p>
                  ) : (
                    <>
                      <p className="text-gray-400 text-sm font-medium mb-4">Select ticket type:</p>
                      {fixture.tickets.map(ticket => {
                        const available = ticket.quantity - ticket.sold
                        const isSelected = activeSelection?.ticketId === ticket.id
                        const soldOut = available <= 0
                        return (
                          <button
                            key={ticket.id}
                            onClick={() => !soldOut && selectTicket(fixture.id, ticket.id, ticket.type, ticket.price)}
                            disabled={soldOut}
                            className="w-full flex items-center justify-between p-4 rounded-xl transition-all duration-200 text-left disabled:opacity-50 disabled:cursor-not-allowed"
                            style={{
                              background: isSelected ? 'rgba(233,30,140,0.12)' : 'rgba(255,255,255,0.03)',
                              border: isSelected ? '1px solid rgba(233,30,140,0.4)' : '1px solid rgba(255,255,255,0.06)',
                            }}
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0" style={{ borderColor: isSelected ? '#E91E8C' : '#374151' }}>
                                {isSelected && <div className="w-2.5 h-2.5 rounded-full" style={{ background: '#E91E8C' }} />}
                              </div>
                              <div>
                                <p className="text-white font-semibold text-sm capitalize">{ticket.type}</p>
                                <p className="text-gray-500 text-xs flex items-center gap-1 mt-0.5">
                                  <Users size={10} /> {soldOut ? 'Sold out' : `${available} available`}
                                </p>
                              </div>
                            </div>
                            <span className="text-[#E91E8C] font-black text-base">KES {ticket.price.toLocaleString()}</span>
                          </button>
                        )
                      })}
                    </>
                  )}
                </div>

                {/* Quantity + checkout */}
                {activeSelection && (
                  <div className="px-6 pb-6 space-y-4" style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '24px' }}>
                    <div className="flex items-center justify-between">
                      <p className="text-gray-300 text-sm font-medium">Quantity</p>
                      <div className="flex items-center gap-4 px-4 py-2 rounded-xl" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
                        <button onClick={() => updateQty(-1)} className="text-gray-300 hover:text-white transition-colors"><Minus size={16} /></button>
                        <span className="text-white font-black text-lg w-6 text-center">{activeSelection.qty}</span>
                        <button onClick={() => updateQty(1)} className="text-gray-300 hover:text-white transition-colors"><Plus size={16} /></button>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-4 rounded-xl" style={{ background: 'rgba(233,30,140,0.08)', border: '1px solid rgba(233,30,140,0.15)' }}>
                      <div>
                        <p className="text-gray-400 text-xs">{activeSelection.qty} × {activeSelection.type} ticket(s)</p>
                        <p className="text-white font-black text-xl">KES {total.toLocaleString()}</p>
                      </div>
                      <button
                        onClick={() => setPayOpen(true)}
                        className="flex items-center gap-2 px-6 py-3 rounded-xl text-white font-bold text-sm transition-all hover:scale-105 pink-glow"
                        style={{ background: 'linear-gradient(135deg, #E91E8C, #C4186F)' }}
                      >
                        <Ticket size={15} /> Buy Now
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )
          })
        )}

        <div className="p-5 rounded-2xl text-center" style={{ background: '#141414', border: '1px solid rgba(255,255,255,0.06)' }}>
          <p className="text-gray-400 text-sm">Tickets are confirmed via SMS after payment. Present your M-Pesa confirmation at the gate.</p>
        </div>

        {purchased && (
          <div className="p-5 rounded-2xl flex items-center gap-4" style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)' }}>
            <CheckCircle size={24} style={{ color: '#4ADE80', flexShrink: 0 }} />
            <div>
              <p className="text-white font-bold text-sm">Tickets purchased!</p>
              <p className="text-gray-400 text-xs mt-0.5">You will receive an SMS confirmation shortly.</p>
            </div>
          </div>
        )}
      </div>

      <ManualPaymentModal
        isOpen={payOpen}
        onClose={() => setPayOpen(false)}
        amount={total}
        description={`${selection?.qty} × ${selection?.type} — ${currentFixture?.homeTeam ?? ''} vs ${currentFixture?.awayTeam ?? ''}`}
        ticketData={selection && currentFixture ? {
          ticketId: selection.ticketId,
          fixtureId: selection.fixtureId,
          matchName: `${currentFixture.homeTeam} vs ${currentFixture.awayTeam}`,
          type: selection.type,
          quantity: selection.qty,
        } : undefined}
        onSuccess={() => { setPayOpen(false); setPurchased(true); setSelection(null) }}
      />
    </div>
  )
}
