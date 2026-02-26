const card = {
  background: 'rgba(255,255,255,0.03)',
  border: '1px solid rgba(255,255,255,0.07)',
  borderRadius: 16,
}

export default function CreatorReport({ report, isLoading, error, username, onSave, isSaved }) {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4">
        <div className="w-10 h-10 border-2 border-[#D4952B] border-t-transparent rounded-full animate-spin" />
        <p className="text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>Analysiere Creator-Profil…</p>
        <p className="text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>Das dauert ca. 20–30 Sekunden</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-3">
        <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: 'rgba(239,68,68,0.1)' }}>
          <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <p className="text-sm text-red-400">{error}</p>
      </div>
    )
  }

  if (!report) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
        <div className="w-16 h-16 rounded-2xl flex items-center justify-center" style={{ background: 'rgba(212,149,43,0.12)', border: '1px solid rgba(212,149,43,0.2)' }}>
          <svg className="w-8 h-8" style={{ color: '#D4952B' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
        <div>
          <p className="font-medium" style={{ color: 'rgba(255,255,255,0.85)' }}>Creator analysieren</p>
          <p className="text-sm mt-1" style={{ color: 'rgba(255,255,255,0.4)' }}>Gib einen LinkedIn-Usernamen ein und erhalte einen vollständigen Strategy-Report</p>
        </div>
        <div className="mt-2 grid grid-cols-2 gap-3 max-w-sm text-left">
          {['#1 Erfolgsfaktor', 'Format-Auswertung', 'Inhalts-Säulen', 'Taktiken zum Stehlen'].map((item) => (
            <div key={item} className="flex items-center gap-2 text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>
              <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: '#D4952B' }} />
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
          <p style={{ fontSize: 10, fontWeight: 600, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 16 }}>Content Strategy</p>
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
              {creator.avatarUrl ? (
                <img src={creator.avatarUrl} alt={creator.name} className="w-full h-full object-cover" />
              ) : (
                <span className="text-2xl font-bold" style={{ color: 'rgba(255,255,255,0.5)' }}>
                  {creator.name?.charAt(0) || '?'}
                </span>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-2xl font-bold leading-tight" style={{ color: 'rgba(255,255,255,0.9)' }}>{creator.name}</h2>
              {creator.headline && (
                <p className="text-sm mt-1 leading-relaxed" style={{ color: 'rgba(255,255,255,0.45)' }}>{creator.headline}</p>
              )}
              <div className="flex items-center gap-3 mt-2">
                {creator.followers && (
                  <span className="text-sm font-semibold" style={{ color: 'rgba(255,255,255,0.75)' }}>{creator.followers} Follower</span>
                )}
                {creator.profileUrl && (
                  <a href={creator.profileUrl} target="_blank" rel="noopener noreferrer"
                    className="text-sm font-medium hover:underline" style={{ color: '#D4952B' }}>
                    Profil ansehen
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
                className="flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl transition-all cursor-pointer"
                style={isSaved
                  ? { background: 'rgba(34,197,94,0.1)', color: '#4ade80', border: '1px solid rgba(34,197,94,0.2)', cursor: 'default' }
                  : { background: '#D4952B', color: '#0a0a0a' }
                }
              >
                {isSaved ? (
                  <>
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Gespeichert
                  </>
                ) : (
                  <>
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                    </svg>
                    Creator speichern
                  </>
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
                <div key={s.label} className="text-center px-4 first:pl-0 last:pr-0" style={i > 0 ? { borderLeft: '1px solid rgba(255,255,255,0.07)' } : {}}>
                  <p className="text-2xl font-bold leading-none" style={{ color: 'rgba(255,255,255,0.9)' }}>{s.value}</p>
                  <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.06em', marginTop: 8 }}>{s.label}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* #1 Success Factor */}
      {successFactor && (
        <div style={card} className="p-6">
          <p style={{ fontSize: 10, fontWeight: 700, color: '#D4952B', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 12 }}>#1 Erfolgsfaktor</p>
          <div style={{ borderLeft: '3px solid #D4952B', paddingLeft: 16 }}>
            <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.75)' }}>{successFactor}</p>
          </div>
        </div>
      )}

      {/* Format Breakdown + Content Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        {formatBreakdown && formatBreakdown.length > 0 && (
          <div style={card} className="p-5">
            <p style={{ fontSize: 10, fontWeight: 600, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 16 }}>Format-Auswertung</p>
            <div className="space-y-3">
              {formatBreakdown.map((f) => (
                <div key={f.format}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-medium" style={{ color: 'rgba(255,255,255,0.75)' }}>{f.format}</span>
                    <div className="flex items-center gap-2">
                      <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)' }}>{f.avgReactions ? `⌀ ${f.avgReactions.toLocaleString()}` : ''}</span>
                      <span className="text-xs font-bold" style={{ color: '#D4952B' }}>{f.percentage}%</span>
                    </div>
                  </div>
                  <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.07)' }}>
                    <div className="h-full rounded-full transition-all" style={{ width: `${f.percentage}%`, background: '#D4952B' }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {contentPillars && contentPillars.length > 0 && (
          <div style={card} className="p-5">
            <p style={{ fontSize: 10, fontWeight: 600, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 16 }}>Inhalts-Säulen</p>
            <div className="space-y-3">
              {contentPillars.map((p) => (
                <div key={p.pillar}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-medium truncate pr-2" style={{ color: 'rgba(255,255,255,0.75)' }}>{p.pillar}</span>
                    <span className="text-xs font-bold flex-shrink-0" style={{ color: '#D4952B' }}>{p.percentage}%</span>
                  </div>
                  <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.07)' }}>
                    <div className="h-full rounded-full transition-all" style={{ width: `${p.percentage}%`, background: 'rgba(255,255,255,0.25)' }} />
                  </div>
                  {p.insight && (
                    <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', marginTop: 4, lineHeight: 1.5 }}>{p.insight}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Tactics */}
      {tactics && tactics.length > 0 && (
        <div style={card} className="p-5">
          <p style={{ fontSize: 10, fontWeight: 600, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 16 }}>
            {tactics.length} Taktiken zum Stehlen
          </p>
          <div className="space-y-4">
            {tactics.map((t, i) => (
              <div key={i} className="flex gap-4">
                <div className="w-7 h-7 rounded-lg text-xs font-bold flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(212,149,43,0.15)', color: '#D4952B' }}>
                  {String(t.number || i + 1).padStart(2, '0')}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold" style={{ color: 'rgba(255,255,255,0.85)' }}>{t.title}</p>
                  {t.description && <p className="text-xs mt-1 leading-relaxed" style={{ color: 'rgba(255,255,255,0.45)' }}>{t.description}</p>}
                  {t.howToCopy && (
                    <p className="text-xs mt-1.5 leading-relaxed" style={{ color: '#D4952B' }}>
                      <span className="font-medium">So kopieren: </span>{t.howToCopy}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Posting-Zeit Chart */}
      {stats?.hourDistribution?.some(h => h.count > 0) && (
        <div style={card} className="p-5">
          <p style={{ fontSize: 10, fontWeight: 600, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>Posting-Zeiten</p>
          {stats.postingDay && (
            <p className="text-xs mb-4" style={{ color: 'rgba(255,255,255,0.3)' }}>
              Häufigster Tag: <span className="font-semibold" style={{ color: 'rgba(255,255,255,0.7)' }}>{stats.postingDay}</span>
              {stats.postingTime && <> · Häufigste Uhrzeit: <span className="font-semibold" style={{ color: 'rgba(255,255,255,0.7)' }}>{stats.postingTime.replace(' UTC', ' Uhr (UTC)')}</span></>}
            </p>
          )}
          <div className="flex items-end gap-px h-16">
            {stats.hourDistribution.map(({ hour, count }) => {
              const max = Math.max(...stats.hourDistribution.map(h => h.count), 1)
              const pct = Math.round((count / max) * 100)
              return (
                <div key={hour} className="flex-1 flex flex-col items-center gap-0.5 group relative">
                  <div
                    className="w-full rounded-t-sm transition-all"
                    style={{ height: `${Math.max(pct, count > 0 ? 8 : 2)}%`, background: count > 0 ? '#D4952B' : 'rgba(255,255,255,0.07)' }}
                  />
                  {count > 0 && (
                    <div className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 text-white text-[9px] px-1.5 py-0.5 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none z-10" style={{ background: 'rgba(0,0,0,0.8)' }}>
                      {String(hour).padStart(2,'0')}:00 · {count}×
                    </div>
                  )}
                </div>
              )
            })}
          </div>
          <div className="flex justify-between mt-1">
            {[0,6,12,18,23].map(h => (
              <span key={h} style={{ fontSize: 9, color: 'rgba(255,255,255,0.25)' }}>{String(h).padStart(2,'0')}h</span>
            ))}
          </div>
          {stats.weekdayDistribution?.some(d => d.count > 0) && (
            <div className="mt-5">
              <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 12 }}>Wochentage</p>
              <div className="space-y-1.5">
                {stats.weekdayDistribution.map(({ day, count }) => {
                  const max = Math.max(...stats.weekdayDistribution.map(d => d.count), 1)
                  const pct = Math.round((count / max) * 100)
                  return (
                    <div key={day} className="flex items-center gap-2">
                      <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', width: 64, flexShrink: 0 }}>{day.slice(0,2)}</span>
                      <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.07)' }}>
                        <div className="h-full rounded-full" style={{ width: `${pct}%`, background: '#D4952B' }} />
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
          <p style={{ fontSize: 10, fontWeight: 600, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 16 }}>Top Beiträge</p>
          <div className="space-y-3">
            {topPosts.map((post, i) => (
              <div key={i} className="flex gap-4 py-3" style={i < topPosts.length - 1 ? { borderBottom: '1px solid rgba(255,255,255,0.06)' } : {}}>
                <div className="text-2xl font-bold w-8 flex-shrink-0 leading-none pt-0.5" style={{ color: 'rgba(255,255,255,0.1)' }}>
                  {post.rank || i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold line-clamp-2" style={{ color: 'rgba(255,255,255,0.85)' }}>{post.title}</p>
                  {post.summary && (
                    <p className="text-xs mt-1 line-clamp-2 leading-relaxed" style={{ color: 'rgba(255,255,255,0.4)' }}>{post.summary}</p>
                  )}
                  <div className="flex items-center gap-3 mt-2 flex-wrap">
                    {post.likes != null && <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)' }}>♥ {post.likes.toLocaleString()}</span>}
                    {post.comments != null && <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)' }}>💬 {post.comments.toLocaleString()}</span>}
                    {post.shares != null && <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)' }}>↗ {post.shares.toLocaleString()}</span>}
                    {post.weightedScore != null && <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)' }}>Score: {post.weightedScore.toLocaleString()}</span>}
                    {post.relativeScore != null && (
                      <span style={{
                        fontSize: 10, fontWeight: 700, padding: '2px 6px', borderRadius: 6,
                        background: post.relativeScore >= 2 ? 'rgba(34,197,94,0.1)' : post.relativeScore >= 1 ? 'rgba(212,149,43,0.15)' : 'rgba(255,255,255,0.06)',
                        color: post.relativeScore >= 2 ? '#4ade80' : post.relativeScore >= 1 ? '#D4952B' : 'rgba(255,255,255,0.35)',
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
