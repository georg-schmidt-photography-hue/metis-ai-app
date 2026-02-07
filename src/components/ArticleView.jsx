import { useState } from 'react'

function PreviewContent({ content }) {
  if (!content) return null

  const lines = content.split('\n')
  const firstLine = lines[0] || ''
  const rest = lines.slice(1).join('\n').trim()

  const renderParagraphs = (text) => {
    return text.split('\n\n').map((block, i) => {
      const trimmed = block.trim()
      if (!trimmed) return null

      // Detect bullet lists
      const isBulletList = trimmed.split('\n').every(line =>
        /^[\s]*[-*\u2022\u25CF\u25CB\u2023]/.test(line) || line.trim() === ''
      )

      if (isBulletList) {
        return (
          <ul key={i} className="list-disc list-inside space-y-1 text-[#4A4743]">
            {trimmed.split('\n').filter(l => l.trim()).map((line, j) => (
              <li key={j} className="text-sm leading-relaxed">
                {line.replace(/^[\s]*[-*\u2022\u25CF\u25CB\u2023]\s*/, '')}
              </li>
            ))}
          </ul>
        )
      }

      return (
        <p key={i} className="text-sm text-[#4A4743] leading-relaxed whitespace-pre-wrap">
          {trimmed}
        </p>
      )
    })
  }

  return (
    <div className="space-y-4">
      {firstLine && (
        <p className="text-base font-bold text-[#2D2B28] leading-snug">
          {firstLine}
        </p>
      )}
      {rest && renderParagraphs(rest)}
    </div>
  )
}

export default function ArticleView({ content, platform, onBack, onContentChange, isRefining }) {
  const [activeTab, setActiveTab] = useState('preview')
  const [editedContent, setEditedContent] = useState(content)
  const [copied, setCopied] = useState(false)

  // Sync when content changes externally (e.g. after refine)
  const [lastContent, setLastContent] = useState(content)
  if (content !== lastContent) {
    setEditedContent(content)
    setLastContent(content)
  }

  const displayContent = editedContent

  const handleEditChange = (e) => {
    setEditedContent(e.target.value)
    onContentChange(e.target.value)
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(displayContent)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      const textarea = document.createElement('textarea')
      textarea.value = displayContent
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('copy')
      document.body.removeChild(textarea)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const platformLabels = {
    linkedin: 'LinkedIn',
    youtube: 'YouTube',
    twitter: 'Twitter / X',
  }

  const title = displayContent?.split('\n')[0]?.slice(0, 100) || 'Generated Article'

  return (
    <div className="bg-[#FFFDF9] border border-[#E8E4DD] rounded-xl p-6 min-h-[400px] shadow-sm">
      {/* Top bar */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={onBack}
          className="flex items-center gap-1 text-xs text-[#8A8578] hover:text-[#D97706] transition-colors cursor-pointer"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
          Back to Dashboard
        </button>

        <div className="flex items-center gap-2">
          <span className="text-[10px] font-medium px-2 py-0.5 rounded-md border bg-[#F7F5F0] text-[#8A8578] border-[#E8E4DD]">
            Based on: {platformLabels[platform] || 'LinkedIn'}
          </span>
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-[#E8E4DD] text-[#6B6560] hover:bg-[#F7F5F0] hover:text-[#2D2B28] transition-all cursor-pointer"
          >
            {copied ? (
              <>
                <svg className="w-3.5 h-3.5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Copied!
              </>
            ) : (
              <>
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9.75a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184" />
                </svg>
                Copy Article
              </>
            )}
          </button>
        </div>
      </div>

      {/* Article title */}
      <h1 className="text-lg font-bold text-[#2D2B28] mb-4 leading-snug">
        {title}
      </h1>

      {/* Edit / Preview tabs */}
      <div className="flex items-center gap-1 mb-4 border-b border-[#E8E4DD]">
        <button
          onClick={() => setActiveTab('preview')}
          className={`px-4 py-2 text-xs font-medium transition-all cursor-pointer border-b-2 -mb-px ${
            activeTab === 'preview'
              ? 'border-[#D97706] text-[#D97706]'
              : 'border-transparent text-[#8A8578] hover:text-[#2D2B28]'
          }`}
        >
          Preview
        </button>
        <button
          onClick={() => setActiveTab('edit')}
          className={`px-4 py-2 text-xs font-medium transition-all cursor-pointer border-b-2 -mb-px ${
            activeTab === 'edit'
              ? 'border-[#D97706] text-[#D97706]'
              : 'border-transparent text-[#8A8578] hover:text-[#2D2B28]'
          }`}
        >
          Edit
        </button>
      </div>

      {/* Content area */}
      {isRefining ? (
        <div className="space-y-4 animate-pulse">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-5 h-5 bg-[#FEF3C7] rounded-full" />
            <span className="text-sm text-[#D97706] font-medium">Refining your article...</span>
          </div>
          <div className="h-4 bg-[#E8E4DD] rounded-lg w-3/4" />
          <div className="h-4 bg-[#E8E4DD] rounded-lg w-full" />
          <div className="h-4 bg-[#E8E4DD] rounded-lg w-5/6" />
        </div>
      ) : activeTab === 'preview' ? (
        <div className="min-h-[300px]">
          <PreviewContent content={displayContent} />
        </div>
      ) : (
        <textarea
          value={editedContent}
          onChange={handleEditChange}
          className="w-full min-h-[400px] p-4 text-sm text-[#2D2B28] leading-relaxed bg-[#F7F5F0] border border-[#E8E4DD] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D97706] focus:border-transparent resize-y font-[inherit]"
        />
      )}
    </div>
  )
}
