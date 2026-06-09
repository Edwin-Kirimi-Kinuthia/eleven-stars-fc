'use client'

import { useState, useEffect } from 'react'
import { X, CheckCircle, Loader } from 'lucide-react'

interface StkPushModalProps {
  isOpen: boolean
  onClose: () => void
  amount: number
  description: string
  onSuccess?: () => void
}

export default function StkPushModal({ isOpen, onClose, amount, description, onSuccess }: StkPushModalProps) {
  const [phone, setPhone] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!isOpen) {
      setPhone('')
      setLoading(false)
      setSuccess(false)
      setError('')
    }
  }, [isOpen])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!phone) {
      setError('Phone number is required')
      return
    }
    
    setLoading(true)
    setError('')
    
    try {
      const res = await fetch('/api/payments/stk-push', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, amount, description }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Payment initiation failed')
      
      setSuccess(true)
      if (onSuccess) onSuccess()
      setTimeout(() => onClose(), 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Payment failed')
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/75" onClick={onClose} />
      <div className="relative bg-surface border border-white/10 rounded-3xl max-w-md w-full p-8 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors">
          <X size={20} />
        </button>

        {success ? (
          <div className="text-center py-6">
            <div className="size-16 rounded-full bg-green-500/15 flex items-center justify-center mx-auto mb-4">
              <CheckCircle size={32} className="text-green-500" />
            </div>
            <h3 className="text-white font-black text-xl mb-2">Payment Initiated</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              An M-Pesa prompt has been sent to your phone. Enter your PIN to complete the payment.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <h3 className="text-white font-black text-lg mb-2">M-Pesa Payment</h3>
              <p className="text-gray-500 text-sm">Enter your M-Pesa phone number to proceed</p>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-400 mb-2">Phone Number</label>
              <input
                type="tel"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder="254712345678"
                disabled={loading}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-pink text-white placeholder-gray-600 focus:outline-none disabled:opacity-50 transition-colors"
              />
            </div>

            <div className="rounded-xl bg-pink/10 border border-pink/20 p-4">
              <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-1">Amount</p>
              <p className="gradient-text-pink font-black text-2xl">KES {amount.toLocaleString()}</p>
            </div>

            {error && (
              <div className="rounded-xl bg-red-500/10 border border-red-500/20 p-3">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !phone}
              className={`w-full py-4 rounded-full font-bold transition-all flex items-center justify-center gap-2 ${
                loading
                  ? 'bg-gray-600 text-gray-300 cursor-not-allowed'
                  : 'bg-pink hover:bg-pink-dark text-white'
              }`}>
              {loading ? (
                <>
                  <Loader size={16} className="animate-spin" />
                  Initiating...
                </>
              ) : (
                'Send STK Push'
              )}
            </button>

            <p className="text-gray-500 text-xs text-center leading-relaxed">
              You will receive an M-Pesa prompt on your phone. Enter your PIN to complete the transaction.
            </p>
          </form>
        )}
      </div>
    </div>
  )
}
