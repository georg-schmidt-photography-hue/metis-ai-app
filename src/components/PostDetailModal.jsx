import { useState } from 'react'

export default function PostDetailModal({ post, index, platform, onClose }) {
  const [expanded, setExpanded] = useState(true)
  const text = post.textDe || post.text || ''
  const analysis = post.analysis

  const platformLabels = {
    linkedin: 'LinkedIn',
    youtube: 'YouTube',
    twitter: 'Twitter / X',
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Modal */}
      <div
        className="relative bg-[#FFFDF9] border border-[#E8E4DD] rounded-2xl w-full max-w-2xl max-h-[85vh] overflow-y-auto shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-[#FFFDF9] border-b border-[#E8E4DD] px-6 py-4 flex items-center justify-between rounded-t-2xl">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#FEF3C7] text-[#92400E] flex items-center justify-center text-xs font-bold">
              #{index + 1}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-[#2D2B28] truncate">
                {post.authorName || 'Unbekannt'}
              </p>
              {post.authorHeadline && (
                <p className="text-xs text-[#8A8578] truncate">{post.authorHeadline}</p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-3">
            {post.timeSincePosted && (
              <span className="text-xs text-[#A39E93]">{post.timeSincePosted}</span>
            )}
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#F7F5F0] text-[#8A8578] hover:text-[#2D2B28] transition-colors cursor-pointer"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="px-6 py-5 space-y-5">
          {/* Engagement stats */}
          <div className="flex items-center gap-5 text-xs text-[#8A8578] flex-wrap">
            {platform === 'youtube' && post.viewCount != null && (
              <span className="flex items-center gap-1.5">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                  <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                </svg>
                {Number(post.viewCount).toLocaleString('de-DE')} Views
              </span>
            )}
            <span className="flex items-center gap-1.5">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
              </svg>
              {post.numLikes || 0} {platform === 'twitter' ? 'Likes' : 'Gefällt mir'}
            </span>
            <span className="flex items-center gap-1.5">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
              </svg>
              {post.numComments || 0} {platform === 'twitter' ? 'Replies' : 'Kommentare'}
            </span>
            <span className="flex items-center gap-1.5">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
              </svg>
              {post.numShares || 0} {platform === 'twitter' ? 'Retweets' : 'Geteilt'}
            </span>
            {platform === 'youtube' && post.duration && (
              <span className="flex items-center gap-1.5">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                </svg>
                {post.duration}
              </span>
            )}
          </div>

          {/* Full post text */}
          <div>
            <h3 className="text-xs font-medium text-[#8A8578] uppercase tracking-wide mb-2">Beitragsinhalt</h3>
            <p className="text-sm text-[#4A4743] leading-relaxed whitespace-pre-wrap">
              {text}
            </p>
          </div>

          {/* Analysis section */}
          {analysis && (
            <div className="border-t border-[#E8E4DD] pt-5">
              <button
                onClick={() => setExpanded(!expanded)}
                className="flex items-center gap-1.5 text-xs font-semibold text-[#2D2B28] hover:text-[#D97706] transition-colors cursor-pointer mb-3"
              >
                <svg
                  className={`w-3.5 h-3.5 transition-transform ${expanded ? 'rotate-90' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
                {expanded ? 'Analyse ausblenden' : 'Analyse anzeigen'}
              </button>

              {expanded && (
                <div className="bg-[#F7F5F0] rounded-xl p-5 space-y-3 text-xs">
                  {(analysis.hookType || analysis.hookText) && (
                    <div>
                      <span className="font-semibold text-[#2D2B28]">Einstieg: </span>
                      {analysis.hookType && (
                        <span className="text-[#D97706] font-medium">{analysis.hookType}</span>
                      )}
                      {analysis.hookType && analysis.hookText && (
                        <span className="text-[#A39E93]"> — </span>
                      )}
                      {analysis.hookText && (
                        <span className="text-[#6B6560] italic">"{analysis.hookText}"</span>
                      )}
                    </div>
                  )}

                  {analysis.structure && (
                    <div>
                      <span className="font-semibold text-[#2D2B28]">Struktur: </span>
                      <span className="text-[#6B6560]">{analysis.structure}</span>
                    </div>
                  )}

                  {analysis.tonality && (
                    <div>
                      <span className="font-semibold text-[#2D2B28]">Tonalität: </span>
                      <span className="text-[#6B6560]">{analysis.tonality}</span>
                    </div>
                  )}

                  {analysis.successFactors && (
                    <div>
                      <span className="font-semibold text-[#2D2B28]">Erfolgsfaktoren: </span>
                      <span className="text-[#6B6560]">{analysis.successFactors}</span>
                    </div>
                  )}

                  {analysis.industryRelevance && (
                    <div>
                      <span className="font-semibold text-[#2D2B28]">Branchenrelevanz: </span>
                      <span className="text-[#6B6560]">{analysis.industryRelevance}</span>
                    </div>
                  )}

                  {analysis.callToAction && (
                    <div>
                      <span className="font-semibold text-[#2D2B28]">CTA: </span>
                      <span className="text-[#6B6560]">{analysis.callToAction}</span>
                    </div>
                  )}

                  {analysis.emotionalTriggers && analysis.emotionalTriggers.length > 0 && (
                    <div>
                      <span className="font-semibold text-[#2D2B28] block mb-1.5">Emotionale Trigger</span>
                      <div className="flex flex-wrap gap-1.5">
                        {analysis.emotionalTriggers.map((trigger, i) => (
                          <span
                            key={i}
                            className="px-2 py-0.5 bg-[#FEF3C7] text-[#92400E] border border-[#F59E0B] rounded-md text-[11px] font-medium"
                          >
                            {trigger}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {analysis.patterns && analysis.patterns.length > 0 && (
                    <div>
                      <span className="font-semibold text-[#2D2B28] block mb-1.5">Inhaltsmuster</span>
                      <div className="flex flex-wrap gap-1.5">
                        {analysis.patterns.map((pattern, i) => (
                          <span
                            key={i}
                            className="px-2 py-0.5 bg-[#FFF7ED] text-[#9A3412] border border-[#FDBA74] rounded-md text-[11px] font-medium"
                          >
                            {pattern}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* View original link */}
          {post.url && (
            <div className="border-t border-[#E8E4DD] pt-4">
              <a
                href={post.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-lg border border-[#D97706] text-[#D97706] hover:bg-[#FEF3C7] text-xs font-semibold transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                </svg>
                Original auf {platformLabels[platform] || 'LinkedIn'} ansehen (inkl. Bilder &amp; Medien)
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
