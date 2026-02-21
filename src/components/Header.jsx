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
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#FFFDF9] border-b border-[#E8E4DD]">
      <div className="max-w-7xl mx-auto px-6">
        {/* Top row: Logo + App Mode Tabs */}
        <div className="h-14 flex items-center gap-6">
          <div className="flex-shrink-0 flex items-center gap-2">
            {onBackToLanding && (
              <button
                onClick={onBackToLanding}
                className="w-7 h-7 flex items-center justify-center text-[#A39E93] hover:text-[#2D2B28] hover:bg-[#F0EDE8] rounded-lg transition-all cursor-pointer"
                title="Zur Startseite"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
            )}
            <span className="text-xl font-bold text-[#2D2B28] tracking-tight">
              METIS AI
            </span>
          </div>

          {/* Main Mode Tabs */}
          <div className="flex items-center gap-1 bg-[#F0EDE8] rounded-xl p-1">
            {[
              { value: 'inspiration', label: 'Inspiration' },
              { value: 'creator-report', label: 'Creator-Analyse' },
              { value: 'saved-creators', label: 'Meine Creators' },
            ].map((tab) => (
              <button
                key={tab.value}
                type="button"
                onClick={() => onAppModeChange(tab.value)}
                className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                  appMode === tab.value
                    ? 'bg-white text-[#2D2B28] shadow-sm'
                    : 'text-[#6B6560] hover:text-[#2D2B28]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Platform tabs — only in inspiration mode */}
          {appMode === 'inspiration' && (
            <div className="flex items-center gap-1">
              {platforms.map((p) => (
                <button
                  key={p.value}
                  onClick={() => onPlatformChange(p.value)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border transition-all cursor-pointer ${
                    platform === p.value
                      ? 'bg-[#FEF3C7] border-[#D97706] text-[#92400E]'
                      : 'bg-white border-[#E8E4DD] text-[#6B6560] hover:bg-[#F7F5F0] hover:border-[#C4BFB6]'
                  }`}
                >
                  {p.icon}
                  {p.label}
                </button>
              ))}
            </div>
          )}

          <div className="flex-1" />
        </div>

        {/* Bottom row */}
        {appMode === 'saved-creators' ? null : appMode === 'inspiration' ? (
          /* Inspiration: Search mode toggle + Search bar */
          <div className="pb-3 flex items-center gap-3 max-w-2xl">
            <div className="flex rounded-lg border border-[#E8E4DD] overflow-hidden flex-shrink-0">
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => onSearchModeChange('topic')}
                className={`px-3 py-2 text-xs font-medium transition-all cursor-pointer ${
                  searchMode === 'topic'
                    ? 'bg-[#2D2B28] text-white'
                    : 'bg-white text-[#6B6560] hover:bg-[#F7F5F0]'
                }`}
              >
                Thema
              </button>
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => onSearchModeChange('account')}
                className={`px-3 py-2 text-xs font-medium transition-all cursor-pointer ${
                  searchMode === 'account'
                    ? 'bg-[#2D2B28] text-white'
                    : 'bg-white text-[#6B6560] hover:bg-[#F7F5F0]'
                }`}
              >
                Account
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex-1">
              <div className="relative">
                <svg
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#A39E93]"
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
                  className="w-full pl-12 pr-4 py-2.5 border border-[#E8E4DD] rounded-xl text-sm text-[#2D2B28] placeholder-[#A39E93] bg-[#F7F5F0] focus:outline-none focus:ring-2 focus:ring-[#D97706] focus:border-transparent focus:bg-white transition-all"
                  disabled={isLoading}
                />
                {isLoading ? (
                  <div className="absolute right-4 top-1/2 -translate-y-1/2">
                    <div className="w-5 h-5 border-2 border-[#D97706] border-t-transparent rounded-full animate-spin" />
                  </div>
                ) : (
                  <button
                    type="submit"
                    className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-[#D97706] text-white text-xs font-medium rounded-lg hover:bg-[#B45309] transition-all cursor-pointer"
                  >
                    Suchen
                  </button>
                )}
              </div>
            </form>

            <div className="flex rounded-lg border border-[#E8E4DD] overflow-hidden flex-shrink-0">
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => onAccountFilterChange('top4weeks')}
                className={`px-2.5 py-2 text-[11px] font-medium transition-all cursor-pointer whitespace-nowrap ${
                  accountFilter === 'top4weeks'
                    ? 'bg-[#D97706] text-white'
                    : 'bg-white text-[#6B6560] hover:bg-[#F7F5F0]'
                }`}
              >
                Top 4 Wochen
              </button>
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => onAccountFilterChange('last10days')}
                className={`px-2.5 py-2 text-[11px] font-medium transition-all cursor-pointer whitespace-nowrap ${
                  accountFilter === 'last10days'
                    ? 'bg-[#D97706] text-white'
                    : 'bg-white text-[#6B6560] hover:bg-[#F7F5F0]'
                }`}
              >
                Letzte 10 Tage
              </button>
            </div>

            {/* DE/EN Toggle */}
            <div className="flex rounded-lg border border-[#E8E4DD] overflow-hidden flex-shrink-0">
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => onTranslateChange(false)}
                className={`px-2.5 py-2 text-[11px] font-medium transition-all cursor-pointer ${
                  !translateDE ? 'bg-[#2D2B28] text-white' : 'bg-white text-[#6B6560] hover:bg-[#F7F5F0]'
                }`}
              >
                Original
              </button>
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => onTranslateChange(true)}
                className={`px-2.5 py-2 text-[11px] font-medium transition-all cursor-pointer ${
                  translateDE ? 'bg-[#2D2B28] text-white' : 'bg-white text-[#6B6560] hover:bg-[#F7F5F0]'
                }`}
              >
                Deutsch
              </button>
            </div>
          </div>
        ) : appMode === 'creator-report' ? (
          /* Creator Report: simple username input */
          <div className="pb-3 max-w-2xl">
            <form onSubmit={handleCreatorSubmit}>
              <div className="relative">
                <svg
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#A39E93]"
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
                  className="w-full pl-12 pr-4 py-2.5 border border-[#E8E4DD] rounded-xl text-sm text-[#2D2B28] placeholder-[#A39E93] bg-[#F7F5F0] focus:outline-none focus:ring-2 focus:ring-[#D97706] focus:border-transparent focus:bg-white transition-all"
                  disabled={isAnalyzing}
                />
                {isAnalyzing ? (
                  <div className="absolute right-4 top-1/2 -translate-y-1/2">
                    <div className="w-5 h-5 border-2 border-[#D97706] border-t-transparent rounded-full animate-spin" />
                  </div>
                ) : (
                  <button
                    type="submit"
                    className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-[#D97706] text-white text-xs font-medium rounded-lg hover:bg-[#B45309] transition-all cursor-pointer"
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
