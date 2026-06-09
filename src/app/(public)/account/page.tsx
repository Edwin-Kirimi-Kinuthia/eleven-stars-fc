'use client'

import { useState, useEffect } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ShoppingBag, Ticket, LogOut, User, Package, Clock, CheckCircle, XCircle, Truck, Loader2, Save, Edit3 } from 'lucide-react'

const ORDER_STATUS: Record<string, { label: string; color: string; icon: typeof Clock }> = {
  pending:          { label: 'Pending Review', color: '#C9A84C', icon: Clock },
  confirmed:        { label: 'Confirmed',       color: '#22C55E', icon: CheckCircle },
  processing:       { label: 'Processing',      color: '#3B82F6', icon: Package },
  shipped:          { label: 'Shipped',          color: '#8B5CF6', icon: Truck },
  pending_delivery: { label: 'Out for Delivery', color: '#F97316', icon: Truck },
  delivered:        { label: 'Delivered',        color: '#22C55E', icon: CheckCircle },
  cancelled:        { label: 'Cancelled',        color: '#EF4444', icon: XCircle },
}

const TICKET_STATUS: Record<string, { label: string; color: string }> = {
  pending:   { label: 'Awaiting Confirmation', color: '#C9A84C' },
  confirmed: { label: 'Confirmed',              color: '#22C55E' },
  cancelled: { label: 'Cancelled',              color: '#EF4444' },
}

interface Order {
  id: string; total: number; status: string; createdAt: string
  items: Array<{ name: string; qty: number; price: number }>
  address?: string
}
interface TicketPurchase {
  id: string; matchName: string; type: string; quantity: number
  total: number; status: string; createdAt: string
}
interface Profile {
  id: string; name: string; email: string; phone?: string | null
  bio?: string | null; location?: string | null; createdAt: string
}

