export default function CreatorReport({ report, isLoading, error, username }) {
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

      {/* Creator Header */}
      {creator && (
        <div className="bg-white rounded-2xl border border-[#E8E4DD] p-5 flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#FEF3C7] flex items-center justify-center flex-shrink-0">
            <span className="text-lg font-bold text-[#D97706]">
              {creator.name?.charAt(0) || '?'}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-base font-semibold text-[#2D2B28] truncate">{creator.name}</h2>
            {creator.handle && <p className="text-xs text-[#A39E93]">{creator.handle}</p>}
            {creator.headline && <p className="text-xs text-[#6B6560] mt-1 line-clamp-2">{creator.headline}</p>}
          </div>
          {creator.followers && (
            <div className="text-right flex-shrink-0">
              <p className="text-lg font-bold text-[#2D2B28]">{creator.followers}</p>
              <p className="text-[10px] text-[#A39E93] uppercase tracking-wide">Follower</p>
            </div>
          )}
        </div>
      )}

      {/* Stats Bar */}
      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: 'Posts / Woche', value: stats.postsPerWeek ?? '–' },
            { label: 'Posting-Zeit', value: stats.mainPostingTime ?? '–' },
            { label: 'Avg. Reactions', value: stats.avgReactions ? stats.avgReactions.toLocaleString() : '–' },
            { label: 'CTA-Frequenz', value: stats.ctaFrequency ?? '–' },
          ].map((s) => (
            <div key={s.label} className="bg-white rounded-xl border border-[#E8E4DD] p-4 text-center">
              <p className="text-xl font-bold text-[#2D2B28]">{s.value}</p>
              <p className="text-[10px] text-[#A39E93] uppercase tracking-wide mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      )}

      {/* #1 Success Factor */}
      {successFactor && (
        <div className="bg-white rounded-2xl border border-[#E8E4DD] p-5">
          <p className="text-[10px] font-semibold text-[#D97706] uppercase tracking-widest mb-2">#1 Erfolgsfaktor</p>
          <p className="text-sm text-[#2D2B28] leading-relaxed">{successFactor}</p>
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
