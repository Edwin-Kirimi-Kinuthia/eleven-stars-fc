import Image from 'next/image'
import Link from 'next/link'
import { MapPin, Mail, Phone } from 'lucide-react'

const nav = [
  { label: 'About Us',    href: '/about' },
  { label: 'Our Squad',   href: '/squad' },
  { label: 'Fixtures',    href: '/fixtures' },
  { label: 'Blog',        href: '/blog' },
  { label: 'Shop',        href: '/shop' },
  { label: 'Tickets',     href: '/tickets' },
]

const support = [
  { label: 'Donate',           href: '/donate' },
  { label: 'Become a Sponsor', href: '/donate#sponsors' },
  { label: 'Volunteer',        href: '/donate#volunteer' },
]

const socials = [
  {
    label: 'TikTok',
    href: 'https://www.tiktok.com/@elevenstarskenya',
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.32 6.32 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.76a4.85 4.85 0 0 1-1.01-.07z" />
      </svg>
    ),
  },
]

export default function Footer() {
  return (
    <footer className="bg-[#050505] border-t border-white/8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">

          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link href="/" className="flex items-center gap-3 mb-5 w-fit group">
              <div className="relative size-11 rounded-full overflow-hidden">
                <Image src="/logo.png" alt="Eleven Stars FC" fill sizes="44px" className="object-cover" />
              </div>
              <div>
                <p className="text-white font-black text-sm tracking-wider leading-tight">ELEVEN STARS</p>
                <p className="text-gold text-[10px] font-semibold tracking-[0.2em] uppercase">F.C · Meru</p>
              </div>
            </Link>
            <p className="text-gray-500 text-sm leading-relaxed mb-6 max-w-xs">
              Meru&apos;s pride. Competing in the Conference League with passion and purpose.
            </p>
            <div className="flex gap-2">
              {socials.map(({ label, href, icon }) => (
                <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label}
                  className="size-9 rounded-full bg-white/5 hover:bg-pink text-gray-400 hover:text-white flex items-center justify-center transition-all duration-200 hover:scale-110">
                  {icon}
                </a>
              ))}
            </div>
          </div>

          {/* Quick links */}
          <div>
            <p className="text-white font-semibold text-xs tracking-widest uppercase mb-5">Quick Links</p>
            <ul className="space-y-3">
              {nav.map(l => (
                <li key={l.href}>
                  <Link href={l.href} className="text-gray-500 hover:text-pink text-sm transition-colors duration-200">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <p className="text-white font-semibold text-xs tracking-widest uppercase mb-5">Support the Club</p>
            <ul className="space-y-3 mb-8">
              {support.map(l => (
                <li key={l.href}>
                  <Link href={l.href} className="text-gray-500 hover:text-pink text-sm transition-colors duration-200">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
            <p className="text-white font-semibold text-xs tracking-widest uppercase mb-3">Our Sponsors</p>
            <div className="space-y-2">
              {['Akash Ltd', 'Moxi Aluminium'].map(s => (
                <p key={s} className="text-gold text-sm font-medium">{s}</p>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <p className="text-white font-semibold text-xs tracking-widest uppercase mb-5">Contact</p>
            <ul className="space-y-4 mb-6">
              <li className="flex items-start gap-3">
                <MapPin size={14} className="text-pink mt-0.5 shrink-0" />
                <span className="text-gray-500 text-sm">Meru Town, Meru County, Kenya</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={14} className="text-pink shrink-0" />
                <a href="mailto:info@elevenstars.co.ke" className="text-gray-500 hover:text-pink text-sm transition-colors">
                  info@elevenstars.co.ke
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={14} className="text-pink shrink-0" />
                <a href="tel:+254700000000" className="text-gray-500 hover:text-pink text-sm transition-colors">
                  +254 700 000 000
                </a>
              </li>
            </ul>
            <div className="rounded-xl bg-gold/8 border border-gold/20 p-4">
              <p className="text-gold text-[10px] font-bold tracking-widest uppercase mb-1">Absa Paybill</p>
              <p className="text-white font-bold text-lg">303030</p>
              <p className="text-gray-500 text-xs mt-0.5">Account: 2051724456</p>
            </div>
          </div>

        </div>

        {/* Bottom */}
        <div className="mt-14 pt-6 border-t border-white/8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-gray-600 text-xs">
            © {new Date().getFullYear()} Eleven Stars F.C. All rights reserved.
          </p>
          <p className="text-gray-600 text-xs">
            Founded by <span className="text-gold font-medium">Wesley Mwenda</span> · Meru, Kenya
          </p>
        </div>

      </div>
    </footer>
  )
}