export default function AccountPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [tab, setTab] = useState<'orders' | 'tickets' | 'profile'>('orders')
  const [orders, setOrders] = useState<Order[]>([])
  const [tickets, setTickets] = useState<TicketPurchase[]>([])
  const [loading, setLoading] = useState(true)

  // Profile state
  const [profile, setProfile] = useState<Profile | null>(null)
  const [profileForm, setProfileForm] = useState({ name: '', phone: '', bio: '', location: '' })
  const [editingProfile, setEditingProfile] = useState(false)
  const [savingProfile, setSavingProfile] = useState(false)
  const [profileSaved, setProfileSaved] = useState(false)
  const [profileError, setProfileError] = useState('')

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/login')
    if (status === 'authenticated') {
      if (session?.user?.role === 'admin') { router.push('/admin/dashboard'); return }
      Promise.all([
        fetch('/api/orders').then(r => r.json()).catch(() => []),
        fetch('/api/ticket-purchases').then(r => r.json()).catch(() => []),
        fetch('/api/profile').then(r => r.json()).catch(() => null),
      ]).then(([o, t, p]) => {
        setOrders(Array.isArray(o) ? o : [])
        setTickets(Array.isArray(t) ? t : [])
        if (p && !p.error) {
          setProfile(p)
          setProfileForm({ name: p.name || '', phone: p.phone || '', bio: p.bio || '', location: p.location || '' })
        }
      }).finally(() => setLoading(false))
    }
  }, [status, session, router])

  const saveProfile = async () => {
    setSavingProfile(true)
    setProfileError('')
    try {
      const res = await fetch('/api/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profileForm),
      })
      if (!res.ok) throw new Error('Failed to save')
      const updated = await res.json()
      setProfile(updated)
      setEditingProfile(false)
      setProfileSaved(true)
      setTimeout(() => setProfileSaved(false), 3000)
    } catch {
      setProfileError('Failed to save profile. Try again.')
    } finally {
      setSavingProfile(false)
    }
  }

  if (status === 'loading' || loading) {
    return <div className="min-h-screen flex items-center justify-center" style={{ background: '#080808' }}><Loader2 size={32} className="animate-spin" style={{ color: '#E91E8C' }} /></div>
  }
  if (!session) return null

  const formatDate = (d: string) => new Date(d).toLocaleDateString('en-KE', { day: 'numeric', month: 'short', year: 'numeric' })

  const inputClass = "w-full px-4 py-3 rounded-xl text-white text-sm outline-none transition-all bg-white/5 border border-white/10 focus:border-pink-500/60"

  return (
    <div className="min-h-screen" style={{ background: '#080808' }}>
      <div className="max-w-3xl mx-auto px-4 py-12 space-y-8">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ background: 'rgba(233,30,140,0.15)' }}>
              <User size={20} style={{ color: '#E91E8C' }} />
            </div>
            <div>
              <h1 className="text-white font-black text-xl">{session.user?.name}</h1>
              <p className="text-gray-400 text-sm">{session.user?.email}</p>
            </div>
          </div>
          <button onClick={() => signOut({ callbackUrl: '/' })} className="flex items-center gap-2 px-4 py-2 rounded-xl text-gray-400 hover:text-white text-sm transition-colors" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <LogOut size={14} /> Sign Out
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 flex-wrap">
          {[
            { id: 'orders', label: 'My Orders', icon: ShoppingBag },
            { id: 'tickets', label: 'My Tickets', icon: Ticket },
            { id: 'profile', label: 'Profile', icon: User },
          ].map(({ id, label, icon: Icon }) => (
            <button key={id} onClick={() => setTab(id as typeof tab)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all"
              style={{ background: tab === id ? 'linear-gradient(135deg,#E91E8C,#C4186F)' : 'rgba(255,255,255,0.05)', color: tab === id ? 'white' : '#9CA3AF', border: '1px solid ' + (tab === id ? 'transparent' : 'rgba(255,255,255,0.08)') }}>
              <Icon size={14} /> {label}
            </button>
          ))}
        </div>

        {/* ORDERS */}
        {tab === 'orders' && (
          <div className="space-y-4">
            {orders.length === 0 ? (
              <div className="p-12 rounded-2xl text-center" style={{ background: '#141414', border: '1px solid rgba(255,255,255,0.06)' }}>
                <ShoppingBag size={36} className="mx-auto mb-4 opacity-20" style={{ color: '#E91E8C' }} />
                <p className="text-gray-400 text-sm">No orders yet.</p>
                <Link href="/shop" className="inline-block mt-4 px-5 py-2 rounded-xl text-white text-sm font-semibold" style={{ background: 'linear-gradient(135deg,#E91E8C,#C4186F)' }}>Shop Now</Link>
              </div>
            ) : orders.map(order => {
              const st = ORDER_STATUS[order.status] || ORDER_STATUS.pending
              const Icon = st.icon
              return (
                <div key={order.id} className="rounded-2xl p-5 space-y-3" style={{ background: '#141414', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-white font-bold text-sm">Order #{order.id.slice(-8).toUpperCase()}</p>
                      <p className="text-gray-500 text-xs mt-0.5">{formatDate(order.createdAt)}</p>
                    </div>
                    <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold" style={{ background: st.color + '20', color: st.color }}>
                      <Icon size={11} /> {st.label}
                    </span>
                  </div>
                  <div className="space-y-1">
                    {order.items.map((item, i) => (
                      <div key={i} className="flex justify-between text-sm">
                        <span className="text-gray-300">{item.name} × {item.qty}</span>
                        <span className="text-gray-400">KES {(item.price * item.qty).toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between items-center pt-2" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                    <span className="text-gray-400 text-sm">Total</span>
                    <span className="text-white font-black">KES {order.total.toLocaleString()}</span>
                  </div>
                  {order.address && <p className="text-gray-500 text-xs">Delivery: {order.address}</p>}
                </div>
              )
            })}
          </div>
        )}

        {/* TICKETS */}
        {tab === 'tickets' && (
          <div className="space-y-4">
            {tickets.length === 0 ? (
              <div className="p-12 rounded-2xl text-center" style={{ background: '#141414', border: '1px solid rgba(255,255,255,0.06)' }}>
                <Ticket size={36} className="mx-auto mb-4 opacity-20" style={{ color: '#E91E8C' }} />
                <p className="text-gray-400 text-sm">No tickets yet.</p>
                <Link href="/tickets" className="inline-block mt-4 px-5 py-2 rounded-xl text-white text-sm font-semibold" style={{ background: 'linear-gradient(135deg,#E91E8C,#C4186F)' }}>Buy Tickets</Link>
              </div>
            ) : tickets.map(tp => {
              const st = TICKET_STATUS[tp.status] || TICKET_STATUS.pending
              return (
                <div key={tp.id} className="rounded-2xl p-5 space-y-3" style={{ background: '#141414', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-white font-bold text-sm">{tp.matchName}</p>
                      <p className="text-gray-500 text-xs mt-0.5 capitalize">{tp.type} · {tp.quantity} ticket{tp.quantity > 1 ? 's' : ''}</p>
                    </div>
                    <span className="px-3 py-1.5 rounded-full text-xs font-semibold" style={{ background: st.color + '20', color: st.color }}>{st.label}</span>
                  </div>
                  <div className="flex justify-between items-center" style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '12px' }}>
                    <span className="text-gray-400 text-sm">{formatDate(tp.createdAt)}</span>
                    <span className="text-white font-black">KES {tp.total.toLocaleString()}</span>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* PROFILE */}
        {tab === 'profile' && (
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-white font-black text-lg">My Profile</h2>
                <p className="text-gray-500 text-xs mt-0.5">Manage your personal information</p>
              </div>
              {!editingProfile ? (
                <button onClick={() => setEditingProfile(true)} className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-gray-300 hover:text-white transition-colors" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
                  <Edit3 size={13} /> Edit
                </button>
              ) : null}
            </div>

            {profileSaved && (
              <div className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold text-green-400" style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.2)' }}>
                <CheckCircle size={15} /> Profile saved successfully!
              </div>
            )}

            {editingProfile ? (
              <div className="rounded-2xl p-6 space-y-4" style={{ background: '#141414', border: '1px solid rgba(233,30,140,0.2)' }}>
                {profileError && <p className="text-red-400 text-sm">{profileError}</p>}

                <div>
                  <label className="text-gray-400 text-xs font-semibold mb-1.5 block">Full Name</label>
                  <input className={inputClass} value={profileForm.name} onChange={e => setProfileForm(f => ({...f, name: e.target.value}))} placeholder="Your full name" />
                </div>
                <div>
                  <label className="text-gray-400 text-xs font-semibold mb-1.5 block">Phone Number</label>
                  <input className={inputClass} value={profileForm.phone} onChange={e => setProfileForm(f => ({...f, phone: e.target.value}))} placeholder="07XXXXXXXX" />
                </div>
                <div>
                  <label className="text-gray-400 text-xs font-semibold mb-1.5 block">Location</label>
                  <input className={inputClass} value={profileForm.location} onChange={e => setProfileForm(f => ({...f, location: e.target.value}))} placeholder="e.g. Meru Town" />
                </div>
                <div>
                  <label className="text-gray-400 text-xs font-semibold mb-1.5 block">About Me</label>
                  <textarea className={inputClass + ' min-h-[80px] resize-none'} value={profileForm.bio} onChange={e => setProfileForm(f => ({...f, bio: e.target.value}))} placeholder="Tell us something about yourself..." />
                </div>

                <div className="flex gap-3 pt-1">
                  <button onClick={saveProfile} disabled={savingProfile} className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-white text-sm font-bold disabled:opacity-50" style={{ background: 'linear-gradient(135deg,#E91E8C,#C4186F)' }}>
                    {savingProfile ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                    Save Changes
                  </button>
                  <button onClick={() => { setEditingProfile(false); setProfileError('') }} className="px-5 py-2.5 rounded-xl text-gray-300 text-sm font-semibold" style={{ background: 'rgba(255,255,255,0.06)' }}>Cancel</button>
                </div>
              </div>
            ) : (
              <div className="rounded-2xl p-6 space-y-4" style={{ background: '#141414', border: '1px solid rgba(255,255,255,0.06)' }}>
                {[
                  { label: 'Full Name', value: profile?.name || session.user?.name },
                  { label: 'Email', value: profile?.email || session.user?.email },
                  { label: 'Phone', value: profile?.phone || '—' },
                  { label: 'Location', value: profile?.location || '—' },
                ].map(({ label, value }) => (
                  <div key={label} className="flex items-start justify-between gap-4">
                    <span className="text-gray-500 text-sm w-28 shrink-0">{label}</span>
                    <span className="text-white text-sm text-right">{value}</span>
                  </div>
                ))}
                {profile?.bio && (
                  <div className="pt-3" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                    <p className="text-gray-500 text-xs mb-2">About Me</p>
                    <p className="text-gray-300 text-sm leading-relaxed">{profile.bio}</p>
                  </div>
                )}
                {profile?.createdAt && (
                  <div className="pt-3" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                    <p className="text-gray-600 text-xs">Member since {new Date(profile.createdAt).toLocaleDateString('en-KE', { month: 'long', year: 'numeric' })}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  )
}
