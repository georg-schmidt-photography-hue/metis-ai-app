export default function PostCard({ post, index, platform, hasGeneratedContent, isGenerating, onGenerate, onView, onShowDetail }) {
  const text = post.text || ''
  const title = text.split('\n')[0]?.slice(0, 80) || 'Untitled Post'
  const description = text.split('\n').slice(1).join(' ').trim()

  const platformLabels = {
    linkedin: 'LinkedIn',
    youtube: 'YouTube',
    twitter: 'Twitter / X',
  }

  const platformColors = {
    linkedin: 'bg-blue-50 text-blue-700 border-blue-200',
    youtube: 'bg-red-50 text-red-700 border-red-200',
    twitter: 'bg-gray-50 text-gray-700 border-gray-200',
  }

  return (
    <div className="bg-[#FFFDF9] border border-[#E8E4DD] rounded-xl p-5 hover:border-[#C4BFB6] transition-colors flex flex-col">
      {/* Top: Rank + Source badge */}
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-7 h-7 rounded-full bg-[#FEF3C7] text-[#92400E] flex items-center justify-center text-xs font-bold flex-shrink-0">
            #{index + 1}
          </div>
          <p className="text-xs text-[#8A8578] truncate">
            {post.authorName || 'Unknown'}
          </p>
        </div>
        <span className={`text-[10px] font-medium px-2 py-0.5 rounded-md border flex-shrink-0 ${platformColors[platform] || platformColors.linkedin}`}>
          {platformLabels[platform] || 'LinkedIn'}
        </span>
      </div>

      {/* Title */}
      <h3 className="text-sm font-semibold text-[#2D2B28] line-clamp-2 mb-2 leading-snug">
        {title}
      </h3>

      {/* Description */}
      {description && (
        <p className="text-xs text-[#6B6560] line-clamp-3 mb-4 leading-relaxed flex-1">
          {description}
        </p>
      )}
      {!description && <div className="flex-1" />}

      {/* Footer: Details + Action button */}
      <div className="border-t border-[#E8E4DD] pt-3 mt-auto">
        <button
          onClick={onShowDetail}
          className="flex items-center gap-1 text-[11px] text-[#8A8578] hover:text-[#D97706] transition-colors mb-2 cursor-pointer"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m5.25 12H8.25m6.75-3H8.25M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
          </svg>
          View Content & Analysis
        </button>

        {hasGeneratedContent ? (
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1 text-xs text-green-600 font-medium">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Article Created
            </span>
            <button
              onClick={onView}
              className="ml-auto px-3 py-1.5 text-xs font-medium rounded-lg border border-[#D97706] text-[#D97706] hover:bg-[#FEF3C7] transition-all cursor-pointer"
            >
              View
            </button>
          </div>
        ) : (
          <button
            onClick={onGenerate}
            disabled={isGenerating}
            className="w-full py-2 px-4 bg-[#D97706] hover:bg-[#B45309] disabled:bg-[#D4A574] text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer disabled:cursor-not-allowed"
          >
            {isGenerating ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Generating...
              </span>
            ) : (
              'Generate Article'
            )}
          </button>
        )}
      </div>
    </div>
  )
}
