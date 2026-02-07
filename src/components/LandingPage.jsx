import SolarLoader from './ui/SolarLoader'

export default function LandingPage({ onStart }) {
  return (
    <div className="min-h-screen bg-[#0a0a0a] relative overflow-hidden flex flex-col">
      {/* Background stars */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 80 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white"
            style={{
              width: `${Math.random() * 2 + 0.5}px`,
              height: `${Math.random() * 2 + 0.5}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              opacity: Math.random() * 0.4 + 0.05,
              animation: `twinkle ${Math.random() * 4 + 2}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 4}s`,
            }}
          />
        ))}
      </div>

      {/* Top Nav */}
      <nav className="relative z-10 flex items-center justify-between px-8 md:px-12 py-6">
        <span className="text-xl font-bold text-white tracking-tight">
          METIS AI
        </span>
        <button
          onClick={onStart}
          className="text-sm text-white/50 hover:text-white border border-white/15 hover:border-white/30 px-4 py-2 rounded-xl transition-all cursor-pointer"
        >
          Dashboard
        </button>
      </nav>

      {/* Hero Section */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 -mt-8">
        {/* Solar System */}
        <div className="mb-6">
          <SolarLoader size={50} speed={0.7} />
        </div>

        {/* Headline */}
        <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-4 text-center leading-tight">
          Dein KI-Content-Assistent
        </h1>

        {/* Subtitle */}
        <p className="text-base md:text-lg text-white/40 mb-8 text-center max-w-lg leading-relaxed">
          Finde Top-Beiträge, analysiere Erfolgsmuster und erstelle deine eigenen Artikel.
        </p>

        {/* CTA Button */}
        <button
          onClick={onStart}
          className="group relative px-8 py-3 rounded-xl cursor-pointer transition-all duration-300 hover:scale-[1.03] active:scale-[0.98]"
          style={{
            background: 'linear-gradient(135deg, #ffffff 0%, #e8e4dd 100%)',
            boxShadow: '0 0 30px rgba(255,255,255,0.08), 0 1px 3px rgba(0,0,0,0.3)',
          }}
        >
          <span className="text-sm font-semibold text-[#0a0a0a] tracking-wide">
            Jetzt starten
          </span>
        </button>

        {/* Platform pills */}
        <div className="flex items-center gap-3 mt-6">
          {['LinkedIn', 'YouTube', 'Twitter / X'].map((p) => (
            <span key={p} className="text-xs text-white/25 px-3 py-1 rounded-full border border-white/8">
              {p}
            </span>
          ))}
        </div>
      </div>

      {/* Features Section */}
      <div className="relative z-10 pb-16 pt-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto px-8">
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
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  )
}

function FeatureCard({ icon, title, desc }) {
  return (
    <div className="text-center p-5 rounded-2xl border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04] transition-colors">
      <div className="w-10 h-10 mx-auto mb-3 rounded-xl flex items-center justify-center bg-white/[0.05] border border-white/[0.08]">
        <svg className="w-5 h-5 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          {icon}
        </svg>
      </div>
      <h3 className="text-sm font-medium text-white/70 mb-1">{title}</h3>
      <p className="text-xs text-white/30 leading-relaxed">{desc}</p>
    </div>
  )
}
