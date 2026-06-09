'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'

interface Fixture {
  id: string
  homeTeam: string
  awayTeam: string
  date?: string | null
  venue: string
  status: string
}

const TICKET_TYPES = ['regular', 'vip', 'student', 'group']

export default function CreateTicketPage() {
  const router = useRouter()
  const [fixtures, setFixtures] = useState<Fixture[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [ticketForm, setTicketForm] = useState({
    fixtureId: '',
    type: 'regular',
    price: 200,
    quantity: 100,
  })

  useEffect(() => {
    fetch('/api/fixtures')
      .then(r => r.json())
      .then(data => {
        const upcoming = Array.isArray(data) ? data.filter((f: Fixture) => f.status === 'upcoming') : []
        setFixtures(upcoming)
        if (upcoming.length > 0) {
          setTicketForm(prev => ({ ...prev, fixtureId: upcoming[0].id }))
        }
      })
      .catch(() => {})
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!ticketForm.fixtureId) { setError('Please select a match'); return }
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(ticketForm),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to create ticket batch')
      }

      router.push('/admin/tickets')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create ticket batch')
      setLoading(false)
    }
  }

  const formatDate = (d?: string | null) => {
    if (!d) return 'Date TBA'
    return new Date(d).toLocaleDateString('en-KE', { day: 'numeric', month: 'short', year: 'numeric' })
  }

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-2xl">
      <h1 className="text-white text-2xl font-black">Create Ticket Batch</h1>
      <p className="text-gray-400 text-sm -mt-4">Create a batch of tickets for an upcoming match.</p>

      {error && (
        <div className="p-3 rounded-xl text-sm text-red-400" style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)' }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="rounded-2xl p-6 space-y-5" style={{ background: '#141414', border: '1px solid rgba(255,255,255,0.06)' }}>

        <div>
          <label className="text-gray-300 text-sm font-bold block mb-2">Select Match <span className="text-[#E91E8C]">*</span></label>
          {fixtures.length === 0 ? (
            <p className="text-gray-500 text-sm py-2">No upcoming fixtures. Add a fixture first.</p>
          ) : (
            <select
              value={ticketForm.fixtureId}
              onChange={e => setTicketForm(prev => ({ ...prev, fixtureId: e.target.value }))}
              required
              className="w-full px-4 py-3 rounded-xl text-white text-sm outline-none"
              style={{ background: '#1E1E1E', border: '1px solid rgba(255,255,255,0.08)' }}
            >
              {fixtures.map(f => (
                <option key={f.id} value={f.id}>
                  {f.homeTeam} vs {f.awayTeam} — {formatDate(f.date)} @ {f.venue}
                </option>
              ))}
            </select>
          )}
        </div>

        <div>
          <label className="text-gray-300 text-sm font-bold block mb-2">Ticket Type</label>
          <select
            value={ticketForm.type}
            onChange={e => setTicketForm(prev => ({ ...prev, type: e.target.value }))}
            className="w-full px-4 py-3 rounded-xl text-white text-sm outline-none capitalize"
            style={{ background: '#1E1E1E', border: '1px solid rgba(255,255,255,0.08)' }}
          >
            {TICKET_TYPES.map(t => (
              <option key={t} value={t} className="capitalize">{t.charAt(0).toUpperCase() + t.slice(1)}</option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-gray-300 text-sm font-bold block mb-2">Price (KES) <span className="text-[#E91E8C]">*</span></label>
            <input
              type="number"
              value={ticketForm.price}
              onChange={e => setTicketForm(prev => ({ ...prev, price: parseInt(e.target.value) || 0 }))}
              min="1"
              required
              className="w-full px-4 py-3 rounded-xl text-white text-sm outline-none"
              style={{ background: '#1E1E1E', border: '1px solid rgba(255,255,255,0.08)' }}
            />
          </div>
          <div>
            <label className="text-gray-300 text-sm font-bold block mb-2">Number of Tickets <span className="text-[#E91E8C]">*</span></label>
            <input
              type="number"
              value={ticketForm.quantity}
              onChange={e => setTicketForm(prev => ({ ...prev, quantity: parseInt(e.target.value) || 0 }))}
              min="1"
              required
              className="w-full px-4 py-3 rounded-xl text-white text-sm outline-none"
              style={{ background: '#1E1E1E', border: '1px solid rgba(255,255,255,0.08)' }}
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading || fixtures.length === 0}
          className="w-full py-3 rounded-xl text-white font-bold transition-all hover:scale-[1.02] disabled:opacity-60"
          style={{ background: 'linear-gradient(135deg, #E91E8C, #C4186F)' }}
        >
          {loading ? <><Loader2 size={16} className="inline animate-spin mr-2" />Creating...</> : 'Create Ticket Batch'}
        </button>
      </form>
    </div>
  )
}
