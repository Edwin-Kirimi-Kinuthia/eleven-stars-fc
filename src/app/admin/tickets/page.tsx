'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Plus, Ticket, TrendingUp, Users, Trash2, Loader2 } from 'lucide-react'

interface TicketBatch {
  id: string
  fixtureId: string
  type: string
  price: number
  quantity: number
  sold: number
  createdAt: string
}

interface Fixture {
  id: string
  homeTeam: string
  awayTeam: string
}

export default function AdminTicketsPage() {
  const [tickets, setTickets] = useState<TicketBatch[]>([])
  const [fixtureMap, setFixtureMap] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      fetch('/api/tickets').then(r => r.json()),
      fetch('/api/fixtures').then(r => r.json()),
    ])
      .then(([ticketData, fixtureData]) => {
        setTickets(Array.isArray(ticketData) ? ticketData : [])
        const map: Record<string, string> = {}
        if (Array.isArray(fixtureData)) {
          fixtureData.forEach((f: Fixture) => {
            map[f.id] = `${f.homeTeam} vs ${f.awayTeam}`
          })
        }
        setFixtureMap(map)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const deleteTickets = async (id: string) => {
    if (!confirm('Delete this ticket batch?')) return
    try {
      const res = await fetch(`/api/tickets/${id}`, { method: 'DELETE' })
      if (res.ok) setTickets(prev => prev.filter(t => t.id !== id))
    } catch { /* ignore */ }
  }

  const total = tickets.reduce((s, t) => s + (t.price * t.sold), 0)
  const totalSold = tickets.reduce((s, t) => s + t.sold, 0)

  if (loading) {
    return <div className="p-8 flex items-center justify-center min-h-[300px]"><Loader2 size={32} className="animate-spin" style={{ color: '#E91E8C' }} /></div>
  }

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-white text-2xl font-black">Match Tickets</h1>
          <p className="text-gray-400 text-sm mt-0.5">Manage ticket batches for matches</p>
        </div>
        <Link href="/admin/tickets/new" className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-white text-sm font-semibold" style={{ background: 'linear-gradient(135deg, #E91E8C, #C4186F)' }}>
          <Plus size={16} /> Create Batch
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'Revenue', value: `KES ${total.toLocaleString()}`, icon: TrendingUp, color: '#E91E8C' },
          { label: 'Sold', value: totalSold, icon: Ticket, color: '#C9A84C' },
          { label: 'Batches', value: tickets.length, icon: Users, color: '#E91E8C' },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="p-5 rounded-2xl" style={{ background: '#141414', border: '1px solid rgba(255,255,255,0.06)' }}>
            <div className="flex items-center gap-2 mb-3">
              <Icon size={15} style={{ color }} />
              <p className="text-gray-400 text-xs font-medium uppercase tracking-wider">{label}</p>
            </div>
            <p className="text-white text-2xl font-black">{value}</p>
          </div>
        ))}
      </div>

      <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="grid grid-cols-12 px-5 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500" style={{ background: '#141414', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <span className="col-span-4">Match</span>
          <span className="col-span-2">Type</span>
          <span className="col-span-1">Price</span>
          <span className="col-span-1">Total</span>
          <span className="col-span-1">Sold</span>
          <span className="col-span-2">Available</span>
          <span className="col-span-1 text-right">Del</span>
        </div>

        {tickets.length === 0 ? (
          <div className="px-5 py-16 text-center" style={{ background: '#111' }}>
            <Ticket size={36} className="mx-auto mb-4 opacity-20" style={{ color: '#E91E8C' }} />
            <p className="text-gray-400 text-sm">No ticket batches yet.</p>
            <p className="text-gray-500 text-xs mt-1">Create a batch to start selling match tickets.</p>
          </div>
        ) : (
          tickets.map(batch => (
            <div key={batch.id} className="grid grid-cols-12 px-5 py-4 items-center transition-colors hover:bg-white/[0.02]" style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
              <span className="col-span-4 text-white text-sm font-semibold truncate pr-2">{fixtureMap[batch.fixtureId] || batch.fixtureId.slice(0, 10)}</span>
              <span className="col-span-2 text-gray-400 text-xs capitalize">{batch.type}</span>
              <span className="col-span-1 text-gray-300 text-sm">KES {batch.price}</span>
              <span className="col-span-1 text-gray-300 text-sm">{batch.quantity}</span>
              <span className="col-span-1 font-bold text-sm" style={{ color: '#E91E8C' }}>{batch.sold}</span>
              <span className="col-span-2 text-gray-400 text-sm">{batch.quantity - batch.sold}</span>
              <button
                onClick={() => deleteTickets(batch.id)}
                className="col-span-1 justify-self-end w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-red-400 transition-all hover:bg-red-500/10"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
