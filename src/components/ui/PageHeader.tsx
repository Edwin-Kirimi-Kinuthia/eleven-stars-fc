interface Props {
  eyebrow?: string
  title: string
  highlight: string
  description?: string
}

export default function PageHeader({ eyebrow, title, highlight, description }: Props) {
  return (
    <section className="relative pt-28 pb-16 overflow-hidden">
      {/* subtle dot grid */}
      <div className="absolute inset-0 bg-dots opacity-30 pointer-events-none" />
      {/* top glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-64 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(ellipse, rgba(233,30,140,0.18) 0%, transparent 70%)', filter: 'blur(60px)' }} />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {eyebrow && (
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-gold/30 bg-gold/8 text-gold text-xs font-bold tracking-widest uppercase mb-6">
            <span className="size-1.5 rounded-full bg-gold" />
            {eyebrow}
          </div>
        )}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight mb-4">
          {title}{' '}
          <span className="gradient-text-pink">{highlight}</span>
        </h1>
        <div className="mx-auto h-1 w-16 rounded-full bg-gradient-to-r from-gold to-gold-light mb-5" />
        {description && (
          <p className="text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed">{description}</p>
        )}
      </div>
    </section>
  )
}
