'use client'

import { useState, useEffect } from 'react'
import { ShoppingBag, Ticket, Loader2, ChevronDown } from 'lucide-react'

const ORDER_STATUSES = ['pending', 'confirmed', 'processing', 'shipped', 'pending_delivery', 'delivered', 'cancelled']
const TICKET_STATUSES = ['pending', 'confirmed', 'cancelled']

const STATUS_COLORS: Record<string, string> = {
  pending:          '#C9A84C',
  confirmed:        '#22C55E',
  processing:       '#3B82F6',
  shipped:          '#8B5CF6',
  pending_delivery: '#F97316',
  delivered:        '#22C55E',
  cancelled:        '#EF4444',
}
const STATUS_LABELS: Record<string, string> = {
  pending:          'Pending',
  confirmed:        'Confirmed',
  processing:       'Processing',
  shipped:          'Shipped',
  pending_delivery: 'Out for Delivery',
  delivered:        'Delivered',
  cancelled:        'Cancelled',
}

interface Order {
  id: string; total: number; status: string; createdAt: string
  name: string; phone: string; email?: string; address?: string; mpesaRef?: string; notes?: string
  items: Array<{ name: string; qty: number; price: number }>
  user?: { name: string; email: string }
}

interface TicketPurchase {
  id: string; matchName: string; type: string; quantity: number
  total: number; status: string; createdAt: string
  name: string; phone: string; email?: string; mpesaRef?: string
  user?: { name: string; email: string }
}

