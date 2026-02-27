const card = {
  background: 'rgba(255,255,255,0.04)',
  border: '1px solid rgba(255,255,255,0.07)',
  borderRadius: 16,
}

const label = {
  fontSize: 10,
  fontWeight: 600,
  color: 'rgba(255,255,255,0.35)',
  textTransform: 'uppercase',
  letterSpacing: '0.06em',
}

const GOLD = '#D4952B'

export default function CreatorReport({ report, isLoading, error, username, onSave, isSaved }) {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4">
        <div className="w-10 h-10 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: `${GOLD} transparent transparent transparent` }} />
        <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)' }}>Analysiere Creator-Profil…</p>
        <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)' }}>Das dauert ca. 20–30 Sekunden</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-3">
        <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: 'rgba(239,68,68,0.1)' }}>
          <svg className="w-5 h-5" fill="none" stroke="#ef4444" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <p style={{ fontSize: 13, color: '#ef4444' }}>{error}</p>
      </div>
    )
  }

  if (!report) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
        <div className="w-16 h-16 rounded-2xl flex items-center justify-center" style={{ background: 'rgba(212,149,43,0.12)' }}>
          <svg className="w-8 h-8" fill="none" stroke={GOLD} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
        <div>
          <p style={{ fontSize: 15, fontWeight: 600, color: 'rgba(255,255,255,0.85)' }}>Creator analysieren</p>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', marginTop: 4 }}>Gib einen LinkedIn-Usernamen ein und erhalte einen vollständigen Strategy-Report</p>
        </div>
        <div className="mt-2 grid grid-cols-2 gap-3 max-w-sm text-left">
          {['#1 Erfolgsfaktor', 'Format-Auswertung', 'Inhalts-Säulen', 'Taktiken zum Stehlen'].map((item) => (
            <div key={item} className="flex items-center gap-2" style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>
              <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: GOLD }} />
              {item}
            </div>
          ))}
        </div>
      </div>
    )
  }

  const { creator, stats, successFactor, formatBreakdown, contentPillars, tactics, topPosts } = report

  return (
    <div className="space-y-4">

      {/* Creator Header */}
      {creator && (
        <div style={card} className="p-6">
          <p style={label} className="mb-4">Content Strategy</p>
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)', border: '2px solid rgba(212,149,43,0.3)' }}>
              {creator.avatarUrl ? (
                <img src={creator.avatarUrl} alt={creator.name} className="w-full h-full object-cover" />
              ) : (
                <span style={{ fontSize: 24, fontWeight: 700, color: GOLD }}>{creator.name?.charAt(0) || '?'}</span>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h2 style={{ fontSize: 22, fontWeight: 700, color: 'rgba(255,255,255,0.9)', lineHeight: 1.2 }}>{creator.name}</h2>
              {creator.headline && (
                <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', marginTop: 4, lineHeight: 1.5 }}>{creator.headline}</p>
              )}
              <div className="flex items-center gap-4 mt-2">
                {creator.followers && (
                  <span style={{ fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.7)' }}>{creator.followers} Follower</span>
                )}
                {creator.profileUrl && (
                  <a href={creator.profileUrl} target="_blank" rel="noopener noreferrer"
                    style={{ fontSize: 13, color: GOLD, fontWeight: 500, textDecoration: 'none' }}>
                    Profil ansehen ↗
                  </a>
                )}
              </div>
            </div>
          </div>

          {onSave && (
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => onSave(report, username)}
                disabled={isSaved}
                style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  padding: '8px 16px', borderRadius: 10, fontSize: 12, fontWeight: 600,
                  cursor: isSaved ? 'default' : 'pointer', border: 'none',
                  background: isSaved ? 'rgba(34,197,94,0.12)' : GOLD,
                  color: isSaved ? '#4ade80' : '#0a0a0a',
                  transition: 'all 0.15s',
                }}
              >
                {isSaved ? (
                  <><svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>Gespeichert</>
                ) : (
                  <><svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" /></svg>Creator speichern</>
                )}
              </button>
            </div>
          )}

          {stats && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-0 mt-6 pt-5" style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
              {[
                { label: 'Posts / Woche', value: stats.postsPerWeek ?? '–' },
                { label: 'Beste Uhrzeit', value: stats.postingTime ? stats.postingTime.replace(' UTC','') : (stats.mainPostingTime ?? '–') },
                { label: 'Avg. Reactions', value: stats.avgReactions ? stats.avgReactions.toLocaleString() : '–' },
                { label: 'CTA-Frequenz', value: stats.ctaFrequency ?? '–' },
              ].map((s, i) => (
                <div key={s.label} className="text-center px-4 first:pl-0 last:pr-0" style={{ borderLeft: i > 0 ? '1px solid rgba(255,255,255,0.07)' : 'none' }}>
                  <p style={{ fontSize: 22, fontWeight: 700, color: 'rgba(255,255,255,0.9)', lineHeight: 1 }}>{s.value}</p>
                  <p style={{ ...label, marginTop: 8 }}>{s.label}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* #1 Erfolgsfaktor */}
      {successFactor && (
        <div style={card} className="p-6">
          <p style={{ ...label, color: GOLD, marginBottom: 12 }}>#1 Erfolgsfaktor</p>
          <div style={{ borderLeft: `3px solid ${GOLD}`, paddingLeft: 16 }}>
            <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.8)', lineHeight: 1.6 }}>{successFactor}</p>
          </div>
        </div>
      )}

      {/* Format + Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {formatBreakdown && formatBreakdown.length > 0 && (
          <div style={card} className="p-5">
            <p style={{ ...label, marginBottom: 16 }}>Format-Auswertung</p>
            <div className="space-y-3">
              {formatBreakdown.map((f) => (
                <div key={f.format}>
                  <div className="flex justify-between items-center mb-1.5">
                    <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.75)', fontWeight: 500 }}>{f.format}</span>
                    <div className="flex items-center gap-2">
                      {f.avgReactions > 0 && <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)' }}>⌀ {f.avgReactions.toLocaleString()}</span>}
                      <span style={{ fontSize: 12, fontWeight: 700, color: GOLD }}>{f.percentage}%</span>
                    </div>
                  </div>
                  <div style={{ height: 4, background: 'rgba(255,255,255,0.07)', borderRadius: 999, overflow: 'hidden' }}>
                    <div style={{ height: '100%', background: GOLD, borderRadius: 999, width: `${f.percentage}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {contentPillars && contentPillars.length > 0 && (
          <div style={card} className="p-5">
            <p style={{ ...label, marginBottom: 16 }}>Inhalts-Säulen</p>
            <div className="space-y-3">
              {contentPillars.map((p) => (
                <div key={p.pillar}>
                  <div className="flex justify-between items-center mb-1.5">
                    <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.75)', fontWeight: 500 }} className="truncate pr-2">{p.pillar}</span>
                    <span style={{ fontSize: 12, fontWeight: 700, color: GOLD, flexShrink: 0 }}>{p.percentage}%</span>
                  </div>
                  <div style={{ height: 4, background: 'rgba(255,255,255,0.07)', borderRadius: 999, overflow: 'hidden' }}>
                    <div style={{ height: '100%', background: 'rgba(255,255,255,0.3)', borderRadius: 999, width: `${p.percentage}%` }} />
                  </div>
                  {p.insight && <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', marginTop: 4, lineHeight: 1.5 }}>{p.insight}</p>}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Taktiken */}
      {tactics && tactics.length > 0 && (
        <div style={card} className="p-5">
          <p style={{ ...label, marginBottom: 16 }}>{tactics.length} Taktiken zum Stehlen</p>
          <div className="space-y-4">
            {tactics.map((t, i) => (
              <div key={i} className="flex gap-4">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(212,149,43,0.15)', border: '1px solid rgba(212,149,43,0.3)' }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: GOLD }}>{String(t.number || i + 1).padStart(2, '0')}</span>
                </div>
                <div className="flex-1">
                  <p style={{ fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.85)' }}>{t.title}</p>
                  {t.description && <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', marginTop: 4, lineHeight: 1.5 }}>{t.description}</p>}
                  {t.howToCopy && (
                    <p style={{ fontSize: 12, color: GOLD, marginTop: 6, lineHeight: 1.5 }}>
                      <span style={{ fontWeight: 600 }}>So kopieren: </span>{t.howToCopy}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Posting-Zeiten */}
      {stats?.hourDistribution?.some(h => h.count > 0) && (
        <div style={card} className="p-5">
          <p style={{ ...label, marginBottom: 4 }}>Posting-Zeiten</p>
          {stats.postingDay && (
            <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', marginBottom: 16 }}>
              Häufigster Tag: <span style={{ fontWeight: 600, color: 'rgba(255,255,255,0.6)' }}>{stats.postingDay}</span>
              {stats.postingTime && <> · Häufigste Uhrzeit: <span style={{ fontWeight: 600, color: 'rgba(255,255,255,0.6)' }}>{stats.postingTime.replace(' UTC', ' Uhr (UTC)')}</span></>}
            </p>
          )}
          <div className="flex items-end gap-px" style={{ height: 64 }}>
            {stats.hourDistribution.map(({ hour, count }) => {
              const max = Math.max(...stats.hourDistribution.map(h => h.count), 1)
              const pct = Math.round((count / max) * 100)
              return (
                <div key={hour} className="flex-1 flex flex-col items-center group relative">
                  <div
                    className="w-full rounded-t-sm transition-all"
                    style={{ height: `${Math.max(pct, count > 0 ? 8 : 2)}%`, background: count > 0 ? GOLD : 'rgba(255,255,255,0.06)' }}
                  />
                  {count > 0 && (
                    <div className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 text-[9px] px-1.5 py-0.5 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none z-10"
                      style={{ background: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.8)', backdropFilter: 'blur(8px)' }}>
                      {String(hour).padStart(2,'0')}:00 · {count}×
                    </div>
                  )}
                </div>
              )
            })}
          </div>
          <div className="flex justify-between mt-1">
            {[0,6,12,18,23].map(h => (
              <span key={h} style={{ fontSize: 9, color: 'rgba(255,255,255,0.2)' }}>{String(h).padStart(2,'0')}h</span>
            ))}
          </div>

          {stats.weekdayDistribution?.some(d => d.count > 0) && (
            <div className="mt-5">
              <p style={{ ...label, marginBottom: 12 }}>Wochentage</p>
              <div className="space-y-1.5">
                {stats.weekdayDistribution.map(({ day, count }) => {
                  const max = Math.max(...stats.weekdayDistribution.map(d => d.count), 1)
                  const pct = Math.round((count / max) * 100)
                  return (
                    <div key={day} className="flex items-center gap-2">
                      <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)', width: 64, flexShrink: 0 }}>{day.slice(0,2)}</span>
                      <div className="flex-1 rounded-full overflow-hidden" style={{ height: 4, background: 'rgba(255,255,255,0.07)' }}>
                        <div className="h-full rounded-full" style={{ width: `${pct}%`, background: GOLD }} />
                      </div>
                      <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', width: 16, textAlign: 'right' }}>{count}</span>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Top Beiträge */}
      {topPosts && topPosts.length > 0 && (
        <div style={card} className="p-5">
          <p style={{ ...label, marginBottom: 16 }}>Top Beiträge</p>
          <div className="space-y-1">
            {topPosts.map((post, i) => (
              <div key={i} className="flex gap-4 py-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ fontSize: 22, fontWeight: 700, color: 'rgba(255,255,255,0.1)', width: 32, flexShrink: 0, lineHeight: 1 }}>
                  {post.rank || i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p style={{ fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.8)' }} className="line-clamp-2">{post.title}</p>
                  {post.summary && (
                    <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', marginTop: 4, lineHeight: 1.5 }} className="line-clamp-2">{post.summary}</p>
                  )}
                  <div className="flex items-center gap-3 mt-2 flex-wrap">
                    {post.likes != null && <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)' }}>♥ {post.likes.toLocaleString()}</span>}
                    {post.comments != null && <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)' }}>💬 {post.comments.toLocaleString()}</span>}
                    {post.shares != null && <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)' }}>↗ {post.shares.toLocaleString()}</span>}
                    {post.relativeScore != null && (
                      <span style={{
                        fontSize: 10, fontWeight: 700, padding: '2px 6px', borderRadius: 6,
                        background: post.relativeScore >= 2 ? 'rgba(34,197,94,0.12)' : post.relativeScore >= 1 ? 'rgba(212,149,43,0.15)' : 'rgba(255,255,255,0.06)',
                        color: post.relativeScore >= 2 ? '#4ade80' : post.relativeScore >= 1 ? GOLD : 'rgba(255,255,255,0.3)',
                      }}>
                        {post.relativeScore.toFixed(1)}x
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
