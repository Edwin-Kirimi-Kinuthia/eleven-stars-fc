'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'
import {
  LayoutDashboard, Users, BookOpen, Calendar, ShoppingBag,
  Ticket, Heart, UsersRound, LogOut, Menu, X, ChevronRight,
} from 'lucide-react'

const navItems = [
  { label: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
  { label: 'Players', href: '/admin/players', icon: Users },
  { label: 'Blog Posts', href: '/admin/blog', icon: BookOpen },
  { label: 'Fixtures', href: '/admin/fixtures', icon: Calendar },
  { label: 'Team Management', href: '/admin/team', icon: UsersRound },
  { label: 'Orders & Tickets', href: '/admin/orders', icon: ShoppingBag },
  { label: 'Merchandise', href: '/admin/shop', icon: ShoppingBag },
  { label: 'Ticket Batches', href: '/admin/tickets', icon: Ticket },
  { label: 'Donations', href: '/admin/donations', icon: Heart },
]

export default function AdminSidebar() {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-5" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="relative w-9 h-9 rounded-full overflow-hidden flex-shrink-0">
          <Image src="/logo.png" alt="Eleven Stars FC" fill sizes="36px" className="object-cover" />
        </div>
        <div>
          <p className="text-white font-bold text-sm leading-tight">ELEVEN STARS</p>
          <p className="text-[#E91E8C] text-xs font-medium">Admin Panel</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {navItems.map(({ label, href, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(href + '/')
          return (
            <Link
              key={href}
              href={href}
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group"
              style={{
                background: active ? 'rgba(233,30,140,0.12)' : 'transparent',
                color: active ? '#E91E8C' : '#9CA3AF',
              }}
            >
              <Icon size={17} className="flex-shrink-0" />
              <span className="flex-1">{label}</span>
              {active && <ChevronRight size={13} />}
            </Link>
          )
        })}
      </nav>

      {/* Sign out */}
      <div className="px-3 pb-5" style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '16px' }}>
        <button
          onClick={() => signOut({ callbackUrl: '/admin/login' })}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-gray-400 hover:text-red-400 transition-all hover:bg-red-500/10"
        >
          <LogOut size={17} />
          Sign Out
        </button>
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop sidebar */}
      <aside
        className="hidden lg:flex flex-col w-56 h-screen sticky top-0 flex-shrink-0"
        style={{ background: '#0D0D0D', borderRight: '1px solid rgba(255,255,255,0.06)' }}
      >
        <SidebarContent />
      </aside>

      {/* Mobile top bar */}
      <div
        className="lg:hidden flex items-center justify-between px-4 py-3 sticky top-0 z-40"
        style={{ background: '#0D0D0D', borderBottom: '1px solid rgba(255,255,255,0.06)' }}
      >
        <div className="flex items-center gap-2">
          <div className="relative w-7 h-7 rounded-full overflow-hidden">
            <Image src="/logo.png" alt="" fill sizes="28px" className="object-cover" />
          </div>
          <span className="text-white font-bold text-sm">Admin</span>
        </div>
        <button onClick={() => setMobileOpen(true)} className="text-gray-400 hover:text-white transition-colors">
          <Menu size={22} />
        </button>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-50 lg:hidden"
          style={{ background: 'rgba(0,0,0,0.8)' }}
          onClick={() => setMobileOpen(false)}
        >
          <div
            className="absolute left-0 top-0 h-full w-64 flex flex-col"
            style={{ background: '#0D0D0D', borderRight: '1px solid rgba(255,255,255,0.06)' }}
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-end p-4">
              <button onClick={() => setMobileOpen(false)} className="text-gray-400 hover:text-white">
                <X size={20} />
              </button>
            </div>
            <SidebarContent />
          </div>
        </div>
      )}
    </>
  )
}
