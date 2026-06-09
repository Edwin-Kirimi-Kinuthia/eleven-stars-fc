'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Eye, EyeOff, Mail, Lock, User, Phone, AlertCircle, Loader2 } from 'lucide-react'

export default function RegisterPage() {
  const router = useRouter()
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirm: '' })
  const [showPw, setShowPw] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (form.password !== form.confirm) { setError('Passwords do not match'); return }
    if (form.password.length < 6) { setError('Password must be at least 6 characters'); return }
    setLoading(true)
    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: form.name, email: form.email, phone: form.phone, password: form.password }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error || 'Registration failed'); setLoading(false); return }
      const result = await signIn('credentials', { email: form.email, password: form.password, redirect: false })
      if (result?.error) { router.push('/login'); return }
      router.push('/account')
    } catch {
      setError('Registration failed. Please try again.')
      setLoading(false)
    }
  }

  const inputStyle = { background: '#1A1A1A', border: '1px solid rgba(255,255,255,0.1)' }

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: '#080808' }}>
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <Link href="/">
            <div className="relative w-16 h-16 rounded-full overflow-hidden mb-4">
              <Image src="/logo.png" alt="Eleven Stars FC" fill sizes="64px" className="object-cover" />
            </div>
          </Link>
          <h1 className="text-white font-black text-2xl">Join the Club</h1>
          <p className="text-gray-400 text-sm mt-1">Create your Eleven Stars FC account</p>
        </div>

        <div className="rounded-2xl p-8 space-y-4" style={{ background: '#141414', border: '1px solid rgba(255,255,255,0.06)' }}>
          {error && (
            <div className="flex items-center gap-2 p-3 rounded-xl text-sm" style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#F87171' }}>
              <AlertCircle size={14} className="shrink-0" /> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3">
            {[
              { key: 'name', label: 'Full Name', icon: User, type: 'text', placeholder: 'John Kamau' },
              { key: 'email', label: 'Email', icon: Mail, type: 'email', placeholder: 'you@example.com' },
              { key: 'phone', label: 'Phone (optional)', icon: Phone, type: 'tel', placeholder: '07XXXXXXXX' },
            ].map(({ key, label, icon: Icon, type, placeholder }) => (
              <div key={key}>
                <label className="text-gray-300 text-sm font-medium block mb-1.5">{label}</label>
                <div className="relative">
                  <Icon size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input type={type} value={form[key as keyof typeof form]} onChange={e => set(key, e.target.value)}
                    placeholder={placeholder} required={key !== 'phone'}
                    className="w-full pl-10 pr-4 py-3 rounded-xl text-white text-sm outline-none transition-all"
                    style={inputStyle} />
                </div>
              </div>
            ))}

            <div>
              <label className="text-gray-300 text-sm font-medium block mb-1.5">Password</label>
              <div className="relative">
                <Lock size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                <input type={showPw ? 'text' : 'password'} value={form.password} onChange={e => set('password', e.target.value)}
                  placeholder="Min. 6 characters" required
                  className="w-full pl-10 pr-12 py-3 rounded-xl text-white text-sm outline-none transition-all"
                  style={inputStyle} />
                <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white">
                  {showPw ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>

            <div>
              <label className="text-gray-300 text-sm font-medium block mb-1.5">Confirm Password</label>
              <div className="relative">
                <Lock size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                <input type={showPw ? 'text' : 'password'} value={form.confirm} onChange={e => set('confirm', e.target.value)}
                  placeholder="Repeat password" required
                  className="w-full pl-10 pr-4 py-3 rounded-xl text-white text-sm outline-none transition-all"
                  style={inputStyle} />
              </div>
            </div>

            <button type="submit" disabled={loading}
              className="w-full py-3.5 rounded-xl text-white font-bold text-sm flex items-center justify-center gap-2 hover:scale-[1.02] transition-all disabled:opacity-70 mt-2"
              style={{ background: 'linear-gradient(135deg, #E91E8C, #C4186F)' }}>
              {loading ? <><Loader2 size={15} className="animate-spin" /> Creating account…</> : 'Create Account'}
            </button>
          </form>

          <p className="text-gray-500 text-sm text-center">
            Already have an account?{' '}
            <Link href="/login" className="font-semibold hover:text-white transition-colors" style={{ color: '#E91E8C' }}>
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
