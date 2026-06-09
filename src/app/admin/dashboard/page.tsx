'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  Users, BookOpen, Calendar, ShoppingBag, Ticket,
  Heart, TrendingUp, ArrowRight, UsersRound,
} from 'lucide-react'

interface Stats {
  players: number
  posts: number
  fixtures: number
  donations: number
  ticketsSold: number
  products: number
}

const quickActions = [
  { label: 'Add Player', href: '/admin/players/new', icon: Users, desc: 'Register a new squad member' },
  { label: 'Write Blog Post', href: '/admin/blog/new', icon: BookOpen, desc: 'Publish match reports & news' },
  { label: 'Add Fixture', href: '/admin/fixtures', icon: Calendar, desc: 'Schedule a new match' },
  { label: 'Edit Team', href: '/admin/team', icon: UsersRound, desc: 'Update coaches & management' },
]

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats>({ players: 0, posts: 0, fixtures: 0, donations: 0, ticketsSold: 0, products: 0 })

  useEffect(() => {
    Promise.all([
      fetch('/api/players').then(r => r.json()).catch(() => []),
      fetch('/api/blog?all=true').then(r => r.json()).catch(() => []),
      fetch('/api/fixtures').then(r => r.json()).catch(() => []),
      fetch('/api/donations').then(r => r.json()).catch(() => []),
      fetch('/api/tickets').then(r => r.json()).catch(() => []),
      fetch('/api/products').then(r => r.json()).catch(() => []),
    ]).then(([players, posts, fixtures, donations, tickets, products]) => {
      const sold = Array.isArray(tickets) ? tickets.reduce((s: number, t: { sold: number }) => s + (t.sold ?? 0), 0) : 0
      setStats({
        players: Array.isArray(players) ? players.length : 0,
        posts: Array.isArray(posts) ? posts.length : 0,
        fixtures: Array.isArray(fixtures) ? fixtures.length : 0,
        donations: Array.isArray(donations) ? donations.length : 0,
        ticketsSold: sold,
        products: Array.isArray(products) ? products.length : 0,
      })
    })
  }, [])

  const statCards = [
    { label: 'Total Players', value: stats.players, icon: Users, color: '#E91E8C', href: '/admin/players' },
    { label: 'Blog Posts', value: stats.posts, icon: BookOpen, color: '#C9A84C', href: '/admin/blog' },
    { label: 'Fixtures', value: stats.fixtures, icon: Calendar, color: '#E91E8C', href: '/admin/fixtures' },
    { label: 'Donations', value: stats.donations, icon: Heart, color: '#C9A84C', href: '/admin/donations' },
    { label: 'Tickets Sold', value: stats.ticketsSold, icon: Ticket, color: '#E91E8C', href: '/admin/tickets' },
    { label: 'Shop Products', value: stats.products, icon: ShoppingBag, color: '#C9A84C', href: '/admin/shop' },
  ]

  return (
    <div className="p-6 lg:p-8 space-y-8">
      <div>
        <h1 className="text-white text-2xl font-black">Dashboard</h1>
        <p className="text-gray-400 text-sm mt-1">Welcome back — here&apos;s what&apos;s happening at Eleven Stars FC.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {statCards.map(({ label, value, icon: Icon, color, href }) => (
          <Link
            key={label}
            href={href}
            className="group p-5 rounded-2xl transition-all duration-200 hover:scale-[1.02]"
            style={{ background: '#141414', border: '1px solid rgba(255,255,255,0.06)' }}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${color}18` }}>
                <Icon size={18} style={{ color }} />
              </div>
              <ArrowRight size={14} className="text-gray-600 group-hover:text-gray-300 transition-colors mt-1" />
            </div>
            <p className="text-3xl font-black text-white mb-1">{value}</p>
            <p className="text-gray-400 text-xs font-medium uppercase tracking-wider">{label}</p>
          </Link>
        ))}
      </div>

      <div>
        <h2 className="text-white text-lg font-black mb-4 flex items-center gap-2">
          <TrendingUp size={18} style={{ color: '#E91E8C' }} /> Quick Actions
        </h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map(({ label, href, icon: Icon, desc }) => (
            <Link
              key={label}
              href={href}
              className="group p-5 rounded-2xl transition-all hover:scale-[1.02]"
              style={{ background: '#141414', border: '1px solid rgba(255,255,255,0.06)' }}
            >
              <Icon size={20} className="mb-3" style={{ color: '#E91E8C' }} />
              <p className="text-white font-bold text-sm mb-1">{label}</p>
              <p className="text-gray-500 text-xs">{desc}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
