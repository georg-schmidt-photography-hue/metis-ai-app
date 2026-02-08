import SolarLoader from './ui/SolarLoader'

const BRAND = '#D4952B'

export default function LandingPage({ onStart }) {
  return (
    <div className="h-screen bg-[#0a0a0a] relative overflow-hidden flex flex-col">
      {/* Top Nav */}
      <nav className="relative z-10 flex items-center justify-between px-8 md:px-16 py-6">
        <div className="flex items-center gap-1.5">
          <span className="text-lg font-semibold tracking-widest" style={{ color: BRAND }}>
            METIS AI
          </span>
          <span
            className="inline-block w-2 h-2 rounded-full"
            style={{ backgroundColor: BRAND }}
          />
        </div>

        <button
          onClick={onStart}
          className="text-sm px-5 py-2 rounded-full cursor-pointer transition-all duration-200 font-medium"
          style={{
            color: '#fff',
            backgroundColor: 'rgba(255,255,255,0.08)',
            border: '1px solid rgba(255,255,255,0.15)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.14)'
            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.08)'
            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'
          }}
        >
          Dashboard
        </button>
      </nav>

      {/* Hero */}
      <div className="flex-1 relative flex flex-col items-center justify-center px-6">
        {/* SolarLoader as abstract background element */}
        <div className="absolute opacity-40 pointer-events-none" style={{ top: '8%', right: '10%' }}>
          <SolarLoader size={18} speed={0.5} />
        </div>

        {/* Headline */}
        <h1 className="relative z-10 text-center leading-[1.1] mb-6">
          <span className="block text-5xl md:text-7xl font-bold text-white tracking-tight">
            Finden.
          </span>
          <span className="block text-5xl md:text-7xl font-bold text-white tracking-tight">
            Analysieren.
          </span>
          <span className="block text-5xl md:text-7xl font-bold tracking-tight" style={{ color: BRAND }}>
            Erstellen.
          </span>
        </h1>

        {/* Subtitle */}
        <p className="relative z-10 text-base md:text-lg text-white/40 mb-10 text-center max-w-lg leading-relaxed">
          KI-gestützte Suche nach Top-Beiträgen, Analyse von Erfolgsmustern
          und Erstellung eigener Artikel.
        </p>

        {/* CTA Button */}
        <button
          onClick={onStart}
          className="relative z-10 group flex items-center gap-2 px-7 py-3 rounded-full cursor-pointer transition-all duration-300 hover:scale-[1.03] active:scale-[0.97] text-sm font-semibold tracking-wide"
          style={{
            color: '#0a0a0a',
            backgroundColor: '#fff',
            boxShadow: '0 0 40px rgba(255,255,255,0.06)',
          }}
        >
          Jetzt starten
          <svg className="w-4 h-4 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
          </svg>
        </button>

        {/* Platform pills */}
        <div className="relative z-10 flex items-center gap-3 mt-8">
          {['LinkedIn', 'YouTube', 'Twitter / X'].map((p) => (
            <span
              key={p}
              className="text-xs px-3.5 py-1.5 rounded-full text-white/25 border border-white/[0.08]"
            >
              {p}
            </span>
          ))}
        </div>
      </div>

      {/* Subtle bottom gradient */}
      <div
        className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none"
        style={{
          background: `linear-gradient(to top, ${BRAND}08, transparent)`,
        }}
      />
    </div>
  )
}
