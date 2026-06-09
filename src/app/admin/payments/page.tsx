'use client'

import { useState, useEffect } from 'react'
import { CheckCircle, Clock, DollarSign } from 'lucide-react'

interface Payment {
  id: string
  amount: number
  phone: string
  status: 'pending_confirmation' | 'confirmed' | 'cancelled'
  message?: string
  createdAt: string
}

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPayments()
  }, [])

  const fetchPayments = async () => {
    try {
      const response = await fetch('/api/donations?status=pending_confirmation')
      const data = await response.json()
      setPayments(data)
    } catch (error) {
      console.error('Error fetching payments:', error)
    } finally {
      setLoading(false)
    }
  }

  const confirmPayment = async (id: string) => {
    try {
      const response = await fetch(`/api/donations/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'confirmed' }),
      })
      if (response.ok) {
        setPayments(p => p.filter(x => x.id !== id))
      }
    } catch (error) {
      console.error('Error confirming payment:', error)
    }
  }

  return (
    <div className="min-h-screen bg-base text-white p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-black mb-2">Pending Payments</h1>
        <p className="text-gray-400 mb-8">Manual M-Pesa payments awaiting confirmation</p>

        {loading ? (
          <div className="text-gray-400">Loading...</div>
        ) : payments.length === 0 ? (
          <div className="rounded-2xl bg-surface border border-white/8 p-12 text-center">
            <CheckCircle size={48} className="text-green-500 mx-auto mb-4" />
            <p className="text-gray-300">No pending payments</p>
          </div>
        ) : (
          <div className="space-y-4">
            {payments.map(payment => (
              <div key={payment.id} className="rounded-2xl bg-surface border border-white/8 p-6 hover:border-white/15 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <Clock size={18} className="text-yellow-500" />
                      <p className="text-white font-bold">KES {payment.amount.toLocaleString()}</p>
                      <span className="px-2 py-1 rounded text-xs font-bold bg-yellow-500/10 text-yellow-300">
                        {payment.status}
                      </span>
                    </div>
                    <p className="text-gray-400 text-sm mb-1">Phone: {payment.phone || 'Manual Paybill'}</p>
                    {payment.message && (
                      <p className="text-gray-500 text-xs">{payment.message}</p>
                    )}
                    <p className="text-gray-600 text-xs mt-2">
                      {new Date(payment.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <button
                    onClick={() => confirmPayment(payment.id)}
                    className="ml-4 px-6 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white font-bold transition-colors">
                    Confirm & Process
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Instructions */}
        <div className="mt-12 rounded-2xl bg-gold/5 border border-gold/20 p-8">
          <h2 className="text-gold font-black text-lg mb-4">Manual Payment Processing</h2>
          <ol className="text-gray-300 space-y-3 list-decimal list-inside">
            <li>User sends M-Pesa to Paybill <span className="font-bold">303030</span></li>
            <li>Payment appears in "Pending Payments" list above</li>
            <li>Verify M-Pesa transaction in your Safaricom account</li>
            <li>Click "Confirm & Process" to mark as processed</li>
            <li>Fulfill the order: ship merchandise or deliver digital goods</li>
            <li>Send confirmation message to customer</li>
          </ol>
          <div className="mt-6 p-4 rounded-lg bg-white/5 border border-white/10">
            <p className="text-gray-400 text-sm">
              <strong>Paybill Details:</strong><br />
              Business No: 303030<br />
              Account: 2051724456<br />
              Bank: Absa Bank
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
