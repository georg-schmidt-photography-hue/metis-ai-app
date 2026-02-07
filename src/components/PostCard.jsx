import { useState } from 'react'

export default function PostCard({ post, index }) {
  const [expanded, setExpanded] = useState(false)
  const [showAnalysis, setShowAnalysis] = useState(false)

  const text = post.text || ''
  const isLong = text.length > 200
  const displayText = expanded || !isLong ? text : text.slice(0, 200) + '...'
  const analysis = post.analysis

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 hover:border-gray-300 transition-colors">
      {/* Header: Rank, Author, Time */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs font-bold flex-shrink-0">
            #{index + 1}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-gray-900 truncate">
              {post.authorName || 'Unknown'}
            </p>
            {post.authorHeadline && (
              <p className="text-xs text-gray-500 truncate">
                {post.authorHeadline}
              </p>
            )}
          </div>
        </div>
        {post.timeSincePosted && (
          <span className="text-xs text-gray-400 flex-shrink-0 whitespace-nowrap">
            {post.timeSincePosted}
          </span>
        )}
      </div>

      {/* Body: Post text */}
      <div className="mb-3">
        <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
          {displayText}
        </p>
        {isLong && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-xs text-indigo-600 hover:text-indigo-700 mt-1 font-medium cursor-pointer"
          >
            {expanded ? 'Show less' : 'Show more'}
          </button>
        )}
      </div>

      {/* Engagement row */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-4 text-xs text-gray-500">
          <span className="flex items-center gap-1">
            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
            </svg>
            {post.numLikes || 0}
          </span>
          <span className="flex items-center gap-1">
            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
            </svg>
            {post.numComments || 0}
          </span>
          <span className="flex items-center gap-1">
            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
            </svg>
            {post.numShares || 0}
          </span>
        </div>
      </div>

      {/* Analysis toggle + collapsible section */}
      {analysis && (
        <div className="border-t border-gray-100 pt-3">
          <button
            onClick={() => setShowAnalysis(!showAnalysis)}
            className="flex items-center gap-1.5 text-xs font-medium text-gray-500 hover:text-indigo-600 transition-colors cursor-pointer"
          >
            <svg
              className={`w-3.5 h-3.5 transition-transform ${showAnalysis ? 'rotate-90' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            {showAnalysis ? 'Hide Analysis' : 'Show Analysis'}
          </button>

          {showAnalysis && (
            <div className="mt-3 bg-gray-50 rounded-lg p-4 space-y-3 text-xs">
              {/* Hook */}
              {(analysis.hookType || analysis.hookText) && (
                <div>
                  <span className="font-semibold text-gray-700">Hook: </span>
                  {analysis.hookType && (
                    <span className="text-indigo-600 font-medium">{analysis.hookType}</span>
                  )}
                  {analysis.hookType && analysis.hookText && (
                    <span className="text-gray-400"> -- </span>
                  )}
                  {analysis.hookText && (
                    <span className="text-gray-600 italic">"{analysis.hookText}"</span>
                  )}
                </div>
              )}

              {/* Structure */}
              {analysis.structure && (
                <div>
                  <span className="font-semibold text-gray-700">Structure: </span>
                  <span className="text-gray-600">{analysis.structure}</span>
                </div>
              )}

              {/* Tonality */}
              {analysis.tonality && (
                <div>
                  <span className="font-semibold text-gray-700">Tonality: </span>
                  <span className="text-gray-600">{analysis.tonality}</span>
                </div>
              )}

              {/* Success Factors */}
              {analysis.successFactors && (
                <div>
                  <span className="font-semibold text-gray-700">Success Factors: </span>
                  <span className="text-gray-600">{analysis.successFactors}</span>
                </div>
              )}

              {/* Industry Relevance */}
              {analysis.industryRelevance && (
                <div>
                  <span className="font-semibold text-gray-700">Industry Relevance: </span>
                  <span className="text-gray-600">{analysis.industryRelevance}</span>
                </div>
              )}

              {/* Call to Action */}
              {analysis.callToAction && (
                <div>
                  <span className="font-semibold text-gray-700">CTA: </span>
                  <span className="text-gray-600">{analysis.callToAction}</span>
                </div>
              )}

              {/* Emotional Triggers (tags) */}
              {analysis.emotionalTriggers && analysis.emotionalTriggers.length > 0 && (
                <div>
                  <span className="font-semibold text-gray-700 block mb-1.5">Emotional Triggers</span>
                  <div className="flex flex-wrap gap-1.5">
                    {analysis.emotionalTriggers.map((trigger, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 bg-amber-50 text-amber-700 border border-amber-200 rounded-md text-[11px] font-medium"
                      >
                        {trigger}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Content Patterns (tags) */}
              {analysis.patterns && analysis.patterns.length > 0 && (
                <div>
                  <span className="font-semibold text-gray-700 block mb-1.5">Content Patterns</span>
                  <div className="flex flex-wrap gap-1.5">
                    {analysis.patterns.map((pattern, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 bg-indigo-50 text-indigo-700 border border-indigo-200 rounded-md text-[11px] font-medium"
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

      {/* Footer: View on LinkedIn */}
      {post.url && (
        <div className={`${analysis ? 'mt-3' : ''} flex justify-end`}>
          <a
            href={post.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-gray-400 hover:text-indigo-600 transition-colors"
          >
            View on LinkedIn
          </a>
        </div>
      )}
    </div>
  )
}
