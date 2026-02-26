export default function CreatorReport({ report, isLoading, error, username, onSave, isSaved }) {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4">
        <div className="w-10 h-10 border-2 border-[#D97706] border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-[#A39E93]">Analysiere Creator-Profil…</p>
        <p className="text-xs text-[#C4BFB6]">Das dauert ca. 20–30 Sekunden</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-3">
        <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center">
          <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <p className="text-sm text-red-500">{error}</p>
      </div>
    )
  }

  if (!report) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
        <div className="w-16 h-16 rounded-2xl bg-[#FEF3C7] flex items-center justify-center">
          <svg className="w-8 h-8 text-[#D97706]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
        <div>
          <p className="text-[#2D2B28] font-medium">Creator analysieren</p>
          <p className="text-sm text-[#A39E93] mt-1">Gib einen LinkedIn-Usernamen ein und erhalte einen vollständigen Strategy-Report</p>
        </div>
        <div className="mt-2 grid grid-cols-2 gap-3 max-w-sm text-left">
          {['#1 Erfolgsfaktor', 'Format-Auswertung', 'Inhalts-Säulen', 'Taktiken zum Stehlen'].map((item) => (
            <div key={item} className="flex items-center gap-2 text-xs text-[#6B6560]">
              <div className="w-1.5 h-1.5 rounded-full bg-[#D97706] flex-shrink-0" />
              {item}
            </div>
          ))}
        </div>
      </div>
    )
  }

  const { creator, stats, successFactor, formatBreakdown, contentPillars, tactics, topPosts } = report

  const weightedAvg = stats?.avgWeightedScore || 0

  return (
    <div className="space-y-5">

      {/* Creator Header — wie im PDF */}
      {creator && (
        <div className="bg-white rounded-2xl border border-[#E8E4DD] p-6">
          <p className="text-[10px] font-semibold text-[#A39E93] uppercase tracking-widest mb-4">Content Strategy</p>
          <div className="flex items-start gap-4">
            {/* Avatar */}
            <div className="w-16 h-16 rounded-full bg-[#E8E4DD] flex items-center justify-center flex-shrink-0 overflow-hidden">
              {creator.avatarUrl ? (
                <img src={creator.avatarUrl} alt={creator.name} className="w-full h-full object-cover" />
              ) : (
                <span className="text-2xl font-bold text-[#6B6560]">
                  {creator.name?.charAt(0) || '?'}
                </span>
              )}
            </div>
            {/* Info */}
            <div className="flex-1 min-w-0">
              <h2 className="text-2xl font-bold text-[#2D2B28] leading-tight">{creator.name}</h2>
              {creator.headline && (
                <p className="text-sm text-[#6B6560] mt-1 leading-relaxed">{creator.headline}</p>
              )}
              <div className="flex items-center gap-3 mt-2">
                {creator.followers && (
                  <span className="text-sm font-semibold text-[#2D2B28]">{creator.followers} Follower</span>
                )}
                {creator.profileUrl && (
                  <a href={creator.profileUrl} target="_blank" rel="noopener noreferrer"
                    className="text-sm text-[#D97706] hover:underline font-medium">
                    Profil ansehen
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Speichern-Button */}
          {onSave && (
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => onSave(report, username)}
                disabled={isSaved}
                className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
                  isSaved
                    ? 'bg-green-50 text-green-700 border border-green-200 cursor-default'
                    : 'bg-[#D97706] text-white hover:bg-[#B45309]'
                }`}
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

          {/* Stats — direkt im Header-Card */}
          {stats && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-0 mt-6 pt-5 border-t border-[#F0EDE8] divide-x divide-[#F0EDE8]">
              {[
                { label: 'Posts / Woche', value: stats.postsPerWeek ?? '–' },
                { label: 'Beste Uhrzeit', value: stats.postingTime ? stats.postingTime.replace(' UTC','') : (stats.mainPostingTime ?? '–') },
                { label: 'Avg. Reactions', value: stats.avgReactions ? stats.avgReactions.toLocaleString() : '–' },
                { label: 'CTA-Frequenz', value: stats.ctaFrequency ?? '–' },
              ].map((s) => (
                <div key={s.label} className="text-center px-4 first:pl-0 last:pr-0">
                  <p className="text-2xl font-bold text-[#2D2B28] leading-none">{s.value}</p>
                  <p className="text-[10px] text-[#A39E93] uppercase tracking-wider mt-2">{s.label}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* #1 Success Factor — mit blauem linken Rand wie im PDF */}
      {successFactor && (
        <div className="bg-white rounded-2xl border border-[#E8E4DD] p-6">
          <p className="text-[10px] font-bold text-[#D97706] uppercase tracking-widest mb-3">#1 Erfolgsfaktor</p>
          <div className="border-l-4 border-[#D97706] pl-4">
            <p className="text-sm text-[#2D2B28] leading-relaxed">{successFactor}</p>
          </div>
        </div>
      )}

      {/* Format Breakdown + Content Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        {/* Format Breakdown */}
        {formatBreakdown && formatBreakdown.length > 0 && (
          <div className="bg-white rounded-2xl border border-[#E8E4DD] p-5">
            <p className="text-xs font-semibold text-[#6B6560] uppercase tracking-wider mb-4">Format-Auswertung</p>
            <div className="space-y-3">
              {formatBreakdown.map((f) => (
                <div key={f.format}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-medium text-[#2D2B28]">{f.format}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-[#A39E93]">{f.avgReactions ? `⌀ ${f.avgReactions.toLocaleString()} Reactions` : ''}</span>
                      <span className="text-xs font-bold text-[#D97706]">{f.percentage}%</span>
                    </div>
                  </div>
                  <div className="h-1.5 bg-[#F0EDE8] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#D97706] rounded-full transition-all"
                      style={{ width: `${f.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Content Pillars */}
        {contentPillars && contentPillars.length > 0 && (
          <div className="bg-white rounded-2xl border border-[#E8E4DD] p-5">
            <p className="text-xs font-semibold text-[#6B6560] uppercase tracking-wider mb-4">Inhalts-Säulen</p>
            <div className="space-y-3">
              {contentPillars.map((p) => (
                <div key={p.pillar}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-medium text-[#2D2B28] truncate pr-2">{p.pillar}</span>
                    <span className="text-xs font-bold text-[#D97706] flex-shrink-0">{p.percentage}%</span>
                  </div>
                  <div className="h-1.5 bg-[#F0EDE8] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#2D2B28] rounded-full transition-all"
                      style={{ width: `${p.percentage}%` }}
                    />
                  </div>
                  {p.insight && (
                    <p className="text-[10px] text-[#A39E93] mt-1 leading-relaxed">{p.insight}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Tactics */}
      {tactics && tactics.length > 0 && (
        <div className="bg-white rounded-2xl border border-[#E8E4DD] p-5">
          <p className="text-xs font-semibold text-[#6B6560] uppercase tracking-wider mb-4">
            {tactics.length} Taktiken zum Stehlen
          </p>
          <div className="space-y-4">
            {tactics.map((t, i) => (
              <div key={i} className="flex gap-4">
                <div className="w-7 h-7 rounded-lg bg-[#2D2B28] text-white text-xs font-bold flex items-center justify-center flex-shrink-0">
                  {String(t.number || i + 1).padStart(2, '0')}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-[#2D2B28]">{t.title}</p>
                  {t.description && <p className="text-xs text-[#6B6560] mt-1 leading-relaxed">{t.description}</p>}
                  {t.howToCopy && (
                    <p className="text-xs text-[#D97706] mt-1.5 leading-relaxed">
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
        <div className="bg-white rounded-2xl border border-[#E8E4DD] p-5">
          <p className="text-xs font-semibold text-[#6B6560] uppercase tracking-wider mb-1">Posting-Zeiten</p>
          {stats.postingDay && (
            <p className="text-xs text-[#A39E93] mb-4">
              Häufigster Tag: <span className="font-semibold text-[#2D2B28]">{stats.postingDay}</span>
              {stats.postingTime && <> · Häufigste Uhrzeit: <span className="font-semibold text-[#2D2B28]">{stats.postingTime.replace(' UTC', ' Uhr (UTC)')}</span></>}
            </p>
          )}
          {/* Stunden-Balkendiagramm */}
          <div className="flex items-end gap-px h-16">
            {stats.hourDistribution.map(({ hour, count }) => {
              const max = Math.max(...stats.hourDistribution.map(h => h.count), 1)
              const pct = Math.round((count / max) * 100)
              return (
                <div key={hour} className="flex-1 flex flex-col items-center gap-0.5 group relative">
                  <div
                    className={`w-full rounded-t-sm transition-all ${count > 0 ? 'bg-[#D97706]' : 'bg-[#F0EDE8]'}`}
                    style={{ height: `${Math.max(pct, count > 0 ? 8 : 2)}%` }}
                  />
                  {/* Tooltip */}
                  {count > 0 && (
                    <div className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 bg-[#2D2B28] text-white text-[9px] px-1.5 py-0.5 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none z-10">
                      {String(hour).padStart(2,'0')}:00 · {count}×
                    </div>
                  )}
                </div>
              )
            })}
          </div>
          {/* X-Achse: alle 6 Stunden */}
          <div className="flex justify-between mt-1 px-0">
            {[0,6,12,18,23].map(h => (
              <span key={h} className="text-[9px] text-[#C4BFB6]">{String(h).padStart(2,'0')}h</span>
            ))}
          </div>
          {/* Wochentag-Balken */}
          {stats.weekdayDistribution?.some(d => d.count > 0) && (
            <div className="mt-5">
              <p className="text-[10px] text-[#A39E93] uppercase tracking-wider mb-3">Wochentage</p>
              <div className="space-y-1.5">
                {stats.weekdayDistribution.map(({ day, count }) => {
                  const max = Math.max(...stats.weekdayDistribution.map(d => d.count), 1)
                  const pct = Math.round((count / max) * 100)
                  return (
                    <div key={day} className="flex items-center gap-2">
                      <span className="text-[10px] text-[#6B6560] w-16 flex-shrink-0">{day.slice(0,2)}</span>
                      <div className="flex-1 h-2 bg-[#F0EDE8] rounded-full overflow-hidden">
                        <div className="h-full bg-[#D97706] rounded-full" style={{ width: `${pct}%` }} />
                      </div>
                      <span className="text-[10px] text-[#A39E93] w-4 text-right">{count}</span>
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
        <div className="bg-white rounded-2xl border border-[#E8E4DD] p-5">
          <p className="text-xs font-semibold text-[#6B6560] uppercase tracking-wider mb-4">Top Beiträge</p>
          <div className="space-y-3">
            {topPosts.map((post, i) => (
              <div key={i} className="flex gap-4 py-3 border-b border-[#F0EDE8] last:border-0">
                <div className="text-2xl font-bold text-[#E8E4DD] w-8 flex-shrink-0 leading-none pt-0.5">
                  {post.rank || i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-[#2D2B28] line-clamp-2">{post.title}</p>
                  {post.summary && (
                    <p className="text-xs text-[#6B6560] mt-1 line-clamp-2 leading-relaxed">{post.summary}</p>
                  )}
                  <div className="flex items-center gap-3 mt-2 flex-wrap">
                    {post.likes != null && (
                      <span className="text-[10px] text-[#A39E93]">♥ {post.likes.toLocaleString()}</span>
                    )}
                    {post.comments != null && (
                      <span className="text-[10px] text-[#A39E93]">💬 {post.comments.toLocaleString()}</span>
                    )}
                    {post.shares != null && (
                      <span className="text-[10px] text-[#A39E93]">↗ {post.shares.toLocaleString()}</span>
                    )}
                    {post.weightedScore != null && (
                      <span className="text-[10px] font-medium text-[#6B6560]">
                        Score: {post.weightedScore.toLocaleString()}
                      </span>
                    )}
                    {post.relativeScore != null && (
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${
                        post.relativeScore >= 2
                          ? 'bg-green-50 text-green-700'
                          : post.relativeScore >= 1
                          ? 'bg-[#FEF3C7] text-[#92400E]'
                          : 'bg-[#F0EDE8] text-[#A39E93]'
                      }`}>
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
