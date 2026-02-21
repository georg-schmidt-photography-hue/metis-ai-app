import { useState } from 'react'

const SUGGESTED_TOPICS = [
  'Photovoltaik', 'Wärmepumpe', 'KI Mittelstand', 'Leadership',
  'Nachhaltigkeit', 'Elektroauto', 'Remote Work', 'Digitalisierung',
  'Energiekosten', 'Startup', 'Burnout', 'ChatGPT',
]

export default function TrendsTab({ savedCreators, onCreatePost }) {
  const [keyword, setKeyword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [trendData, setTrendData] = useState(null)
  const [error, setError] = useState(null)
  const [selectedCreator, setSelectedCreator] = useState(null)

  const handleSearch = async (kw) => {
    const term = kw || keyword
    if (!term.trim()) return
    setIsLoading(true)
    setError(null)
    setTrendData(null)
    setKeyword(term)

    try {
      const res = await fetch('/api/trends', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ keyword: term.trim(), geo: 'DE' }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Fehler beim Laden')
      setTrendData(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  const trendColor = trendData?.trend === 'rising'
    ? 'text-green-600 bg-green-50 border-green-200'
    : trendData?.trend === 'falling'
    ? 'text-red-500 bg-red-50 border-red-200'
    : 'text-[#6B6560] bg-[#F7F5F0] border-[#E8E4DD]'

  const trendLabel = trendData?.trend === 'rising' ? '📈 Steigend'
    : trendData?.trend === 'falling' ? '📉 Fallend' : '➡️ Stabil'

  const maxVal = trendData ? Math.max(...trendData.timelineData.map(d => d.value), 1) : 1

  return (
    <div className="space-y-5">
      {/* Search */}
      <div className="bg-[#FFFDF9] border border-[#E8E4DD] rounded-2xl p-5">
        <p className="text-[10px] font-semibold text-[#A39E93] uppercase tracking-widest mb-3">Google Trends — Deutschland</p>
        <div className="flex gap-2">
          <input
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !isLoading && handleSearch()}
            placeholder='Begriff eingeben, z.B. "Photovoltaik" oder "Bauer Module"'
            className="flex-1 px-4 py-2.5 border border-[#E8E4DD] rounded-xl text-sm text-[#2D2B28] placeholder-[#A39E93] bg-[#F7F5F0] focus:outline-none focus:ring-2 focus:ring-[#D97706] focus:border-transparent focus:bg-white transition-all"
            disabled={isLoading}
          />
          <button
            onClick={() => handleSearch()}
            disabled={isLoading || !keyword.trim()}
            className="px-4 py-2.5 bg-[#D97706] hover:bg-[#B45309] disabled:bg-[#D4A574] text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer disabled:cursor-not-allowed whitespace-nowrap"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Lädt…
              </span>
            ) : 'Trends laden'}
          </button>
        </div>

        {/* Suggested topics */}
        <div className="flex flex-wrap gap-2 mt-3">
          {SUGGESTED_TOPICS.map((t) => (
            <button
              key={t}
              onClick={() => handleSearch(t)}
              disabled={isLoading}
              className="px-2.5 py-1 text-[11px] rounded-lg border border-[#E8E4DD] text-[#6B6560] hover:bg-[#FEF3C7] hover:border-[#D97706] hover:text-[#92400E] transition-all cursor-pointer disabled:opacity-50"
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-600">{error}</div>
      )}

      {trendData && (
        <>
          {/* Score + Trend */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-[#FFFDF9] border border-[#E8E4DD] rounded-2xl p-5 text-center">
              <p className="text-3xl font-bold text-[#2D2B28]">{trendData.currentScore}</p>
              <p className="text-[10px] text-[#A39E93] uppercase tracking-wider mt-1">Aktueller Score</p>
              <p className="text-[10px] text-[#C4BFB6] mt-0.5">von 100</p>
            </div>
            <div className="bg-[#FFFDF9] border border-[#E8E4DD] rounded-2xl p-5 text-center">
              <p className="text-3xl font-bold text-[#2D2B28]">{trendData.peakScore}</p>
              <p className="text-[10px] text-[#A39E93] uppercase tracking-wider mt-1">Peak Score</p>
              <p className="text-[10px] text-[#C4BFB6] mt-0.5">letztes Jahr</p>
            </div>
            <div className={`rounded-2xl p-5 text-center border ${trendColor}`}>
              <p className="text-xl font-bold mt-1">{trendLabel}</p>
              <p className="text-[10px] uppercase tracking-wider mt-2 opacity-70">Tendenz</p>
            </div>
          </div>

          {/* Interest over time chart */}
          {trendData.timelineData.length > 0 && (
            <div className="bg-[#FFFDF9] border border-[#E8E4DD] rounded-2xl p-5">
              <p className="text-xs font-semibold text-[#6B6560] uppercase tracking-wider mb-4">
                Interesse über Zeit — {trendData.keyword}
              </p>
              <div className="flex items-end gap-px h-24">
                {trendData.timelineData.map((d, i) => {
                  const pct = Math.round((d.value / maxVal) * 100)
                  return (
                    <div key={i} className="flex-1 flex flex-col items-center group relative">
                      <div
                        className={`w-full rounded-t-sm ${d.value > 0 ? 'bg-[#D97706]' : 'bg-[#F0EDE8]'}`}
                        style={{ height: `${Math.max(pct, d.value > 0 ? 4 : 2)}%` }}
                      />
                      {d.value > 0 && (
                        <div className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 bg-[#2D2B28] text-white text-[9px] px-1.5 py-0.5 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none z-10">
                          {d.date}: {d.value}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
              <div className="flex justify-between mt-1">
                <span className="text-[9px] text-[#C4BFB6]">{trendData.timelineData[0]?.date}</span>
                <span className="text-[9px] text-[#C4BFB6]">{trendData.timelineData[trendData.timelineData.length - 1]?.date}</span>
              </div>
            </div>
          )}

          {/* Related queries + topics */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Rising queries — Content Gold */}
            {trendData.risingQueries.length > 0 && (
              <div className="bg-[#FFFDF9] border border-[#E8E4DD] rounded-2xl p-5">
                <p className="text-xs font-semibold text-[#6B6560] uppercase tracking-wider mb-1">🔥 Aufsteigende Suchanfragen</p>
                <p className="text-[10px] text-[#A39E93] mb-4">Content-Ideen mit hohem Momentum</p>
                <div className="space-y-2">
                  {trendData.risingQueries.map((q, i) => (
                    <button
                      key={i}
                      onClick={() => handleSearch(q.query)}
                      className="w-full flex items-center justify-between px-3 py-2 rounded-lg bg-[#F7F5F0] hover:bg-[#FEF3C7] hover:border-[#D97706] border border-transparent transition-all text-left cursor-pointer group"
                    >
                      <span className="text-xs text-[#2D2B28] font-medium group-hover:text-[#92400E]">{q.query}</span>
                      <span className="text-[10px] text-[#D97706] font-semibold flex-shrink-0 ml-2">
                        {q.value === 'Breakout' ? '🚀 Breakout' : `+${q.value}%`}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Top queries */}
            {trendData.topQueries.length > 0 && (
              <div className="bg-[#FFFDF9] border border-[#E8E4DD] rounded-2xl p-5">
                <p className="text-xs font-semibold text-[#6B6560] uppercase tracking-wider mb-1">📊 Top Suchanfragen</p>
                <p className="text-[10px] text-[#A39E93] mb-4">Dauerhaft beliebteste Themen</p>
                <div className="space-y-2">
                  {trendData.topQueries.map((q, i) => {
                    const pct = Math.round((q.value / 100) * 100)
                    return (
                      <button
                        key={i}
                        onClick={() => handleSearch(q.query)}
                        className="w-full text-left cursor-pointer group"
                      >
                        <div className="flex items-center justify-between mb-0.5">
                          <span className="text-xs text-[#2D2B28] group-hover:text-[#D97706] transition-colors">{q.query}</span>
                          <span className="text-[10px] text-[#A39E93]">{q.value}</span>
                        </div>
                        <div className="h-1.5 bg-[#F0EDE8] rounded-full overflow-hidden">
                          <div className="h-full bg-[#D97706] rounded-full" style={{ width: `${pct}%` }} />
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Rising topics */}
          {trendData.risingTopics.length > 0 && (
            <div className="bg-[#FFFDF9] border border-[#E8E4DD] rounded-2xl p-5">
              <p className="text-xs font-semibold text-[#6B6560] uppercase tracking-wider mb-3">Verwandte Themen mit Momentum</p>
              <div className="flex flex-wrap gap-2">
                {trendData.risingTopics.map((t, i) => (
                  <button
                    key={i}
                    onClick={() => handleSearch(t.title)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#E8E4DD] bg-[#F7F5F0] hover:bg-[#FEF3C7] hover:border-[#D97706] text-xs text-[#2D2B28] transition-all cursor-pointer"
                  >
                    {t.title}
                    {t.type && <span className="text-[10px] text-[#A39E93]">· {t.type}</span>}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* CREATE POST Section */}
          <div className="bg-[#FFFDF9] border-2 border-[#D97706] rounded-2xl p-5">
            <p className="text-sm font-bold text-[#2D2B28] mb-1">Post aus diesem Trend erstellen</p>
            <p className="text-xs text-[#6B6560] mb-4">
              Wähle einen Creator — Perplexity recherchiert aktuelle Infos zu <span className="font-semibold">"{trendData.keyword}"</span> und GPT schreibt den Post in seinem Stil.
            </p>

            {savedCreators.length === 0 ? (
              <div className="text-xs text-[#A39E93] bg-[#F7F5F0] rounded-xl p-4 text-center">
                Noch keine Creators gespeichert. Analysiere einen Creator im Tab "Creator-Analyse" und speichere ihn.
              </div>
            ) : (
              <div className="space-y-3">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {savedCreators.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => setSelectedCreator(selectedCreator?.id === c.id ? null : c)}
                      className={`flex items-center gap-2 p-3 rounded-xl border transition-all cursor-pointer text-left ${
                        selectedCreator?.id === c.id
                          ? 'border-[#D97706] bg-[#FEF3C7]'
                          : 'border-[#E8E4DD] bg-white hover:border-[#C4BFB6]'
                      }`}
                    >
                      <div className="w-8 h-8 rounded-full bg-[#E8E4DD] flex items-center justify-center overflow-hidden flex-shrink-0">
                        {c.avatarUrl ? (
                          <img src={c.avatarUrl} alt={c.name} className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-xs font-bold text-[#6B6560]">{c.name?.charAt(0)}</span>
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-[#2D2B28] truncate">{c.name}</p>
                        <p className="text-[10px] text-[#A39E93]">{c.postsPerWeek} Posts/W</p>
                      </div>
                    </button>
                  ))}
                </div>

                {selectedCreator && (
                  <button
                    onClick={() => onCreatePost({
                      topic: trendData.keyword,
                      creator: selectedCreator,
                      trendContext: {
                        trend: trendData.trend,
                        currentScore: trendData.currentScore,
                        risingQueries: trendData.risingQueries,
                      },
                    })}
                    className="w-full py-3 bg-[#D97706] hover:bg-[#B45309] text-white text-sm font-bold rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    Post erstellen im Stil von {selectedCreator.name}
                  </button>
                )}
              </div>
            )}
          </div>
        </>
      )}

      {!trendData && !isLoading && !error && (
        <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
          <div className="w-16 h-16 rounded-2xl bg-[#FEF3C7] flex items-center justify-center">
            <svg className="w-8 h-8 text-[#D97706]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          </div>
          <div>
            <p className="text-[#2D2B28] font-medium">Finde trendende Themen</p>
            <p className="text-sm text-[#A39E93] mt-1 max-w-sm">
              Gib einen Begriff ein oder wähle einen Vorschlag — sieh sofort ob das Thema gerade steigt oder fällt
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
