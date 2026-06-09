'use client'

import { useState } from 'react'
import { X, Copy, CheckCircle, ArrowRight, ArrowLeft } from 'lucide-react'

interface CartItem { id: string; productId?: string; name: string; price: number; qty: number; size?: string; color?: string }

interface ManualPaymentModalProps {
  isOpen: boolean
  onClose: () => void
  amount: number
  description: string
  onSuccess?: () => void
  // Shop orders
  cartItems?: CartItem[]
  // Ticket purchases
  ticketData?: {
    ticketId: string
    fixtureId: string
    matchName: string
    type: string
    quantity: number
  }
}

export default function ManualPaymentModal({
  isOpen, onClose, amount, description, onSuccess, cartItems, ticketData,
}: ManualPaymentModalProps) {
  const [step, setStep] = useState<'details' | 'payment' | 'success'>('details')
  const [copied, setCopied] = useState(false)
  const [hasSent, setHasSent] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [form, setForm] = useState({ name: '', phone: '', email: '', address: '' })
  const [error, setError] = useState('')

  const paybillCode = '303030'
  const accountNumber = '2051724456'

  if (!isOpen) return null

  const copy = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleProceed = () => {
    if (!form.name.trim()) { setError('Name is required'); return }
    if (!form.phone.trim()) { setError('Phone number is required'); return }
    setError('')
    setStep('payment')
  }

  const handleConfirm = async () => {
    setSubmitting(true)
    setError('')
    try {
      if (cartItems && cartItems.length > 0) {
        const res = await fetch('/api/orders', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            items: cartItems.map(i => ({ productId: i.productId || i.id, name: i.name, qty: i.qty, price: i.price, size: i.size, color: i.color })),
            total: amount,
            name: form.name,
            phone: form.phone,
            email: form.email || null,
            address: form.address || null,
          }),
        })
        if (!res.ok) throw new Error('Failed to save order')
      } else if (ticketData) {
        const res = await fetch('/api/ticket-purchases', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...ticketData,
            total: amount,
            name: form.name,
            phone: form.phone,
            email: form.email || null,
          }),
        })
        if (!res.ok) throw new Error('Failed to save ticket purchase')
      } else {
        // Fallback: record as donation record
        await fetch('/api/donations', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            amount, phone: form.phone, status: 'pending_confirmation',
            donorName: form.name, email: form.email || null,
            message: `Manual payment via Paybill. ${description}`,
          }),
        })
      }
      setStep('success')
      if (onSuccess) onSuccess()
      setTimeout(() => { onClose(); setStep('details'); setForm({ name: '', phone: '', email: '', address: '' }); setHasSent(false) }, 3000)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to record payment')
    } finally {
      setSubmitting(false)
    }
  }

  const inputClass = "w-full px-4 py-3 rounded-xl text-white text-sm outline-none transition-all bg-white/5 border border-white/10 focus:border-pink-500"

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-[#111] border border-white/10 rounded-3xl max-w-md w-full p-8 shadow-2xl max-h-[90vh] overflow-y-auto">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors">
          <X size={20} />
        </button>

        {step === 'success' ? (
          <div className="text-center py-6">
            <div className="size-16 rounded-full bg-green-500/15 flex items-center justify-center mx-auto mb-4">
              <CheckCircle size={32} className="text-green-500" />
            </div>
            <h3 className="text-white font-black text-xl mb-2">Order Received!</h3>
            <p className="text-gray-400 text-sm">
              We'll verify your payment and confirm within 24 hours.
              {ticketData ? ' Your tickets will be sent once confirmed.' : ' We’ll contact you about delivery.'}
            </p>
          </div>
        ) : step === 'details' ? (
          <div className="space-y-5">
            <div>
              <h3 className="text-white font-black text-lg mb-1">Your Details</h3>
              <p className="text-gray-400 text-sm">We'll use this to confirm your order.</p>
            </div>

            <div className="rounded-2xl bg-pink/10 border border-pink/20 p-4">
              <p className="text-gray-400 text-xs font-semibold uppercase mb-1">Total</p>
              <p className="text-white font-black text-2xl">KES {amount.toLocaleString()}</p>
              <p className="text-gray-500 text-xs mt-0.5">{description}</p>
            </div>

            {error && <p className="text-red-400 text-sm">{error}</p>}

            <div className="space-y-3">
              <div>
                <label className="text-gray-400 text-xs font-semibold mb-1 block">Full Name *</label>
                <input className={inputClass} placeholder="John Kamau" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
              </div>
              <div>
                <label className="text-gray-400 text-xs font-semibold mb-1 block">M-Pesa Phone *</label>
                <input className={inputClass} placeholder="07XXXXXXXX" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
              </div>
              <div>
                <label className="text-gray-400 text-xs font-semibold mb-1 block">Email (for receipt)</label>
                <input className={inputClass} type="email" placeholder="you@example.com" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
              </div>
              {cartItems && cartItems.length > 0 && (
                <div>
                  <label className="text-gray-400 text-xs font-semibold mb-1 block">Delivery Address</label>
                  <input className={inputClass} placeholder="e.g. Meru Town, near KFC" value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))} />
                </div>
              )}
            </div>

            <button onClick={handleProceed} className="w-full py-4 rounded-full bg-gradient-to-r from-pink-600 to-pink-700 text-white font-bold flex items-center justify-center gap-2 hover:scale-[1.02] transition-all" style={{ background: 'linear-gradient(135deg,#E91E8C,#C4186F)' }}>
              Continue to Payment <ArrowRight size={16} />
            </button>
          </div>
        ) : (
          <div className="space-y-5">
            <div className="flex items-center gap-3">
              <button onClick={() => setStep('details')} className="text-gray-400 hover:text-white transition-colors"><ArrowLeft size={18} /></button>
              <div>
                <h3 className="text-white font-black text-lg">Send M-Pesa Payment</h3>
                <p className="text-gray-400 text-sm">Use Paybill to pay</p>
              </div>
            </div>

            <div className="rounded-2xl bg-pink/10 border border-pink/20 p-4">
              <p className="text-gray-400 text-xs font-semibold uppercase mb-1">Amount to Pay</p>
              <p className="text-white font-black text-3xl">KES {amount.toLocaleString()}</p>
            </div>

            <div className="space-y-3">
              {[
                { label: 'Paybill Code', value: paybillCode },
                { label: 'Account Number', value: accountNumber },
                { label: 'Bank', value: 'Absa Bank', noCopy: true },
              ].map(({ label, value, noCopy }) => (
                <div key={label} className="rounded-xl bg-white/5 border border-white/10 p-4">
                  <p className="text-gray-500 text-xs font-semibold uppercase mb-1">{label}</p>
                  <div className="flex items-center justify-between">
                    <p className="text-white font-black text-xl">{value}</p>
                    {!noCopy && (
                      <button onClick={() => copy(value)} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                        <Copy size={14} className={copied ? 'text-green-500' : 'text-gray-400'} />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="rounded-xl bg-gold/5 border border-gold/20 p-4 space-y-2">
              <p className="text-gold text-xs font-bold uppercase">How to Pay</p>
              <ol className="text-gray-300 text-sm space-y-1 list-decimal list-inside">
                <li>Go to M-Pesa → Lipa na M-Pesa → Paybill</li>
                <li>Business No: <strong>{paybillCode}</strong></li>
                <li>Account: <strong>{accountNumber}</strong></li>
                <li>Amount: <strong>KES {amount.toLocaleString()}</strong></li>
                <li>Enter PIN and confirm</li>
              </ol>
            </div>

            {error && <p className="text-red-400 text-sm">{error}</p>}

            <label className="flex items-center gap-3 p-4 rounded-xl bg-white/5 hover:bg-white/10 cursor-pointer transition-colors">
              <input type="checkbox" checked={hasSent} onChange={e => setHasSent(e.target.checked)} className="w-5 h-5 rounded accent-pink" />
              <span className="text-gray-300 text-sm">I have sent the M-Pesa payment</span>
            </label>

            <button
              onClick={handleConfirm}
              disabled={!hasSent || submitting}
              className="w-full py-4 rounded-full font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed text-white"
              style={{ background: hasSent ? 'linear-gradient(135deg,#E91E8C,#C4186F)' : '#444' }}
            >
              {submitting ? 'Saving…' : 'Confirm Payment'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
