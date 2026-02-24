export default function PostCard({ post, index, platform, hasGeneratedContent, isGenerating, onGenerate, onView, onShowDetail }) {
  const text = post.textDe || post.text || ''
  const title = text.split('\n')[0]?.slice(0, 80) || 'Ohne Titel'
  const description = text.split('\n').slice(1).join(' ').trim()

  // Detect actual source from post URL
  const postUrl = post.url || ''
  const actualSource = postUrl.includes('linkedin.com') ? 'linkedin'
    : postUrl.includes('youtube.com') || postUrl.includes('youtu.be') ? 'youtube'
    : postUrl.includes('twitter.com') || postUrl.includes('x.com') ? 'twitter'
    : 'linkedin'

  const platformLabels = {
    linkedin: 'LinkedIn',
    youtube: 'YouTube',
    twitter: 'Twitter / X',
  }

  const platformColors = {
    linkedin: 'rgba(59,130,246,0.12)',
    youtube: 'rgba(239,68,68,0.12)',
    twitter: 'rgba(255,255,255,0.08)',
  }
  const platformTextColors = {
    linkedin: '#93c5fd',
    youtube: '#fca5a5',
    twitter: 'rgba(255,255,255,0.5)',
  }

  return (
    <div
      className="rounded-xl p-5 flex flex-col transition-all cursor-default"
      style={{background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)'}}
      onMouseEnter={e=>{e.currentTarget.style.border='1px solid rgba(212,149,43,0.3)';e.currentTarget.style.background='rgba(255,255,255,0.06)'}}
      onMouseLeave={e=>{e.currentTarget.style.border='1px solid rgba(255,255,255,0.08)';e.currentTarget.style.background='rgba(255,255,255,0.04)'}}
    >
      {/* Top: Rank + Source badge */}
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0" style={{background:'rgba(212,149,43,0.15)', border:'1px solid rgba(212,149,43,0.25)', color:'#D4952B'}}>
            #{index + 1}
          </div>
          <p className="text-xs truncate" style={{color:'rgba(255,255,255,0.4)'}}>
            {post.authorName || 'Unbekannt'}
          </p>
        </div>
        <span className="text-[10px] font-medium px-2 py-0.5 rounded-full flex-shrink-0" style={{background: platformColors[actualSource] || platformColors.linkedin, color: platformTextColors[actualSource] || platformTextColors.linkedin, border:'1px solid rgba(255,255,255,0.1)'}}>
          {platformLabels[actualSource] || 'LinkedIn'}
        </span>
      </div>

      {/* Title */}
      <h3 className="text-sm font-semibold line-clamp-2 mb-2 leading-snug" style={{color:'rgba(255,255,255,0.85)'}}>
        {title}
      </h3>

      {/* Description */}
      {description && (
        <p className="text-xs line-clamp-3 mb-4 leading-relaxed flex-1" style={{color:'rgba(255,255,255,0.45)'}}>
          {description}
        </p>
      )}
      {!description && <div className="flex-1" />}

      {/* Platform-specific stats */}
      {actualSource === 'youtube' && post.viewCount != null && (
        <div className="flex items-center gap-3 text-[11px] mb-3" style={{color:'rgba(255,255,255,0.35)'}}>
          <span>{Number(post.viewCount).toLocaleString('de-DE')} Views</span>
          <span>{post.numLikes || 0} Likes</span>
          {post.duration && <span>{post.duration}</span>}
        </div>
      )}
      {actualSource === 'twitter' && (
        <div className="flex items-center gap-3 text-[11px] mb-3" style={{color:'rgba(255,255,255,0.35)'}}>
          <span>{post.numLikes || 0} Likes</span>
          <span>{post.numShares || 0} Retweets</span>
          <span>{post.numComments || 0} Replies</span>
        </div>
      )}

      {/* Footer: Details + Action button */}
      <div className="pt-3 mt-auto" style={{borderTop:'1px solid rgba(255,255,255,0.07)'}}>
        <div className="flex items-center gap-3 mb-2">
          <button
            onClick={onShowDetail}
            className="flex items-center gap-1 text-[11px] transition-colors cursor-pointer"
            style={{color:'rgba(255,255,255,0.35)'}}
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m5.25 12H8.25m6.75-3H8.25M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
            </svg>
            Inhalt & Analyse
          </button>
          {post.url && (
            <a
              href={post.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-[11px] transition-colors ml-auto"
              style={{color:'rgba(255,255,255,0.35)'}}
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
              </svg>
              Original
            </a>
          )}
        </div>

        {hasGeneratedContent ? (
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1 text-xs font-medium" style={{color:'#D4952B'}}>
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Artikel erstellt
            </span>
            <button
              onClick={onView}
              className="ml-auto cursor-pointer transition-all"
              style={{padding:'5px 14px', borderRadius:999, border:'1px solid rgba(212,149,43,0.4)', background:'rgba(212,149,43,0.12)', color:'#D4952B', fontSize:11, fontWeight:600}}
            >
              Ansehen
            </button>
          </div>
        ) : (
          <button
            onClick={onGenerate}
            disabled={isGenerating}
            className="w-full cursor-pointer transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            style={{padding:'8px 16px', borderRadius:999, background:'rgba(255,255,255,0.08)', border:'1px solid rgba(255,255,255,0.15)', color:'rgba(255,255,255,0.7)', fontSize:11, fontWeight:600}}
          >
            {isGenerating ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Wird erstellt...
              </span>
            ) : (
              'Artikel erstellen'
            )}
          </button>
        )}
      </div>
    </div>
  )
}
