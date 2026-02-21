export default function SavedCreators({ creators, onDelete, onViewReport, onUseForPost }) {
  if (creators.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
        <div className="w-16 h-16 rounded-2xl bg-[#FEF3C7] flex items-center justify-center">
          <svg className="w-8 h-8 text-[#D97706]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </div>
        <div>
          <p className="text-[#2D2B28] font-medium">Noch keine Creators gespeichert</p>
          <p className="text-sm text-[#A39E93] mt-1">
            Analysiere einen Creator im Tab "Creator-Analyse" und speichere ihn hier
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-[#2D2B28]">
          {creators.length} gespeicherte {creators.length === 1 ? 'Creator' : 'Creators'}
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {creators.map((c) => (
          <div key={c.id} className="bg-[#FFFDF9] border border-[#E8E4DD] rounded-2xl p-5 flex flex-col gap-4 hover:border-[#C4BFB6] transition-colors">

            {/* Header: Avatar + Name */}
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 rounded-full bg-[#E8E4DD] flex items-center justify-center flex-shrink-0 overflow-hidden">
                {c.avatarUrl ? (
                  <img src={c.avatarUrl} alt={c.name} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-lg font-bold text-[#6B6560]">{c.name?.charAt(0) || '?'}</span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-[#2D2B28] truncate">{c.name}</p>
                {c.headline && (
                  <p className="text-xs text-[#8A8578] line-clamp-2 mt-0.5 leading-relaxed">{c.headline}</p>
                )}
                {c.followers && (
                  <p className="text-xs text-[#A39E93] mt-1">{c.followers} Follower</p>
                )}
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-2 border border-[#F0EDE8] rounded-xl p-3 bg-[#F7F5F0]">
              <div className="text-center">
                <p className="text-sm font-bold text-[#2D2B28]">{c.postsPerWeek}</p>
                <p className="text-[9px] text-[#A39E93] uppercase tracking-wide mt-0.5">Posts/Woche</p>
              </div>
              <div className="text-center border-x border-[#E8E4DD]">
                <p className="text-sm font-bold text-[#2D2B28]">
                  {c.postingTime ? c.postingTime.replace(' UTC', '') : '–'}
                </p>
                <p className="text-[9px] text-[#A39E93] uppercase tracking-wide mt-0.5">Beste Zeit</p>
              </div>
              <div className="text-center">
                <p className="text-sm font-bold text-[#2D2B28]">
                  {c.avgReactions ? Number(c.avgReactions).toLocaleString() : '–'}
                </p>
                <p className="text-[9px] text-[#A39E93] uppercase tracking-wide mt-0.5">Ø Reactions</p>
              </div>
            </div>

            {/* Content Pillars */}
            {c.contentPillars?.length > 0 && (
              <div>
                <p className="text-[10px] text-[#A39E93] uppercase tracking-wider mb-2">Inhalts-Schwerpunkte</p>
                <div className="flex flex-wrap gap-1.5">
                  {c.contentPillars.slice(0, 4).map((p) => (
                    <span
                      key={p.pillar}
                      className="text-[10px] px-2 py-0.5 rounded-md bg-[#FEF3C7] text-[#92400E] border border-[#F59E0B] font-medium"
                    >
                      {p.pillar} {p.percentage ? `${p.percentage}%` : ''}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Success Factor */}
            {c.successFactor && (
              <div className="border-l-2 border-[#D97706] pl-3">
                <p className="text-[10px] text-[#A39E93] uppercase tracking-wider mb-1">#1 Erfolgsfaktor</p>
                <p className="text-xs text-[#4A4743] line-clamp-2 leading-relaxed">{c.successFactor}</p>
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center gap-2 mt-auto pt-1 border-t border-[#F0EDE8]">
              <button
                onClick={() => onViewReport(c)}
                className="flex-1 py-1.5 text-xs font-medium rounded-lg border border-[#E8E4DD] text-[#6B6560] hover:bg-[#F7F5F0] hover:text-[#2D2B28] transition-colors cursor-pointer"
              >
                Analyse
              </button>
              <button
                onClick={() => onUseForPost && onUseForPost(c)}
                className="flex-1 py-1.5 text-xs font-semibold rounded-lg bg-[#D97706] text-white hover:bg-[#B45309] transition-colors cursor-pointer"
              >
                Post erstellen
              </button>
              <button
                onClick={() => onDelete(c.id)}
                className="w-8 h-8 flex items-center justify-center rounded-lg text-[#C4BFB6] hover:text-red-400 hover:bg-red-50 transition-colors cursor-pointer flex-shrink-0"
                title="Creator löschen"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>

            {/* Saved date */}
            <p className="text-[9px] text-[#C4BFB6] -mt-2">
              Gespeichert am {new Date(c.savedAt).toLocaleDateString('de-DE')}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
