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
            <line x1={PL} x2={W - PR} y1={yScale(v)} y2={yScale(v)} stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
            <text x={PL - 4} y={yScale(v) + 3} textAnchor="end" fontSize="9" fill="rgba(255,255,255,0.25)">{v}</text>
          </g>
        ))}

        {/* Area fill — compare */}
        {hasCompare && <path d={areaPath(cvals)} fill="#94A3B8" fillOpacity="0.06" />}
        {/* Area fill — main */}
        <path d={areaPath(vals)} fill="#D4952B" fillOpacity="0.12" />

        {/* Lines */}
        {hasCompare && <path d={linePath(cvals)} fill="none" stroke="rgba(148,163,184,0.7)" strokeWidth="2" strokeDasharray="5,3" />}
        <path d={linePath(vals)} fill="none" stroke="#D4952B" strokeWidth="2.5" />

        {/* Hover dot */}
        {tooltip && (
          <>
            <line x1={xScale(tooltip.idx)} x2={xScale(tooltip.idx)} y1={PT} y2={H - PB} stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
            {data[tooltip.idx]?.value != null && (
              <circle cx={xScale(tooltip.idx)} cy={yScale(data[tooltip.idx].value)} r="4" fill="#D4952B" stroke="rgba(255,255,255,0.8)" strokeWidth="2" />
            )}
            {data[tooltip.idx]?.compareValue != null && (
              <circle cx={xScale(tooltip.idx)} cy={yScale(data[tooltip.idx].compareValue)} r="4" fill="#94A3B8" stroke="rgba(255,255,255,0.8)" strokeWidth="2" />
            )}
          </>
        )}

        {/* X-axis labels */}
        {xLabels.map(idx => (
          <text key={idx} x={xScale(idx)} y={H - 4} textAnchor="middle" fontSize="9" fill="rgba(255,255,255,0.25)">
            {data[idx]?.date?.split(' ')[0]}
          </text>
        ))}
      </svg>

      {/* Tooltip popup */}
      {tooltip && (
        <div
          className="fixed z-50 pointer-events-none text-white text-[11px] px-3 py-2 rounded-xl shadow-lg leading-relaxed"
          style={{ left: tooltip.x + 12, top: tooltip.y - 40, transform: 'translateY(-50%)', background: 'rgba(20,20,20,0.95)', border: '1px solid rgba(255,255,255,0.12)' }}
        >
          <div className="font-semibold mb-1">{data[tooltip.idx]?.date}</div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-0.5 bg-[#D4952B] inline-block rounded" />
            <span style={{ color: 'rgba(255,255,255,0.4)' }}>{keyword}:</span>
            <span className="font-bold text-[#D4952B]">{data[tooltip.idx]?.value}</span>
          </div>
          {data[tooltip.idx]?.compareValue != null && (
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-0.5 bg-[#94A3B8] inline-block rounded" />
              <span style={{ color: 'rgba(255,255,255,0.4)' }}>{compareKeyword}:</span>
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
    <div className="mt-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold" style={{ background: 'rgba(34,197,94,0.12)', color: '#22c55e' }}>
      <span className="w-1.5 h-1.5 rounded-full bg-[#22c55e] inline-block" />
      Hochsaison — maximale Aufmerksamkeit
    </div>
  )
  if (s >= 50) return (
    <div className="mt-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold" style={{ background: 'rgba(99,102,241,0.12)', color: '#818cf8' }}>
      <span className="w-1.5 h-1.5 rounded-full bg-[#818cf8] inline-block" />
      Solides Interesse — guter Zeitpunkt
    </div>
  )
  if (s >= 20) return (
    <div className="mt-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold" style={{ background: 'rgba(212,149,43,0.15)', color: '#D4952B' }}>
      <span className="w-1.5 h-1.5 rounded-full bg-[#D4952B] inline-block" />
      Schwache Phase — Timing überdenken
    </div>
  )
  return (
    <div className="mt-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold" style={{ background: 'rgba(239,68,68,0.12)', color: '#f87171' }}>
      <span className="w-1.5 h-1.5 rounded-full bg-[#f87171] inline-block" />
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
    fetch(`/api/trending-now?t=${Date.now()}`, { cache: 'no-store' })
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
      const text = await res.text()
      let data
      try { data = JSON.parse(text) } catch { throw new Error('Ungültige Serverantwort — bitte erneut versuchen') }
      if (!res.ok) throw new Error(data.error || 'Fehler beim Laden')
      setTrendData(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  const trendColor = trendData?.trend === 'rising'
    ? { background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.25)', color: '#22c55e' }
    : trendData?.trend === 'falling'
    ? { background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#f87171' }
    : { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.6)' }

  const trendLabel = trendData?.trend === 'rising' ? '📈 Steigend'
    : trendData?.trend === 'falling' ? '📉 Fallend' : '➡️ Stabil'

  const cardStyle = { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16 }
  const cardStyleHighlight = { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(212,149,43,0.35)', borderRadius: 16 }

  return (
    <div className="space-y-4">

      {/* Trending Now */}
      <div style={cardStyle} className="p-5">
        <div className="flex items-center gap-2 mb-4">
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#22c55e', display: 'inline-block', animation: 'pulse 2s infinite' }} />
          <p style={{ fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.85)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Aktuell trending in Deutschland
          </p>
          {trendingNow?.date && (
            <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', marginLeft: 'auto' }}>
              {trendingNow.date} · {trendingNow.time} Uhr
            </span>
          )}
        </div>

        {trendingLoading ? (
          <div className="flex items-center gap-2" style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>
            <div className="w-3.5 h-3.5 border-2 border-[#D4952B] border-t-transparent rounded-full animate-spin" />
            Perplexity durchsucht alle Plattformen…
          </div>
        ) : trendingNow && (trendingNow.google?.length || trendingNow.reddit?.length) ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
            {[
              { key: 'google', label: 'Google', icon: '🔍', color: '#818cf8', subtitle: t => t.category },
              { key: 'reddit', label: 'Reddit', icon: '🤖', color: '#fb923c', subtitle: t => t.subreddit ? `r/${t.subreddit}` : '' },
              { key: 'twitter', label: 'X / Twitter', icon: '𝕏', color: 'rgba(255,255,255,0.7)', subtitle: t => t.context },
              { key: 'youtube', label: 'YouTube', icon: '▶', color: '#f87171', subtitle: t => t.channel },
              { key: 'instagram', label: 'Instagram', icon: '📸', color: '#f472b6', subtitle: t => t.context },
            ].map(({ key, label, icon, color, subtitle }) => {
              const items = trendingNow[key] || []
              const validItems = items.filter(t => t.title?.trim() && t.title !== 'Nicht verfügbar')
              if (!validItems.length) return null
              return (
                <div key={key} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12 }} className="p-3">
                  <div className="flex items-center gap-1.5 mb-2.5">
                    <span style={{ fontSize: 13, fontWeight: 700, color }}>{icon}</span>
                    <span style={{ fontSize: 10, fontWeight: 600, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</span>
                  </div>
                  <div className="space-y-1.5">
                    {items.filter(t => t.title?.trim()).map((t, i) => (
                      <button
                        key={i}
                        onClick={() => handleSearch(t.title.replace(/^#/, ''))}
                        disabled={isLoading}
                        style={{ width: '100%', display: 'flex', alignItems: 'flex-start', gap: 8, padding: '6px 8px', borderRadius: 8, background: 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left', transition: 'background 0.15s' }}
                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(212,149,43,0.08)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                        className="disabled:opacity-50"
                      >
                        <span style={{ fontSize: 10, fontWeight: 700, color: '#D4952B', width: 14, flexShrink: 0, marginTop: 2 }}>{i + 1}</span>
                        <div className="min-w-0">
                          <p style={{ fontSize: 12, fontWeight: 500, color: 'rgba(255,255,255,0.8)', lineHeight: 1.3 }}>{t.title}</p>
                          {subtitle(t) && (
                            <p style={{ fontSize: 9, color: 'rgba(255,255,255,0.3)', marginTop: 2 }} className="truncate">{subtitle(t)}</p>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)' }}>Trending-Daten momentan nicht verfügbar — nutze die Suche unten</p>
        )}
      </div>

      {/* Search */}
      <div style={cardStyle} className="p-5">
        <p style={{ fontSize: 10, fontWeight: 600, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 12 }}>
          Google Trends — Deutschland
        </p>
        <div className="flex gap-2">
          <div className="flex-1 flex gap-2">
            <div className="flex-1 relative">
              <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', width: 10, height: 10, borderRadius: 2, background: '#D4952B' }} />
              <input
                type="text"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && !isLoading && handleSearch()}
                placeholder='Thema, z.B. "Photovoltaik"'
                style={{ width: '100%', paddingLeft: 32, paddingRight: 12, paddingTop: 10, paddingBottom: 10, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 999, fontSize: 14, color: 'rgba(255,255,255,0.85)', outline: 'none' }}
                disabled={isLoading}
              />
            </div>
            <div className="flex items-center text-xs flex-shrink-0" style={{ color: 'rgba(255,255,255,0.3)' }}>vs.</div>
            <div className="flex-1 relative">
              <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', width: 10, height: 10, borderRadius: 2, background: '#94A3B8' }} />
              <input
                type="text"
                value={compareKeyword}
                onChange={(e) => setCompareKeyword(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && !isLoading && handleSearch()}
                placeholder='Vergleich (optional)'
                style={{ width: '100%', paddingLeft: 32, paddingRight: 12, paddingTop: 10, paddingBottom: 10, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 999, fontSize: 14, color: 'rgba(255,255,255,0.85)', outline: 'none' }}
                disabled={isLoading}
              />
            </div>
          </div>
          <button
            onClick={() => handleSearch()}
            disabled={isLoading || !keyword.trim()}
            style={{ padding: '10px 20px', background: keyword.trim() && !isLoading ? '#D4952B' : 'rgba(255,255,255,0.08)', color: keyword.trim() && !isLoading ? '#0a0a0a' : 'rgba(255,255,255,0.3)', border: 'none', borderRadius: 999, fontSize: 13, fontWeight: 700, cursor: keyword.trim() && !isLoading ? 'pointer' : 'not-allowed', whiteSpace: 'nowrap', transition: 'all 0.2s' }}
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
              style={{ padding: '6px 14px', fontSize: 11, borderRadius: 999, border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.03)', color: 'rgba(255,255,255,0.55)', cursor: 'pointer', transition: 'all 0.15s' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(212,149,43,0.4)'; e.currentTarget.style.color = '#D4952B'; e.currentTarget.style.background = 'rgba(212,149,43,0.08)' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = 'rgba(255,255,255,0.55)'; e.currentTarget.style.background = 'rgba(255,255,255,0.03)' }}
              className="disabled:opacity-50"
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 12, padding: '12px 16px', fontSize: 13, color: '#f87171' }}>{error}</div>
      )}

      {trendData && (
        <>
          {/* Score explanation */}
          <div style={{ background: 'rgba(212,149,43,0.08)', border: '1px solid rgba(212,149,43,0.2)', borderRadius: 12, padding: '10px 16px', fontSize: 11, color: 'rgba(255,255,255,0.55)', display: 'flex', alignItems: 'flex-start', gap: 8 }}>
            <span style={{ flexShrink: 0, marginTop: 1 }}>ℹ️</span>
            <span>
              <strong style={{ color: 'rgba(255,255,255,0.75)' }}>Score 0–100</strong> = relatives Suchinteresse. 100 = höchster Punkt im Zeitraum. Die Hover-Zahlen sind <em>keine</em> absoluten Suchanfragen — Google normiert immer auf 100.
              &nbsp;·&nbsp; <strong style={{ color: 'rgba(255,255,255,0.75)' }}>Steigend</strong> = jetzt posten · <strong style={{ color: 'rgba(255,255,255,0.75)' }}>Fallend</strong> = Welle abwarten
            </span>
          </div>

          {/* Score + Trend */}
          <div className="grid grid-cols-3 gap-3">
            <div style={cardStyle} className="p-5 text-center">
              <p style={{ fontSize: 32, fontWeight: 700, color: 'rgba(255,255,255,0.9)' }}>{trendData.currentScore}</p>
              <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.06em', marginTop: 4 }}>Aktueller Score</p>
              <ScoreLabel score={trendData.currentScore} />
            </div>
            <div style={cardStyle} className="p-5 text-center">
              <p style={{ fontSize: 32, fontWeight: 700, color: 'rgba(255,255,255,0.9)' }}>{trendData.peakScore}</p>
              <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.06em', marginTop: 4 }}>Peak Score</p>
              <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.2)', marginTop: 4 }}>Jahreshöchstwert = 100</p>
            </div>
            <div style={{ ...trendColor, borderRadius: 16 }} className="p-5 text-center">
              <p style={{ fontSize: 20, fontWeight: 700, marginTop: 4 }}>{trendLabel}</p>
              <p style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.06em', marginTop: 8, opacity: 0.7 }}>Tendenz</p>
            </div>
          </div>

          {/* Interest over time */}
          {trendData.timelineData.length > 0 && (
            <div style={cardStyle} className="p-5">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p style={{ fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Interesse über Zeit — 12 Monate</p>
                  <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', marginTop: 4 }}>Score 100 = höchstes Interesse im Zeitraum · Hover für Details</p>
                </div>
                <div className="flex items-center gap-4 flex-shrink-0 ml-4" style={{ fontSize: 11 }}>
                  <span className="flex items-center gap-1.5" style={{ fontWeight: 500, color: '#D4952B' }}>
                    <span style={{ width: 24, height: 2, background: '#D4952B', borderRadius: 2, display: 'inline-block' }} />
                    {trendData.keyword}
                  </span>
                  {trendData.compareKeyword && (
                    <span className="flex items-center gap-1.5" style={{ fontWeight: 500, color: '#94A3B8' }}>
                      <span style={{ width: 24, height: 0, borderTop: '2px dashed #94A3B8', display: 'inline-block' }} />
                      {trendData.compareKeyword}
                    </span>
                  )}
                </div>
              </div>
              <LineChart data={trendData.timelineData} keyword={trendData.keyword} compareKeyword={trendData.compareKeyword} />
            </div>
          )}

          {/* Rising + Top queries */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {trendData.risingQueries.length > 0 && (
              <div style={cardStyle} className="p-5">
                <p style={{ fontSize: 10, fontWeight: 600, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>🚀 Aufsteigende Suchanfragen</p>
                <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.25)', marginBottom: 16 }}>Content-Ideen mit hohem Momentum</p>
                <div className="space-y-2">
                  {trendData.risingQueries.map((q, i) => (
                    <button
                      key={i}
                      onClick={() => handleSearch(q.query)}
                      style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px', borderRadius: 10, background: 'rgba(255,255,255,0.03)', border: '1px solid transparent', cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s' }}
                      onMouseEnter={e => { e.currentTarget.style.background = 'rgba(212,149,43,0.08)'; e.currentTarget.style.borderColor = 'rgba(212,149,43,0.25)' }}
                      onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; e.currentTarget.style.borderColor = 'transparent' }}
                    >
                      <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.8)', fontWeight: 500 }}>{q.query}</span>
                      <span style={{ fontSize: 10, color: '#D4952B', fontWeight: 600, flexShrink: 0, marginLeft: 8 }}>
                        {q.value === 'Breakout' ? '🚀 Breakout' : `+${q.value}%`}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {trendData.topQueries.length > 0 && (
              <div style={cardStyle} className="p-5">
                <p style={{ fontSize: 10, fontWeight: 600, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>📊 Top Suchanfragen</p>
                <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.25)', marginBottom: 16 }}>Dauerhaft beliebteste Themen</p>
                <div className="space-y-3">
                  {trendData.topQueries.map((q, i) => {
                    const pct = Math.round((q.value / 100) * 100)
                    return (
                      <button
                        key={i}
                        onClick={() => handleSearch(q.query)}
                        style={{ width: '100%', textAlign: 'left', cursor: 'pointer', background: 'none', border: 'none', padding: 0 }}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.75)' }}>{q.query}</span>
                          <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)' }}>{q.value}</span>
                        </div>
                        <div style={{ height: 4, background: 'rgba(255,255,255,0.07)', borderRadius: 999, overflow: 'hidden' }}>
                          <div style={{ height: '100%', background: '#D4952B', borderRadius: 999, width: `${pct}%` }} />
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
            <div style={cardStyle} className="p-5">
              <p style={{ fontSize: 10, fontWeight: 600, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 12 }}>Verwandte Themen mit Momentum</p>
              <div className="flex flex-wrap gap-2">
                {trendData.risingTopics.map((t, i) => (
                  <button
                    key={i}
                    onClick={() => handleSearch(t.title)}
                    style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 14px', borderRadius: 999, border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.03)', fontSize: 12, color: 'rgba(255,255,255,0.6)', cursor: 'pointer', transition: 'all 0.15s' }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(212,149,43,0.4)'; e.currentTarget.style.color = '#D4952B' }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = 'rgba(255,255,255,0.6)' }}
                  >
                    {t.title}
                    {t.type && <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)' }}>· {t.type}</span>}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* CREATE POST Section */}
          <div style={cardStyleHighlight} className="p-5">
            <p style={{ fontSize: 14, fontWeight: 700, color: 'rgba(255,255,255,0.9)', marginBottom: 4 }}>Post aus diesem Trend erstellen</p>
            <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)', marginBottom: 16 }}>
              Wähle einen Creator — Perplexity recherchiert aktuelle Infos zu <span style={{ fontWeight: 600, color: 'rgba(255,255,255,0.7)' }}>"{trendData.keyword}"</span> und GPT schreibt den Post in seinem Stil.
            </p>

            {savedCreators.length === 0 ? (
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', background: 'rgba(255,255,255,0.03)', borderRadius: 12, padding: 16, textAlign: 'center' }}>
                Noch keine Creators gespeichert. Analysiere einen Creator im Tab "Creator-Analyse" und speichere ihn.
              </div>
            ) : (
              <div className="space-y-3">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {savedCreators.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => setSelectedCreator(selectedCreator?.id === c.id ? null : c)}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 10, padding: 12, borderRadius: 12,
                        border: selectedCreator?.id === c.id ? '1px solid #D4952B' : '1px solid rgba(255,255,255,0.08)',
                        background: selectedCreator?.id === c.id ? 'rgba(212,149,43,0.1)' : 'rgba(255,255,255,0.03)',
                        cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s',
                      }}
                    >
                      <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'rgba(212,149,43,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', flexShrink: 0 }}>
                        {c.avatarUrl ? (
                          <img src={c.avatarUrl} alt={c.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                          <span style={{ fontSize: 12, fontWeight: 700, color: '#D4952B' }}>{c.name?.charAt(0)}</span>
                        )}
                      </div>
                      <div className="min-w-0">
                        <p style={{ fontSize: 12, fontWeight: 600, color: selectedCreator?.id === c.id ? '#D4952B' : 'rgba(255,255,255,0.8)' }} className="truncate">{c.name}</p>
                        <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)' }}>{c.postsPerWeek} Posts/W</p>
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
                    style={{ width: '100%', padding: '12px 20px', background: '#D4952B', color: '#0a0a0a', border: 'none', borderRadius: 999, fontSize: 14, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
                  >
                    <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
          <div style={{ width: 64, height: 64, borderRadius: 20, background: 'rgba(212,149,43,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="32" height="32" fill="none" stroke="#D4952B" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          </div>
          <div>
            <p style={{ color: 'rgba(255,255,255,0.85)', fontWeight: 500 }}>Finde trendende Themen</p>
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.35)', marginTop: 6, maxWidth: 320 }}>
              Gib einen Begriff ein oder wähle einen Vorschlag — sieh sofort ob das Thema gerade steigt oder fällt
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
