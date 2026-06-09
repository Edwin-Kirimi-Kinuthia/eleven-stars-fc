'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Eye, EyeOff, Mail, Lock, AlertCircle, Loader2 } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    const result = await signIn('credentials', { email, password, redirect: false })
    setLoading(false)
    if (result?.error) {
      setError('Invalid email or password.')
    } else {
      router.push('/account')
    }
  }

  const inputStyle = { background: '#1A1A1A', border: '1px solid rgba(255,255,255,0.1)' }
  const focusStyle = 'outline-none transition-all'

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: '#080808' }}>
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <Link href="/">
            <div className="relative w-16 h-16 rounded-full overflow-hidden mb-4">
              <Image src="/logo.png" alt="Eleven Stars FC" fill sizes="64px" className="object-cover" />
            </div>
          </Link>
          <h1 className="text-white font-black text-2xl">Welcome Back</h1>
          <p className="text-gray-400 text-sm mt-1">Sign in to your Eleven Stars account</p>
        </div>

        <div className="rounded-2xl p-8 space-y-5" style={{ background: '#141414', border: '1px solid rgba(255,255,255,0.06)' }}>
          {error && (
            <div className="flex items-center gap-2 p-3 rounded-xl text-sm" style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#F87171' }}>
              <AlertCircle size={14} className="shrink-0" /> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-gray-300 text-sm font-medium block mb-2">Email</label>
              <div className="relative">
                <Mail size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
                  placeholder="you@example.com"
                  className={`w-full pl-10 pr-4 py-3 rounded-xl text-white text-sm ${focusStyle}`}
                  style={inputStyle} />
              </div>
            </div>
            <div>
              <label className="text-gray-300 text-sm font-medium block mb-2">Password</label>
              <div className="relative">
                <Lock size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                <input type={showPw ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} required
                  placeholder="••••••••"
                  className={`w-full pl-10 pr-12 py-3 rounded-xl text-white text-sm ${focusStyle}`}
                  style={inputStyle} />
                <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white">
                  {showPw ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>
            <button type="submit" disabled={loading}
              className="w-full py-3.5 rounded-xl text-white font-bold text-sm flex items-center justify-center gap-2 hover:scale-[1.02] transition-all disabled:opacity-70"
              style={{ background: 'linear-gradient(135deg, #E91E8C, #C4186F)' }}>
              {loading ? <><Loader2 size={15} className="animate-spin" /> Signing in…</> : 'Sign In'}
            </button>
          </form>

          <p className="text-gray-500 text-sm text-center">
            Don&apos;t have an account?{' '}
            <Link href="/register" className="font-semibold hover:text-white transition-colors" style={{ color: '#E91E8C' }}>
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
