import SolarLoader from './ui/SolarLoader'

const BRAND = '#D4952B'

export default function LandingPage({ onStart }) {
  return (
    <div className="h-screen bg-[#0a0a0a] relative overflow-hidden flex flex-col">
      {/* Background stars */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 60 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white"
            style={{
              width: `${Math.random() * 2 + 0.5}px`,
              height: `${Math.random() * 2 + 0.5}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              opacity: Math.random() * 0.3 + 0.05,
              animation: `twinkle ${Math.random() * 4 + 2}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 4}s`,
            }}
          />
        ))}
      </div>

      {/* Top Nav */}
      <nav className="relative z-10 flex items-center justify-between px-8 md:px-12 py-5">
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
          className="text-sm px-4 py-1.5 rounded-lg transition-all cursor-pointer"
          style={{
            color: BRAND,
            border: `1px solid ${BRAND}33`,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = `${BRAND}66`
            e.currentTarget.style.backgroundColor = `${BRAND}0D`
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = `${BRAND}33`
            e.currentTarget.style.backgroundColor = 'transparent'
          }}
        >
          Dashboard
        </button>
      </nav>

      {/* Hero Section */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 min-h-0 pb-4">
        {/* Solar System - reduced */}
        <div className="mb-4">
          <SolarLoader size={22} speed={0.7} />
        </div>

        {/* Headline */}
        <h1 className="text-2xl md:text-3xl font-semibold text-white/90 tracking-tight mb-3 text-center">
          Dein KI-Content-Assistent
        </h1>

        {/* Subtitle */}
        <p className="text-sm md:text-base text-white/35 mb-6 text-center max-w-md leading-relaxed">
          Finde Top-Beiträge, analysiere Erfolgsmuster und erstelle deine eigenen Artikel.
        </p>

        {/* CTA Button */}
        <button
          onClick={onStart}
          className="px-7 py-2.5 rounded-lg cursor-pointer transition-all duration-300 hover:scale-[1.03] active:scale-[0.97] text-sm font-semibold text-[#0a0a0a] tracking-wide"
          style={{
            backgroundColor: BRAND,
            boxShadow: `0 0 24px ${BRAND}22, 0 1px 3px rgba(0,0,0,0.4)`,
          }}
        >
          Jetzt starten
        </button>

        {/* Platform pills */}
        <div className="flex items-center gap-2.5 mt-5">
          {['LinkedIn', 'YouTube', 'Twitter / X'].map((p) => (
            <span
              key={p}
              className="text-xs px-3 py-1 rounded-full"
              style={{ color: `${BRAND}66`, border: `1px solid ${BRAND}15` }}
            >
              {p}
            </span>
          ))}
        </div>
      </div>

      {/* Features Section */}
      <div className="relative z-10 shrink-0 pb-10 pt-2">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto px-8">
          <FeatureCard
            icon={
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            }
            title="Top-Beiträge finden"
            desc="KI-gestützte Suche nach den erfolgreichsten Posts deiner Branche"
          />
          <FeatureCard
            icon={
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z" />
            }
            title="Analyse & Insights"
            desc="Hook, Struktur, Tonalität und Erfolgsfaktoren auf einen Blick"
          />
          <FeatureCard
            icon={
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
            }
            title="Artikel erstellen"
            desc="Generiere eigene Beiträge basierend auf bewährten Mustern"
          />
        </div>
      </div>

      {/* Twinkle animation */}
      <style>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0.05; }
          50% { opacity: 0.4; }
        }
      `}</style>
    </div>
  )
}

function FeatureCard({ icon, title, desc }) {
  return (
    <div
      className="text-center p-4 rounded-xl transition-colors"
      style={{
        border: `1px solid ${BRAND}10`,
        backgroundColor: `${BRAND}05`,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = `${BRAND}0A`
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = `${BRAND}05`
      }}
    >
      <div
        className="w-9 h-9 mx-auto mb-2.5 rounded-lg flex items-center justify-center"
        style={{
          backgroundColor: `${BRAND}12`,
          border: `1px solid ${BRAND}20`,
        }}
      >
        <svg className="w-4 h-4" fill="none" stroke={BRAND} strokeOpacity={0.6} viewBox="0 0 24 24">
          {icon}
        </svg>
      </div>
      <h3 className="text-sm font-medium text-white/65 mb-1">{title}</h3>
      <p className="text-xs text-white/30 leading-relaxed">{desc}</p>
    </div>
  )
}
