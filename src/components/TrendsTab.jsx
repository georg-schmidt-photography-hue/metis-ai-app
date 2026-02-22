import { useState, useRef, useEffect } from 'react'

function LineChart({ data, keyword, compareKeyword }) {
  const [tooltip, setTooltip] = useState(null)
  const svgRef = useRef(null)
  const W = 800, H = 160, PL = 36, PR = 8, PT = 10, PB = 24

  const vals = data.map(d => d.value)
  const cvals = data.map(d => d.compareValue ?? null)
  const hasCompare = cvals.some(v => v !== null)

  const xScale = (i) => PL + (i / (data.length - 1)) * (W - PL - PR)
  const yScale = (v) => PT + (1 - v / 100) * (H - PT - PB)

  const linePath = (values) => values
    .map((v, i) => v == null ? null : `${i === 0 || values[i-1] == null ? 'M' : 'L'}${xScale(i).toFixed(1)},${yScale(v).toFixed(1)}`)
    .filter(Boolean).join(' ')

  const areaPath = (values) => {
    const pts = values.map((v, i) => v != null ? `${xScale(i).toFixed(1)},${yScale(v).toFixed(1)}` : null).filter(Boolean)
    if (!pts.length) return ''
    const first = values.findIndex(v => v != null)
    const last = values.length - 1 - [...values].reverse().findIndex(v => v != null)
    return `M${xScale(first)},${H - PB} L${pts.join(' L')} L${xScale(last)},${H - PB} Z`
  }

  const xLabels = [0, Math.floor(data.length/4), Math.floor(data.length/2), Math.floor(data.length*3/4), data.length-1]

  return (
    <div className="relative select-none">
      <svg
        ref={svgRef}
        viewBox={`0 0 ${W} ${H}`}
        className="w-full"
        style={{ height: 180 }}
        onMouseMove={(e) => {
          const rect = svgRef.current.getBoundingClientRect()
          const x = (e.clientX - rect.left) / rect.width * W
          const idx = Math.round(((x - PL) / (W - PL - PR)) * (data.length - 1))
          if (idx >= 0 && idx < data.length) setTooltip({ idx, x: rect.left + (xScale(idx) / W) * rect.width, y: e.clientY })
        }}
        onMouseLeave={() => setTooltip(null)}
      >
        {/* Grid lines */}
        {[0, 25, 50, 75, 100].map(v => (
          <g key={v}>
            <line x1={PL} x2={W - PR} y1={yScale(v)} y2={yScale(v)} stroke="#F0EDE8" strokeWidth="1" />
            <text x={PL - 4} y={yScale(v) + 3} textAnchor="end" fontSize="9" fill="#C4BFB6">{v}</text>
          </g>
        ))}

        {/* Area fill — compare */}
        {hasCompare && <path d={areaPath(cvals)} fill="#64748B" fillOpacity="0.06" />}
        {/* Area fill — main */}
        <path d={areaPath(vals)} fill="#D97706" fillOpacity="0.10" />

        {/* Lines */}
        {hasCompare && <path d={linePath(cvals)} fill="none" stroke="#64748B" strokeWidth="2" strokeDasharray="5,3" />}
        <path d={linePath(vals)} fill="none" stroke="#D97706" strokeWidth="2.5" />

        {/* Hover dot */}
        {tooltip && (
          <>
            <line x1={xScale(tooltip.idx)} x2={xScale(tooltip.idx)} y1={PT} y2={H - PB} stroke="#2D2B28" strokeWidth="1" strokeOpacity="0.2" />
            {data[tooltip.idx]?.value != null && (
              <circle cx={xScale(tooltip.idx)} cy={yScale(data[tooltip.idx].value)} r="4" fill="#D97706" stroke="white" strokeWidth="2" />
            )}
            {data[tooltip.idx]?.compareValue != null && (
              <circle cx={xScale(tooltip.idx)} cy={yScale(data[tooltip.idx].compareValue)} r="4" fill="#64748B" stroke="white" strokeWidth="2" />
            )}
          </>
        )}

        {/* X-axis labels */}
        {xLabels.map(idx => (
          <text key={idx} x={xScale(idx)} y={H - 4} textAnchor="middle" fontSize="9" fill="#C4BFB6">
            {data[idx]?.date?.split(' ')[0]}
          </text>
        ))}
      </svg>

      {/* Tooltip popup */}
      {tooltip && (
        <div
          className="fixed z-50 pointer-events-none bg-[#2D2B28] text-white text-[11px] px-3 py-2 rounded-xl shadow-lg leading-relaxed"
          style={{ left: tooltip.x + 12, top: tooltip.y - 40, transform: 'translateY(-50%)' }}
        >
          <div className="font-semibold mb-1">{data[tooltip.idx]?.date}</div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-0.5 bg-[#D97706] inline-block rounded" />
            <span className="text-[#A39E93]">{keyword}:</span>
            <span className="font-bold text-[#D97706]">{data[tooltip.idx]?.value}</span>
          </div>
          {data[tooltip.idx]?.compareValue != null && (
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-0.5 bg-[#64748B] inline-block rounded" />
              <span className="text-[#A39E93]">{compareKeyword}:</span>
              <span className="font-bold text-[#94A3B8]">{data[tooltip.idx]?.compareValue}</span>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function ScoreLabel({ score }) {
  const s = Number(score)
  if (s >= 80) return (
    <div className="mt-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-100 border border-green-300 text-green-700 text-[10px] font-semibold">
      <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" />
      Hochsaison — maximale Aufmerksamkeit
    </div>
  )
  if (s >= 50) return (
    <div className="mt-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-[10px] font-semibold">
      <span className="w-1.5 h-1.5 rounded-full bg-blue-400 inline-block" />
      Solides Interesse — guter Zeitpunkt
    </div>
  )
  if (s >= 20) return (
    <div className="mt-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#FEF3C7] border border-[#F59E0B] text-[#92400E] text-[10px] font-semibold">
      <span className="w-1.5 h-1.5 rounded-full bg-[#D97706] inline-block" />
      Schwache Phase — Timing überdenken
    </div>
  )
  return (
    <div className="mt-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-50 border border-red-200 text-red-600 text-[10px] font-semibold">
      <span className="w-1.5 h-1.5 rounded-full bg-red-400 inline-block" />
      Kaum Interesse — Welle abwarten
    </div>
  )
}

const SUGGESTED_TOPICS = [
  'Photovoltaik', 'Wärmepumpe', 'KI Mittelstand', 'Leadership',
  'Nachhaltigkeit', 'Elektroauto', 'Remote Work', 'Digitalisierung',
  'Energiekosten', 'Startup', 'Burnout', 'ChatGPT',
]

export default function TrendsTab({ savedCreators, onCreatePost }) {
  const [keyword, setKeyword] = useState('')
  const [compareKeyword, setCompareKeyword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [trendData, setTrendData] = useState(null)
  const [error, setError] = useState(null)
  const [selectedCreator, setSelectedCreator] = useState(null)
  const [trendingNow, setTrendingNow] = useState(null)
  const [trendingLoading, setTrendingLoading] = useState(true)

  useEffect(() => {
    fetch('/api/trending-now')
      .then(r => r.json())
      .then(d => setTrendingNow(d))
      .catch(() => setTrendingNow(null))
      .finally(() => setTrendingLoading(false))
  }, [])

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
        body: JSON.stringify({ keyword: term.trim(), compareWith: compareKeyword.trim() || null, geo: 'DE' }),
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

      {/* Trending Now — auto-loaded */}
      <div className="bg-[#FFFDF9] border border-[#E8E4DD] rounded-2xl p-5">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-base">🔥</span>
          <p className="text-xs font-semibold text-[#2D2B28] uppercase tracking-wider">Aktuell in Deutschland gesucht</p>
          {trendingNow?.date && <span className="text-[10px] text-[#A39E93] ml-auto">{trendingNow.date}</span>}
        </div>
        {trendingLoading ? (
          <div className="flex items-center gap-2 text-xs text-[#A39E93]">
            <div className="w-3.5 h-3.5 border-2 border-[#D97706] border-t-transparent rounded-full animate-spin" />
            Lade aktuelle Trends…
          </div>
        ) : trendingNow?.topics?.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {trendingNow.topics.map((t, i) => (
              <button
                key={i}
                onClick={() => handleSearch(t.title)}
                disabled={isLoading}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-[#E8E4DD] bg-white hover:bg-[#FEF3C7] hover:border-[#D97706] transition-all cursor-pointer text-left group disabled:opacity-50"
              >
                <span className="text-[10px] font-bold text-[#D97706] w-4">{i + 1}</span>
                <span className="text-xs font-medium text-[#2D2B28] group-hover:text-[#92400E]">{t.title}</span>
                {t.traffic && <span className="text-[10px] text-[#A39E93]">{t.traffic}</span>}
              </button>
            ))}
          </div>
        ) : (
          <p className="text-xs text-[#A39E93]">Trending-Daten momentan nicht verfügbar — nutze die Suche unten</p>
        )}
      </div>

      {/* Search */}
      <div className="bg-[#FFFDF9] border border-[#E8E4DD] rounded-2xl p-5">
        <p className="text-[10px] font-semibold text-[#A39E93] uppercase tracking-widest mb-3">Google Trends — Deutschland</p>
        <div className="flex gap-2">
          <div className="flex-1 flex gap-2">
            <div className="flex-1 relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-sm bg-[#D97706]" />
              <input
                type="text"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && !isLoading && handleSearch()}
                placeholder='Thema, z.B. "Photovoltaik"'
                className="w-full pl-8 pr-3 py-2.5 border border-[#E8E4DD] rounded-xl text-sm text-[#2D2B28] placeholder-[#A39E93] bg-[#F7F5F0] focus:outline-none focus:ring-2 focus:ring-[#D97706] focus:border-transparent focus:bg-white transition-all"
                disabled={isLoading}
              />
            </div>
            <div className="flex items-center text-xs text-[#A39E93] flex-shrink-0">vs.</div>
            <div className="flex-1 relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-sm bg-[#94A3B8]" />
              <input
                type="text"
                value={compareKeyword}
                onChange={(e) => setCompareKeyword(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && !isLoading && handleSearch()}
                placeholder='Vergleich (optional)'
                className="w-full pl-8 pr-3 py-2.5 border border-[#E8E4DD] rounded-xl text-sm text-[#2D2B28] placeholder-[#A39E93] bg-[#F7F5F0] focus:outline-none focus:ring-2 focus:ring-[#94A3B8] focus:border-transparent focus:bg-white transition-all"
                disabled={isLoading}
              />
            </div>
          </div>
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
            ) : 'Vergleichen'}
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
          {/* Score explanation */}
          <div className="bg-[#FEF3C7] border border-[#F59E0B] rounded-xl px-4 py-2.5 text-xs text-[#92400E] flex items-start gap-2">
            <span className="flex-shrink-0 mt-0.5">ℹ️</span>
            <span>
              <strong>Score 0–100</strong> = relatives Suchinteresse. 100 = höchster Punkt im Zeitraum. Die Hover-Zahlen sind <em>keine</em> absoluten Suchanfragen — Google normiert immer auf 100.
              &nbsp;·&nbsp; <strong>Steigend</strong> = jetzt posten · <strong>Fallend</strong> = Welle abwarten
            </span>
          </div>

          {/* Score + Trend */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-[#FFFDF9] border border-[#E8E4DD] rounded-2xl p-5 text-center">
              <p className="text-3xl font-bold text-[#2D2B28]">{trendData.currentScore}</p>
              <p className="text-[10px] text-[#A39E93] uppercase tracking-wider mt-1">Aktueller Score</p>
              <ScoreLabel score={trendData.currentScore} />
            </div>
            <div className="bg-[#FFFDF9] border border-[#E8E4DD] rounded-2xl p-5 text-center">
              <p className="text-3xl font-bold text-[#2D2B28]">{trendData.peakScore}</p>
              <p className="text-[10px] text-[#A39E93] uppercase tracking-wider mt-1">Peak Score</p>
              <p className="text-[10px] text-[#C4BFB6] mt-1">Jahreshöchstwert = 100</p>
            </div>
            <div className={`rounded-2xl p-5 text-center border ${trendColor}`}>
              <p className="text-xl font-bold mt-1">{trendLabel}</p>
              <p className="text-[10px] uppercase tracking-wider mt-2 opacity-70">Tendenz</p>
            </div>
          </div>

          {/* Interest over time — SVG line chart */}
          {trendData.timelineData.length > 0 && (
            <div className="bg-[#FFFDF9] border border-[#E8E4DD] rounded-2xl p-5">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-xs font-semibold text-[#6B6560] uppercase tracking-wider">Interesse über Zeit — 12 Monate</p>
                  <p className="text-[10px] text-[#A39E93] mt-1">
                    Score 100 = höchstes Interesse im Zeitraum · Hover für Details
                  </p>
                </div>
                <div className="flex items-center gap-4 text-[11px] flex-shrink-0 ml-4">
                  <span className="flex items-center gap-1.5 font-medium text-[#D97706]">
                    <span className="w-8 h-0.5 bg-[#D97706] inline-block rounded" />
                    {trendData.keyword}
                  </span>
                  {trendData.compareKeyword && (
                    <span className="flex items-center gap-1.5 font-medium text-[#64748B]">
                      <span className="w-8 h-0.5 bg-[#64748B] inline-block rounded border-dashed" style={{borderTop:'2px dashed #64748B', height:0}} />
                      {trendData.compareKeyword}
                    </span>
                  )}
                </div>
              </div>

              <LineChart data={trendData.timelineData} keyword={trendData.keyword} compareKeyword={trendData.compareKeyword} />
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
