'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Eye, EyeOff, Lock, Mail, AlertCircle, Loader2 } from 'lucide-react'

export default function AdminLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
    })

    setLoading(false)

    if (result?.error) {
      setError('Invalid email or password. Please try again.')
    } else {
      router.push('/admin/dashboard')
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{
        background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(233,30,140,0.12) 0%, transparent 60%), #080808',
      }}
    >
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex flex-col items-center mb-10">
          <div className="relative w-20 h-20 rounded-full overflow-hidden mb-4 ring-2 ring-pink-500/30">
            <Image src="/logo.png" alt="Eleven Stars FC" fill sizes="80px" className="object-cover" />
          </div>
          <h1 className="text-white font-black text-2xl tracking-tight">ELEVEN STARS F.C</h1>
          <p className="text-gray-400 text-sm mt-1">Admin Portal</p>
        </div>

        {/* Card */}
        <div className="rounded-2xl p-8" style={{ background: '#141414', border: '1px solid rgba(255,255,255,0.06)' }}>
          <h2 className="text-white font-bold text-xl mb-6">Sign in to continue</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label className="text-gray-300 text-sm font-medium block mb-2">Email Address</label>
              <div className="relative">
                <Mail size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="admin@elevenstarsfc.co.ke"
                  required
                  className="w-full pl-10 pr-4 py-3 rounded-xl text-white text-sm outline-none transition-all"
                  style={{ background: '#1E1E1E', border: '1px solid rgba(255,255,255,0.08)' }}
                  onFocus={e => (e.target.style.borderColor = '#E91E8C')}
                  onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.08)')}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="text-gray-300 text-sm font-medium block mb-2">Password</label>
              <div className="relative">
                <Lock size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pl-10 pr-12 py-3 rounded-xl text-white text-sm outline-none transition-all"
                  style={{ background: '#1E1E1E', border: '1px solid rgba(255,255,255,0.08)' }}
                  onFocus={e => (e.target.style.borderColor = '#E91E8C')}
                  onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.08)')}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div
                className="flex items-center gap-2 p-3 rounded-xl text-sm"
                style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#F87171' }}
              >
                <AlertCircle size={14} className="flex-shrink-0" />
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl text-white font-bold text-sm transition-all hover:scale-[1.02] pink-glow mt-2 flex items-center justify-center gap-2"
              style={{ background: 'linear-gradient(135deg, #E91E8C, #C4186F)', opacity: loading ? 0.8 : 1 }}
            >
              {loading ? <><Loader2 size={16} className="animate-spin" /> Signing in…</> : 'Sign In'}
            </button>
          </form>

          <div className="mt-6 pt-5" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
            <p className="text-gray-500 text-xs text-center">
              This portal is restricted to club administration only.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
