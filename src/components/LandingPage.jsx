import SolarLoader from './ui/SolarLoader'

export default function LandingPage({ onStart }) {
  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center relative overflow-hidden">
      {/* Background stars effect */}
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
              opacity: Math.random() * 0.5 + 0.05,
              animation: `twinkle ${Math.random() * 3 + 2}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 3}s`,
            }}
          />
        ))}
      </div>

      {/* Solar Loader - bigger */}
      <div className="mb-10">
        <SolarLoader size={45} speed={0.7} />
      </div>

      {/* Title & Subtitle */}
      <h1 className="text-5xl font-bold text-white tracking-widest mb-3 text-center uppercase">
        METIS AI
      </h1>
      <p className="text-lg text-white/50 mb-2 text-center max-w-md">
        Finde die besten Social-Media-Beiträge und erstelle daraus deine eigenen Artikel.
      </p>
      <p className="text-sm text-white/30 mb-10 text-center">
        LinkedIn &middot; YouTube &middot; Twitter / X
      </p>

      {/* CTA Button - dark blue with glow border like screenshot */}
      <button
        onClick={onStart}
        className="relative px-10 py-3.5 text-white text-sm font-medium rounded-2xl cursor-pointer transform hover:scale-105 transition-all"
        style={{
          background: 'linear-gradient(135deg, #1a2744 0%, #0f1a2e 100%)',
          boxShadow: '0 0 20px rgba(56, 130, 220, 0.15), inset 0 1px 0 rgba(255,255,255,0.05)',
          border: '1px solid rgba(56, 130, 220, 0.3)',
        }}
      >
        <span className="relative z-10">Jetzt starten</span>
      </button>

      {/* Features */}
      <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl px-6">
        <div className="text-center">
          <div className="w-11 h-11 mx-auto mb-3 rounded-xl flex items-center justify-center" style={{ background: 'rgba(56, 130, 220, 0.1)', border: '1px solid rgba(56, 130, 220, 0.15)' }}>
            <svg className="w-5 h-5 text-sky-400/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
          </div>
          <h3 className="text-sm font-semibold text-white/80 mb-1">Top-Beiträge finden</h3>
          <p className="text-xs text-white/30">KI-gestützte Suche nach den erfolgreichsten Posts deiner Branche</p>
        </div>
        <div className="text-center">
          <div className="w-11 h-11 mx-auto mb-3 rounded-xl flex items-center justify-center" style={{ background: 'rgba(56, 130, 220, 0.1)', border: '1px solid rgba(56, 130, 220, 0.15)' }}>
            <svg className="w-5 h-5 text-sky-400/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z" />
            </svg>
          </div>
          <h3 className="text-sm font-semibold text-white/80 mb-1">Analyse & Insights</h3>
          <p className="text-xs text-white/30">Detaillierte Analyse von Hook, Struktur, Tonalität und Erfolgsfaktoren</p>
        </div>
        <div className="text-center">
          <div className="w-11 h-11 mx-auto mb-3 rounded-xl flex items-center justify-center" style={{ background: 'rgba(56, 130, 220, 0.1)', border: '1px solid rgba(56, 130, 220, 0.15)' }}>
            <svg className="w-5 h-5 text-sky-400/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
            </svg>
          </div>
          <h3 className="text-sm font-semibold text-white/80 mb-1">Artikel erstellen</h3>
          <p className="text-xs text-white/30">Generiere und bearbeite eigene Beiträge basierend auf bewährten Mustern</p>
        </div>
      </div>

      {/* Twinkle animation */}
      <style>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0.05; }
          50% { opacity: 0.6; }
        }
      `}</style>
    </div>
  )
}
