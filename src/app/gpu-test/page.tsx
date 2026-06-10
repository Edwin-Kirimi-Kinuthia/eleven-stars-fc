/* GPU diagnostic page — standalone (no navbar/footer/shared shell).

   This version replicates the ACTUAL home stats card that glitches, then
   strips ONE property per variant. Scroll the whole page on the affected
   phone and tell me the FIRST variant that is CLEAN — that names the exact
   offending property.

   The deployed commit SHA is printed at the very top: tell me what it says so
   we can confirm you're testing the newest build and not a cached one. */

import { Trophy, Star, Heart, MapPin } from 'lucide-react'

export const dynamic = 'force-dynamic'

const BUILD =
  process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 7) ??
  process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA?.slice(0, 7) ??
  'local-dev'

const items = [
  { value: '11', label: 'Squad Players', sub: 'First XI', icon: Trophy, color: 'pink' as const },
  { value: '2026', label: 'Conference League', sub: 'Current Season', icon: Star, color: 'gold' as const },
  { value: '2', label: 'Official Sponsors', sub: 'Akash · Moxi', icon: Heart, color: 'pink' as const },
  { value: 'Meru', label: 'Home City', sub: 'Meru County, KE', icon: MapPin, color: 'gold' as const },
]

function Label({ n, text }: { n: string; text: string }) {
  return (
    <div style={{ background: '#000', padding: '40px 16px 12px' }}>
      <p style={{ color: '#FF4DAE', fontWeight: 900, fontSize: 13, letterSpacing: 2 }}>VARIANT {n}</p>
      <p style={{ color: '#fff', fontSize: 18, fontWeight: 700 }}>{text}</p>
    </div>
  )
}

/* opts let each variant drop one property */
function StatsGrid({
  icons = true,
  translucent = true,
  border = true,
  accent = true,
}: {
  icons?: boolean
  translucent?: boolean
  border?: boolean
  accent?: boolean
}) {
  return (
    <section style={{ background: '#080808', padding: '8px 16px 32px' }}>
      <div className="grid grid-cols-2 gap-4">
        {items.map(({ value, label, sub, icon: Icon, color }) => (
          <div
            key={label}
            className="rounded-2xl overflow-hidden"
            style={{
              background: '#111',
              border: border ? '1px solid rgba(255,255,255,0.08)' : 'none',
            }}
          >
            {accent && (
              <div
                style={{
                  height: 4,
                  width: '100%',
                  opacity: 0.6,
                  background:
                    color === 'pink'
                      ? 'linear-gradient(to right, transparent, #E91E8C, transparent)'
                      : 'linear-gradient(to right, transparent, #C9A84C, transparent)',
                }}
              />
            )}
            <div style={{ padding: 24, textAlign: 'center' }}>
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 12,
                  margin: '0 auto 20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background:
                    color === 'pink'
                      ? translucent
                        ? 'rgba(233,30,140,0.1)'
                        : '#3a1027'
                      : translucent
                        ? 'rgba(201,168,76,0.1)'
                        : '#2e2817',
                  color: color === 'pink' ? '#E91E8C' : '#C9A84C',
                }}
              >
                {icons && <Icon size={22} />}
              </div>
              <p style={{ fontSize: 30, fontWeight: 900, color: '#fff', marginBottom: 4 }}>{value}</p>
              <p style={{ fontSize: 14, fontWeight: 600, color: '#fff' }}>{label}</p>
              <p style={{ fontSize: 12, color: '#666' }}>{sub}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default function GpuTestPage() {
  return (
    <div style={{ background: '#000', minHeight: '100vh' }}>
      {/* BUILD STAMP — confirm this matches the latest pushed commit */}
      <div style={{ background: '#FF4DAE', color: '#000', padding: 16, fontWeight: 900, fontSize: 16, textAlign: 'center' }}>
        BUILD: {BUILD} — tell me this code
      </div>
      <div style={{ background: '#000', color: '#bbb', padding: '16px', fontSize: 14, lineHeight: 1.5 }}>
        Scroll down. Each variant is the home stats grid with ONE thing removed.
        Tell me the FIRST variant that is CLEAN (no static/ghosting).
      </div>

      <Label n="1" text="EXACT replica of the home stats cards (should glitch)" />
      <StatsGrid />

      <Label n="2" text="…with NO icons (SVG removed)" />
      <StatsGrid icons={false} />

      <Label n="3" text="…with SOLID icon backgrounds (no translucency)" />
      <StatsGrid translucent={false} />

      <Label n="4" text="…with NO card border" />
      <StatsGrid border={false} />

      <Label n="5" text="…with NO top accent line + no border + solid + no icons (barest)" />
      <StatsGrid icons={false} translucent={false} border={false} accent={false} />

      <div style={{ height: '40vh', background: '#000', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800 }}>
        END
      </div>
    </div>
  )
}
