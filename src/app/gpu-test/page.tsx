/* GPU diagnostic page — intentionally NOT under the (public) layout, so there
   is NO navbar, NO footer, NO shared shell. Pure isolation.

   Each ZONE adds exactly ONE suspect on top of the plain baseline. Scroll the
   whole page on the affected phone and note the FIRST zone that shows the
   static/ghosting glitch. That single answer tells us the cause:

     • ZONE A (plain solid blocks) glitches  → it's the device/browser GPU
       itself, not our code. No redesign can fix that from the web side.
     • First glitch at B/C/D/E → that specific technique is the trigger, and
       we remove only that, everywhere.
     • Nothing glitches here at all → the cause is something unique to the
       real pages (an image, a font, a specific component) and we bisect those.

   No client JS, no gradients-by-default, no images. */

export const dynamic = 'force-static'

function Block({ color, label }: { color: string; label: string }) {
  return (
    <div
      style={{ background: color, minHeight: '90vh' }}
      className="flex items-center justify-center"
    >
      <span style={{ color: '#fff', fontSize: 28, fontWeight: 800 }}>{label}</span>
    </div>
  )
}

export default function GpuTestPage() {
  return (
    <div style={{ background: '#000' }}>
      {/* ZONE A — plain opaque solid colours (the baseline). If THIS glitches,
          it's the device GPU, full stop. */}
      <Block color="#101010" label="ZONE A · plain #101010" />
      <Block color="#b91c5c" label="ZONE A · plain solid pink" />
      <Block color="#1d4ed8" label="ZONE A · plain solid blue" />
      <Block color="#15803d" label="ZONE A · plain solid green" />

      {/* ZONE B — one big CSS gradient fill */}
      <div
        style={{ minHeight: '90vh', background: 'linear-gradient(135deg,#E91E8C,#0A0A0A 70%)' }}
        className="flex items-center justify-center"
      >
        <span style={{ color: '#fff', fontSize: 28, fontWeight: 800 }}>ZONE B · CSS gradient</span>
      </div>

      {/* ZONE C — many overlapping semi-transparent layers (translucent compositing) */}
      <div style={{ position: 'relative', minHeight: '90vh', background: '#0d0d0d' }}>
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              inset: `${i * 6}%`,
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 24,
            }}
          />
        ))}
        <div className="flex items-center justify-center" style={{ minHeight: '90vh', position: 'relative' }}>
          <span style={{ color: '#fff', fontSize: 28, fontWeight: 800 }}>ZONE C · stacked translucent layers</span>
        </div>
      </div>

      {/* ZONE D — rounded + overflow:hidden clip with content (clip-layer promotion) */}
      <div style={{ minHeight: '90vh', background: '#0d0d0d' }} className="flex items-center justify-center">
        <div
          style={{
            width: '90%',
            height: '70vh',
            borderRadius: 24,
            overflow: 'hidden',
            background: '#1a1a1a',
            border: '1px solid rgba(255,255,255,0.1)',
          }}
          className="flex items-center justify-center"
        >
          <span style={{ color: '#fff', fontSize: 28, fontWeight: 800 }}>ZONE D · rounded overflow-hidden clip</span>
        </div>
      </div>

      {/* ZONE E — a position:fixed element present while you scroll this zone */}
      <div style={{ minHeight: '120vh', background: '#0d0d0d', position: 'relative' }} className="flex items-center justify-center">
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            height: 56,
            background: '#E91E8C',
            zIndex: 50,
          }}
          className="flex items-center justify-center"
        >
          <span style={{ color: '#fff', fontWeight: 800 }}>ZONE E · fixed bar (scroll under me)</span>
        </div>
        <span style={{ color: '#fff', fontSize: 28, fontWeight: 800 }}>ZONE E · content under a fixed element</span>
      </div>

      <Block color="#101010" label="END — scroll complete" />
    </div>
  )
}