export default function AdminOrdersPage() {
  const [tab, setTab] = useState<'orders' | 'tickets'>('orders')
  const [orders, setOrders] = useState<Order[]>([])
  const [tickets, setTickets] = useState<TicketPurchase[]>([])
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState<string | null>(null)

  useEffect(() => {
    Promise.all([
      fetch('/api/orders').then(r => r.json()).catch(() => []),
      fetch('/api/ticket-purchases').then(r => r.json()).catch(() => []),
    ]).then(([o, t]) => {
      setOrders(Array.isArray(o) ? o : [])
      setTickets(Array.isArray(t) ? t : [])
    }).finally(() => setLoading(false))
  }, [])

  const updateOrderStatus = async (id: string, status: string, mpesaRef?: string) => {
    setUpdating(id)
    const res = await fetch(`/api/orders/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, ...(mpesaRef !== undefined && { mpesaRef }) }),
    })
    if (res.ok) {
      const updated = await res.json()
      setOrders(prev => prev.map(o => o.id === id ? { ...o, ...updated } : o))
    }
    setUpdating(null)
  }

  const updateTicketStatus = async (id: string, status: string, mpesaRef?: string) => {
    setUpdating(id)
    const res = await fetch(`/api/ticket-purchases/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, ...(mpesaRef !== undefined && { mpesaRef }) }),
    })
    if (res.ok) {
      const updated = await res.json()
      setTickets(prev => prev.map(t => t.id === id ? { ...t, ...updated } : t))
    }
    setUpdating(null)
  }

  const formatDate = (d: string) => new Date(d).toLocaleDateString('en-KE', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })

  if (loading) return <div className="p-8 flex items-center justify-center min-h-[400px]"><Loader2 size={32} className="animate-spin" style={{ color: '#E91E8C' }} /></div>

  const pendingOrders = orders.filter(o => o.status === 'pending').length
  const pendingTickets = tickets.filter(t => t.status === 'pending').length

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <div>
        <h1 className="text-white text-2xl font-black">Orders & Tickets</h1>
        <p className="text-gray-400 text-sm mt-0.5">Review payments and update order statuses</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        {[
          { id: 'orders', label: 'Merchandise Orders', icon: ShoppingBag, badge: pendingOrders },
          { id: 'tickets', label: 'Ticket Purchases', icon: Ticket, badge: pendingTickets },
        ].map(({ id, label, icon: Icon, badge }) => (
          <button key={id} onClick={() => setTab(id as 'orders' | 'tickets')}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all relative"
            style={{ background: tab === id ? 'linear-gradient(135deg,#E91E8C,#C4186F)' : '#141414', color: tab === id ? 'white' : '#9CA3AF', border: '1px solid ' + (tab === id ? 'transparent' : 'rgba(255,255,255,0.06)') }}>
            <Icon size={14} /> {label}
            {badge > 0 && <span className="w-5 h-5 rounded-full bg-white text-[#E91E8C] text-xs font-black flex items-center justify-center">{badge}</span>}
          </button>
        ))}
      </div>

      {/* Merchandise Orders */}
      {tab === 'orders' && (
        <div className="space-y-4">
          {orders.length === 0 ? (
            <div className="p-10 rounded-2xl text-center" style={{ background: '#141414', border: '1px solid rgba(255,255,255,0.06)' }}>
              <ShoppingBag size={32} className="mx-auto mb-3 opacity-20" style={{ color: '#E91E8C' }} />
              <p className="text-gray-400 text-sm">No orders yet.</p>
            </div>
          ) : orders.map(order => (
            <div key={order.id} className="rounded-2xl p-5 space-y-4" style={{ background: '#141414', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div>
                  <p className="text-white font-bold">#{order.id.slice(-8).toUpperCase()}</p>
                  <p className="text-gray-500 text-xs mt-0.5">{formatDate(order.createdAt)}</p>
                  <p className="text-gray-300 text-sm mt-1">{order.name} · {order.phone}</p>
                  {order.email && <p className="text-gray-500 text-xs">{order.email}</p>}
                  {order.address && <p className="text-gray-500 text-xs">📍 {order.address}</p>}
                </div>
                <div className="text-right">
                  <p className="text-white font-black text-lg">KES {order.total.toLocaleString()}</p>
                  <span className="inline-block px-2.5 py-1 rounded-full text-xs font-semibold mt-1" style={{ background: (STATUS_COLORS[order.status] || '#888') + '20', color: STATUS_COLORS[order.status] || '#888' }}>
                    {STATUS_LABELS[order.status] || order.status}
                  </span>
                </div>
              </div>

              {/* Items */}
              <div className="space-y-1 p-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)' }}>
                {order.items.map((item, i) => (
                  <div key={i} className="flex justify-between text-sm">
                    <span className="text-gray-300">{item.name} × {item.qty}</span>
                    <span className="text-gray-400">KES {(item.price * item.qty).toLocaleString()}</span>
                  </div>
                ))}
              </div>

              {/* Status update */}
              <div className="flex flex-wrap items-center gap-3">
                <div className="relative">
                  <select
                    value={order.status}
                    onChange={e => updateOrderStatus(order.id, e.target.value)}
                    disabled={updating === order.id}
                    className="appearance-none pl-4 pr-8 py-2 rounded-xl text-white text-sm outline-none cursor-pointer"
                    style={{ background: '#1E1E1E', border: '1px solid rgba(255,255,255,0.1)' }}
                  >
                    {ORDER_STATUSES.map(s => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
                  </select>
                  <ChevronDown size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>

                <input
                  placeholder="M-Pesa ref (optional)"
                  defaultValue={order.mpesaRef || ''}
                  onBlur={e => updateOrderStatus(order.id, order.status, e.target.value)}
                  className="px-3 py-2 rounded-xl text-white text-sm outline-none flex-1 min-w-0"
                  style={{ background: '#1E1E1E', border: '1px solid rgba(255,255,255,0.1)' }}
                />

                {updating === order.id && <Loader2 size={16} className="animate-spin" style={{ color: '#E91E8C' }} />}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Ticket Purchases */}
      {tab === 'tickets' && (
        <div className="space-y-4">
          {tickets.length === 0 ? (
            <div className="p-10 rounded-2xl text-center" style={{ background: '#141414', border: '1px solid rgba(255,255,255,0.06)' }}>
              <Ticket size={32} className="mx-auto mb-3 opacity-20" style={{ color: '#E91E8C' }} />
              <p className="text-gray-400 text-sm">No ticket purchases yet.</p>
            </div>
          ) : tickets.map(tp => (
            <div key={tp.id} className="rounded-2xl p-5 space-y-4" style={{ background: '#141414', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div>
                  <p className="text-white font-bold">{tp.matchName}</p>
                  <p className="text-gray-400 text-sm mt-0.5 capitalize">{tp.type} · {tp.quantity} ticket{tp.quantity > 1 ? 's' : ''}</p>
                  <p className="text-gray-300 text-sm mt-1">{tp.name} · {tp.phone}</p>
                  {tp.email && <p className="text-gray-500 text-xs">{tp.email}</p>}
                  <p className="text-gray-500 text-xs">{formatDate(tp.createdAt)}</p>
                </div>
                <div className="text-right">
                  <p className="text-white font-black text-lg">KES {tp.total.toLocaleString()}</p>
                  <span className="inline-block px-2.5 py-1 rounded-full text-xs font-semibold mt-1" style={{ background: (STATUS_COLORS[tp.status] || '#888') + '20', color: STATUS_COLORS[tp.status] || '#888' }}>
                    {STATUS_LABELS[tp.status] || tp.status}
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <div className="relative">
                  <select
                    value={tp.status}
                    onChange={e => updateTicketStatus(tp.id, e.target.value)}
                    disabled={updating === tp.id}
                    className="appearance-none pl-4 pr-8 py-2 rounded-xl text-white text-sm outline-none cursor-pointer"
                    style={{ background: '#1E1E1E', border: '1px solid rgba(255,255,255,0.1)' }}
                  >
                    {TICKET_STATUSES.map(s => <option key={s} value={s}>{STATUS_LABELS[s] || s}</option>)}
                  </select>
                  <ChevronDown size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>
                <input
                  placeholder="M-Pesa ref (optional)"
                  defaultValue={tp.mpesaRef || ''}
                  onBlur={e => updateTicketStatus(tp.id, tp.status, e.target.value)}
                  className="px-3 py-2 rounded-xl text-white text-sm outline-none flex-1 min-w-0"
                  style={{ background: '#1E1E1E', border: '1px solid rgba(255,255,255,0.1)' }}
                />
                {updating === tp.id && <Loader2 size={16} className="animate-spin" style={{ color: '#E91E8C' }} />}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
