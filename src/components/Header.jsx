import { useState } from 'react'

const platforms = [
  { value: 'linkedin', label: 'LinkedIn', icon: (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
    </svg>
  )},
  { value: 'youtube', label: 'YouTube', icon: (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
      <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
    </svg>
  )},
  { value: 'twitter', label: 'Twitter / X', icon: (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
    </svg>
  )},
]

export default function Header({ onSearch, isLoading, platform, onPlatformChange, onBackToLanding, searchMode, onSearchModeChange, accountFilter, onAccountFilterChange, appMode, onAppModeChange, onCreatorAnalysis, isAnalyzing, translateDE, onTranslateChange }) {
  const [searchTerm, setSearchTerm] = useState('')
  const [creatorInput, setCreatorInput] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (searchTerm.trim() && !isLoading) {
      onSearch(searchTerm.trim())
    }
  }

  const handleCreatorSubmit = (e) => {
    e.preventDefault()
    if (creatorInput.trim() && !isAnalyzing) {
      onCreatorAnalysis(creatorInput.trim())
    }
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50" style={{background:'rgba(10,10,10,0.85)', borderBottom:'1px solid rgba(255,255,255,0.07)', backdropFilter:'blur(20px)', WebkitBackdropFilter:'blur(20px)'}}>
      <div className="max-w-7xl mx-auto px-6">
        {/* Top row: Logo + App Mode Tabs */}
        <div className="h-14 flex items-center gap-3 min-w-0">
          <div className="flex-shrink-0 flex items-center gap-2">
            {onBackToLanding && (
              <button
                onClick={onBackToLanding}
                className="w-7 h-7 flex items-center justify-center rounded-lg transition-all cursor-pointer"
                style={{color:'rgba(255,255,255,0.4)'}}
                title="Zur Startseite"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
            )}
            <span className="text-xl font-bold tracking-widest flex-shrink-0" style={{color:'#D4952B', letterSpacing:'0.15em'}}>
              METIS AI
            </span>
          </div>

          {/* Main Mode Tabs — scrollable on mobile */}
          <div className="flex-1 min-w-0 overflow-x-auto scrollbar-none">
            <div className="flex items-center gap-1 p-1 w-max" style={{background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:999}}>
              {[
                { value: 'inspiration', label: 'Inspiration' },
                { value: 'creator-report', label: 'Creator-Analyse' },
                { value: 'saved-creators', label: 'Meine Creators' },
                { value: 'trends', label: 'Trends' },
                { value: 'style', label: 'Mein Stil' },
                { value: 'posts', label: 'Meine Posts' },
                { value: 'calendar', label: 'Kalender' },
              ].map((tab) => (
                <button
                  key={tab.value}
                  type="button"
                  onClick={() => onAppModeChange(tab.value)}
                  style={{padding:'6px 14px', borderRadius:999, fontSize:12, fontWeight:600, cursor:'pointer', whiteSpace:'nowrap', transition:'all 0.2s', border: appMode === tab.value ? '1px solid rgba(212,149,43,0.3)' : '1px solid transparent', background: appMode === tab.value ? 'rgba(212,149,43,0.15)' : 'transparent', color: appMode === tab.value ? '#D4952B' : 'rgba(255,255,255,0.45)'}}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Platform tabs — only in inspiration mode, hidden on mobile */}
          {appMode === 'inspiration' && (
            <div className="hidden md:flex items-center gap-1 flex-shrink-0">
              {platforms.map((p) => (
                <button
                  key={p.value}
                  onClick={() => onPlatformChange(p.value)}
                  className="flex items-center gap-1.5 cursor-pointer transition-all"
                  style={{padding:'6px 14px', borderRadius:999, fontSize:11, fontWeight:600, border: platform === p.value ? '1px solid rgba(212,149,43,0.4)' : '1px solid rgba(255,255,255,0.12)', background: platform === p.value ? 'rgba(212,149,43,0.15)' : 'rgba(255,255,255,0.06)', color: platform === p.value ? '#D4952B' : 'rgba(255,255,255,0.5)'}}
                >
                  {p.icon}
                  {p.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Bottom row */}
        {appMode === 'saved-creators' || appMode === 'trends' ? null : appMode === 'inspiration' ? (
          /* Inspiration: Search mode toggle + Search bar */
          <div className="pb-3 flex flex-col gap-2">
          {/* Platform tabs on mobile (shown here, hidden in top row) */}
          <div className="flex md:hidden items-center gap-1 overflow-x-auto scrollbar-none">
            {platforms.map((p) => (
              <button
                key={p.value}
                onClick={() => onPlatformChange(p.value)}
                className="flex items-center gap-1.5 cursor-pointer transition-all whitespace-nowrap flex-shrink-0"
                style={{padding:'6px 14px', borderRadius:999, fontSize:11, fontWeight:600, border: platform === p.value ? '1px solid rgba(212,149,43,0.4)' : '1px solid rgba(255,255,255,0.12)', background: platform === p.value ? 'rgba(212,149,43,0.15)' : 'rgba(255,255,255,0.06)', color: platform === p.value ? '#D4952B' : 'rgba(255,255,255,0.5)'}}
              >
                {p.icon}
                {p.label}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-3 max-w-2xl">
            <div className="flex overflow-hidden flex-shrink-0" style={{border:'1px solid rgba(255,255,255,0.12)', borderRadius:999, background:'rgba(255,255,255,0.05)'}}>
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => onSearchModeChange('topic')}
                style={{padding:'8px 16px', fontSize:11, fontWeight:600, cursor:'pointer', transition:'all 0.2s', borderRadius:999, border:'none', background: searchMode === 'topic' ? '#D4952B' : 'transparent', color: searchMode === 'topic' ? '#0a0a0a' : 'rgba(255,255,255,0.45)'}}
              >
                Thema
              </button>
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => onSearchModeChange('account')}
                style={{padding:'8px 16px', fontSize:11, fontWeight:600, cursor:'pointer', transition:'all 0.2s', borderRadius:999, border:'none', background: searchMode === 'account' ? '#D4952B' : 'transparent', color: searchMode === 'account' ? '#0a0a0a' : 'rgba(255,255,255,0.45)'}}
              >
                Account
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex-1">
              <div className="relative">
                <svg
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5"
                  style={{color:'rgba(255,255,255,0.3)'}}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d={searchMode === 'account'
                      ? "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      : "M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                    }
                  />
                </svg>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder={searchMode === 'account'
                    ? platform === 'youtube' ? `Channel-Name oder YouTube-URL`
                      : platform === 'twitter' ? `@username (z.B. @elonmusk)`
                      : `Name oder Company-URL (z.B. "Alex Hormozi" oder linkedin.com/company/...)`
                    : `${platforms.find(p => p.value === platform)?.label || ''} Themen suchen...`
                  }
                  className="w-full pl-12 pr-20 py-2.5 text-sm focus:outline-none transition-all placeholder-[rgba(255,255,255,0.3)]"
                  style={{background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.12)', borderRadius:999, color:'rgba(255,255,255,0.9)'}}
                  disabled={isLoading}
                />
                {isLoading ? (
                  <div className="absolute right-4 top-1/2 -translate-y-1/2">
                    <div className="w-5 h-5 border-2 border-[#D4952B] border-t-transparent rounded-full animate-spin" />
                  </div>
                ) : (
                  <button
                    type="submit"
                    className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer transition-all"
                    style={{padding:'6px 18px', background:'#fff', color:'#0a0a0a', borderRadius:999, fontSize:11, fontWeight:700, border:'none', boxShadow:'0 0 20px rgba(255,255,255,0.08)'}}
                  >
                    Suchen
                  </button>
                )}
              </div>
            </form>

            <div className="flex overflow-hidden flex-shrink-0" style={{border:'1px solid rgba(255,255,255,0.12)', borderRadius:999, background:'rgba(255,255,255,0.05)'}}>
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => onAccountFilterChange('top4weeks')}
                style={{padding:'8px 12px', fontSize:10, fontWeight:600, cursor:'pointer', transition:'all 0.2s', borderRadius:999, border:'none', whiteSpace:'nowrap', background: accountFilter === 'top4weeks' ? '#D4952B' : 'transparent', color: accountFilter === 'top4weeks' ? '#0a0a0a' : 'rgba(255,255,255,0.45)'}}
              >
                Top 4 Wochen
              </button>
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => onAccountFilterChange('last10days')}
                style={{padding:'8px 12px', fontSize:10, fontWeight:600, cursor:'pointer', transition:'all 0.2s', borderRadius:999, border:'none', whiteSpace:'nowrap', background: accountFilter === 'last10days' ? '#D4952B' : 'transparent', color: accountFilter === 'last10days' ? '#0a0a0a' : 'rgba(255,255,255,0.45)'}}
              >
                Letzte 10 Tage
              </button>
            </div>

            {/* DE/EN Toggle */}
            <div className="flex overflow-hidden flex-shrink-0" style={{border:'1px solid rgba(255,255,255,0.12)', borderRadius:999, background:'rgba(255,255,255,0.05)'}}>
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => onTranslateChange(false)}
                style={{padding:'8px 12px', fontSize:10, fontWeight:600, cursor:'pointer', transition:'all 0.2s', borderRadius:999, border:'none', background: !translateDE ? 'rgba(255,255,255,0.12)' : 'transparent', color: !translateDE ? 'rgba(255,255,255,0.85)' : 'rgba(255,255,255,0.4)'}}
              >
                Original
              </button>
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => onTranslateChange(true)}
                style={{padding:'8px 12px', fontSize:10, fontWeight:600, cursor:'pointer', transition:'all 0.2s', borderRadius:999, border:'none', background: translateDE ? 'rgba(255,255,255,0.12)' : 'transparent', color: translateDE ? 'rgba(255,255,255,0.85)' : 'rgba(255,255,255,0.4)'}}
              >
                Deutsch
              </button>
            </div>
          </div>
          </div>
        ) : appMode === 'creator-report' ? (
          /* Creator Report: simple username input */
          <div className="pb-3 max-w-2xl">
            <form onSubmit={handleCreatorSubmit}>
              <div className="relative">
                <svg
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5"
                  style={{color:'rgba(255,255,255,0.3)'}}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <input
                  type="text"
                  value={creatorInput}
                  onChange={(e) => setCreatorInput(e.target.value)}
                  placeholder='Name des Creators (z.B. "Clare Kitching") oder Firmen-URL'
                  className="w-full pl-12 pr-20 py-2.5 text-sm focus:outline-none transition-all placeholder-[rgba(255,255,255,0.3)]"
                  style={{background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.12)', borderRadius:999, color:'rgba(255,255,255,0.9)'}}
                  disabled={isAnalyzing}
                />
                {isAnalyzing ? (
                  <div className="absolute right-4 top-1/2 -translate-y-1/2">
                    <div className="w-5 h-5 border-2 border-[#D4952B] border-t-transparent rounded-full animate-spin" />
                  </div>
                ) : (
                  <button
                    type="submit"
                    className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer transition-all"
                    style={{padding:'6px 18px', background:'#fff', color:'#0a0a0a', borderRadius:999, fontSize:11, fontWeight:700, border:'none', boxShadow:'0 0 20px rgba(255,255,255,0.08)'}}
                  >
                    Analysieren
                  </button>
                )}
              </div>
            </form>
          </div>
        ) : null}
      </div>
    </header>
  )
}
