'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { Menu, X, User, LogIn } from 'lucide-react'

const links = [
  { label: 'Home',     href: '/' },
  { label: 'About',    href: '/about' },
  { label: 'Squad',    href: '/squad' },
  { label: 'Fixtures', href: '/fixtures' },
  { label: 'Blog',     href: '/blog' },
  { label: 'Shop',     href: '/shop' },
  { label: 'Tickets',  href: '/tickets' },
  { label: 'Donate',   href: '/donate' },
]

export default function Navbar() {
  const pathname = usePathname()
  const { data: session } = useSession()
  const [open, setOpen]       = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => { setOpen(false) }, [pathname])

  return (
    <>
      {/* Mobile: navbar stays in normal document flow (not `fixed`). A
          position:fixed element forces Android Chrome to composite the
          ENTIRE long page into one oversized GPU surface, which low-end
          GPUs corrupt (stale-tile static + ghost trails of scrolled-past
          content). In-flow scrolling uses normal tiles → no overflow, no
          corruption. Fixed header is restored at `lg+`. */}
      <header
        className={`relative lg:fixed inset-x-0 top-0 z-50 transition-colors duration-300 bg-[#080808] ${
          scrolled ? 'lg:border-b lg:border-white/8 lg:shadow-lg lg:shadow-black/40' : ''
        }`}
      >
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 shrink-0 group">
            <div className="relative size-9 rounded-full overflow-hidden ring-2 ring-transparent group-hover:ring-pink transition-all duration-300">
              <Image src="/logo.png" alt="Eleven Stars FC" fill sizes="36px" className="object-cover" priority />
            </div>
            <div className="hidden sm:block leading-tight">
              <p className="text-white font-black text-sm tracking-wider">ELEVEN STARS</p>
              <p className="text-gold text-[10px] font-semibold tracking-[0.2em] uppercase">F.C · Meru</p>
            </div>
          </Link>

          {/* Desktop nav */}
          <div className="hidden lg:flex items-center gap-1">
            {links.map(link => {
              const active = pathname === link.href
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
                    active
                      ? 'text-pink'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {link.label}
                  {active && (
                    <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 h-0.5 w-4 rounded-full bg-pink" />
                  )}
                </Link>
              )
            })}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2">
            {session?.user ? (
              <Link href="/account" className="hidden sm:flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold text-gray-300 hover:text-white transition-colors" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}>
                <User size={14} /> {session.user.name?.split(' ')[0]}
              </Link>
            ) : (
              <>
                <Link href="/login" className="hidden sm:flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold text-gray-300 hover:text-white transition-colors" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}>
                  <LogIn size={14} /> Sign In
                </Link>
                <Link href="/register" className="hidden sm:flex items-center px-4 py-2 rounded-full text-sm font-bold text-white transition-all hover:scale-105" style={{ background: 'linear-gradient(135deg, #E91E8C, #C4186F)' }}>
                  Register
                </Link>
              </>
            )}
            <Link
              href="/donate"
              className="btn-shimmer hidden lg:inline-flex items-center px-5 py-2 rounded-full bg-pink hover:bg-pink-dark text-white text-sm font-bold transition-colors duration-200"
            >
              Donate
            </Link>
            <button
              onClick={() => setOpen(v => !v)}
              className="lg:hidden p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
              aria-label="Toggle menu"
            >
              {open ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-40 lg:hidden" onClick={() => setOpen(false)}>
          <div className="absolute inset-0 bg-black/70" />
          <div
            className="absolute top-16 inset-x-0 bg-surface border-b border-white/10 px-4 py-4 space-y-1"
            onClick={e => e.stopPropagation()}
          >
            {links.map(link => {
              const active = pathname === link.href
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                    active ? 'bg-pink/10 text-pink' : 'text-gray-300 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  {link.label}
                </Link>
              )
            })}
            <div className="pt-2 border-t border-white/10 space-y-2">
              {session?.user ? (
                <Link href="/account" className="flex items-center gap-2 w-full px-4 py-3 rounded-xl text-sm font-medium text-gray-300 hover:bg-white/5 hover:text-white transition-colors">
                  <User size={15} /> My Account
                </Link>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <Link href="/login" className="flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold text-gray-300 hover:text-white transition-colors" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}>
                    <LogIn size={14} /> Sign In
                  </Link>
                  <Link href="/register" className="flex items-center justify-center py-3 rounded-xl text-sm font-bold text-white transition-all" style={{ background: 'linear-gradient(135deg, #E91E8C, #C4186F)' }}>
                    Register
                  </Link>
                </div>
              )}
              <Link
                href="/donate"
                className="flex items-center justify-center w-full py-3 rounded-xl bg-pink hover:bg-pink-dark text-white text-sm font-bold transition-colors"
              >
                Donate Now
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
