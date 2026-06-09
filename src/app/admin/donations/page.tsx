'use client'

import { useState, useEffect } from 'react'
import { Heart, TrendingUp, Download, Loader2 } from 'lucide-react'

interface Donation {
  id: string
  phone: string
  amount: number
  tier?: string | null
  message?: string | null
  status: string
  createdAt: string
}

export default function AdminDonationsPage() {
  const [donations, setDonations] = useState<Donation[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/donations')
      .then(r => r.json())
      .then(data => setDonations(Array.isArray(data) ? data : []))
      .catch(() => setDonations([]))
      .finally(() => setLoading(false))
  }, [])

  const total = donations.reduce((s, d) => s + d.amount, 0)
  const thisMonth = donations
    .filter(d => new Date(d.createdAt).getMonth() === new Date().getMonth())
    .reduce((s, d) => s + d.amount, 0)

  const exportCsv = () => {
    const rows = [
      ['Phone', 'Amount', 'Tier', 'Status', 'Date'],
      ...donations.map(d => [
        d.phone,
        d.amount,
        d.tier || '-',
        d.status,
        new Date(d.createdAt).toLocaleDateString('en-KE'),
      ]),
    ]
    const csv = rows.map(r => r.join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'donations.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-white text-2xl font-black">Donations</h1>
          <p className="text-gray-400 text-sm mt-0.5">All M-Pesa donations and sponsorships</p>
        </div>
        <button
          onClick={exportCsv}
          disabled={donations.length === 0}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-gray-300 hover:text-white transition-all disabled:opacity-40"
          style={{ background: '#141414', border: '1px solid rgba(255,255,255,0.08)' }}
        >
          <Download size={15} /> Export CSV
        </button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'Total Received', value: `KES ${total.toLocaleString()}`, icon: TrendingUp, color: '#E91E8C' },
          { label: 'Total Donations', value: donations.length, icon: Heart, color: '#C9A84C' },
          { label: 'This Month', value: `KES ${thisMonth.toLocaleString()}`, icon: TrendingUp, color: '#E91E8C' },
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

      {/* Table */}
      <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="grid grid-cols-12 px-5 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500" style={{ background: '#141414', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <span className="col-span-3">Phone</span>
          <span className="col-span-2">Amount</span>
          <span className="col-span-3">Tier / Note</span>
          <span className="col-span-2">Date</span>
          <span className="col-span-2 text-right">Status</span>
        </div>

        {loading ? (
          <div className="px-5 py-16 flex items-center justify-center" style={{ background: '#111' }}>
            <Loader2 size={28} className="animate-spin" style={{ color: '#E91E8C' }} />
          </div>
        ) : donations.length === 0 ? (
          <div className="px-5 py-16 text-center" style={{ background: '#111' }}>
            <Heart size={36} className="mx-auto mb-4 opacity-20" style={{ color: '#E91E8C' }} />
            <p className="text-gray-400 text-sm">No donations recorded yet.</p>
            <p className="text-gray-500 text-xs mt-1">Donations made through the website will appear here automatically.</p>
          </div>
        ) : donations.map(d => (
          <div key={d.id} className="grid grid-cols-12 px-5 py-4 items-center text-sm transition-colors hover:bg-white/[0.02]" style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
            <span className="col-span-3 text-gray-300 font-mono text-xs">{d.phone}</span>
            <span className="col-span-2 font-bold" style={{ color: '#E91E8C' }}>KES {d.amount.toLocaleString()}</span>
            <span className="col-span-3 text-gray-400 truncate">{d.tier || d.message || '—'}</span>
            <span className="col-span-2 text-gray-500 text-xs">{new Date(d.createdAt).toLocaleDateString('en-KE')}</span>
            <span className="col-span-2 text-right">
              <span
                className="px-2 py-0.5 rounded-full text-xs font-semibold"
                style={{
                  background: d.status === 'completed' ? 'rgba(34,197,94,0.15)' : 'rgba(234,179,8,0.15)',
                  color: d.status === 'completed' ? '#4ADE80' : '#EAB308',
                }}
              >
                {d.status}
              </span>
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
