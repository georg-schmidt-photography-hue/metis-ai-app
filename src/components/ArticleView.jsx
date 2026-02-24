import { useState } from 'react'

function ScoreRing({ score }) {
  const color = score >= 75 ? '#16a34a' : score >= 50 ? '#D97706' : score >= 30 ? '#ea580c' : '#dc2626'
  const label = score >= 75 ? 'Stark' : score >= 50 ? 'Gut' : score >= 30 ? 'Okay' : 'Schwach'
  const r = 28, c = 2 * Math.PI * r
  const fill = (score / 100) * c
  return (
    <div className="flex items-center gap-4">
      <svg width="72" height="72" viewBox="0 0 72 72">
        <circle cx="36" cy="36" r={r} fill="none" stroke="#F0EDE8" strokeWidth="6" />
        <circle cx="36" cy="36" r={r} fill="none" stroke={color} strokeWidth="6"
          strokeDasharray={`${fill} ${c}`} strokeLinecap="round"
          transform="rotate(-90 36 36)" style={{ transition: 'stroke-dasharray 1s ease' }} />
        <text x="36" y="40" textAnchor="middle" fontSize="15" fontWeight="700" fill={color}>{score}</text>
      </svg>
      <div>
        <p className="text-lg font-bold" style={{ color }}>{label}</p>
        <p className="text-xs text-[#A39E93]">Virality Score</p>
      </div>
    </div>
  )
}

function AnalysisPanel({ analysis, onUseHook, onClose }) {
  const hookColor = analysis.hookAnalysis?.rating === 'Stark' ? 'text-green-600' : analysis.hookAnalysis?.rating === 'Okay' ? 'text-[#D97706]' : 'text-red-500'

  return (
    <div className="mt-5 border border-[#E8E4DD] rounded-xl overflow-hidden">
      {/* Header */}
      <div className="bg-[#F7F5F0] px-4 py-3 flex items-center justify-between border-b border-[#E8E4DD]">
        <p className="text-xs font-semibold text-[#2D2B28] uppercase tracking-wider">Post-Analyse</p>
        <button onClick={onClose} className="text-[#A39E93] hover:text-[#2D2B28] text-xs cursor-pointer">✕ Schließen</button>
      </div>

      <div className="p-4 space-y-5">
        {/* Score */}
        <div className="flex items-start justify-between gap-4">
          <ScoreRing score={analysis.score} />
          <div className="flex-1 bg-[#FFFDF9] border border-[#E8E4DD] rounded-xl p-3">
            <p className="text-xs font-semibold text-[#6B6560] uppercase tracking-wider mb-1">Gesamturteil</p>
            <p className="text-sm text-[#2D2B28] leading-relaxed">{analysis.verdict}</p>
            {analysis.styleConsistency && (
              <p className="text-xs text-[#A39E93] mt-2 italic">{analysis.styleConsistency}</p>
            )}
          </div>
        </div>

        {/* Hook */}
        {analysis.hookAnalysis && (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <p className="text-xs font-semibold text-[#2D2B28] uppercase tracking-wider">Hook</p>
              <span className={`text-xs font-semibold ${hookColor}`}>{analysis.hookAnalysis.rating}</span>
            </div>
            {analysis.hookAnalysis.problem && (
              <p className="text-xs text-[#6B6560] mb-3">{analysis.hookAnalysis.problem}</p>
            )}
            <div className="space-y-2">
              {analysis.hookAnalysis.rewrites?.map((hook, i) => (
                <div key={i} className="flex items-start gap-2 p-2.5 bg-[#FFFDF9] border border-[#E8E4DD] rounded-lg group hover:border-[#D97706] transition-all">
                  <span className="text-[10px] font-bold text-[#D97706] mt-0.5 w-4 flex-shrink-0">{i + 1}</span>
                  <p className="text-xs text-[#2D2B28] flex-1 leading-relaxed">{hook}</p>
                  <button
                    onClick={() => onUseHook(hook)}
                    className="text-[10px] text-[#D97706] border border-[#D97706] px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-all cursor-pointer flex-shrink-0"
                  >
                    Übernehmen
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Improvements */}
        {analysis.improvements?.length > 0 && (
          <div>
            <p className="text-xs font-semibold text-[#2D2B28] uppercase tracking-wider mb-2">Konkrete Verbesserungen</p>
            <div className="space-y-2">
              {analysis.improvements.map((imp, i) => (
                <div key={i} className="p-3 bg-[#FFFDF9] border border-[#E8E4DD] rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#FEF3C7] text-[#92400E]">{imp.type}</span>
                    <p className="text-xs text-[#6B6560]">{imp.issue}</p>
                  </div>
                  <p className="text-xs text-[#2D2B28] leading-relaxed">→ {imp.fix}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

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

function LinkedInPreview({ content }) {
  const [expanded, setExpanded] = useState(false)
  if (!content) return null

  const lines = content.split('\n')
  const CUTOFF = 3
  const visibleLines = expanded ? lines : lines.slice(0, CUTOFF)
  const hasMore = lines.length > CUTOFF

  return (
    <div className="max-w-[560px] mx-auto bg-white border border-[#E0DFDC] rounded-xl overflow-hidden shadow-sm">
      {/* Header */}
      <div className="p-4 flex items-start gap-3">
        <div className="w-12 h-12 rounded-full bg-[#E8E4DD] flex items-center justify-center flex-shrink-0">
          <svg className="w-6 h-6 text-[#A39E93]" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/>
          </svg>
        </div>
        <div>
          <p className="text-sm font-semibold text-[#191919]">Dein Name</p>
          <p className="text-xs text-[#666666]">Deine Headline · 1. Kontaktgrad</p>
          <p className="text-[11px] text-[#666666]">Gerade · <svg className="inline w-3 h-3 fill-[#666666]" viewBox="0 0 16 16"><path d="M8 0a8 8 0 100 16A8 8 0 008 0zm3.5 7H9V4.5a1 1 0 00-2 0V8a1 1 0 001 1h3.5a1 1 0 000-2z"/></svg></p>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 pb-3">
        <p className="text-sm text-[#191919] leading-relaxed whitespace-pre-wrap">
          {visibleLines.join('\n')}
          {!expanded && hasMore && '…'}
        </p>
        {hasMore && (
          <button
            onClick={() => setExpanded(e => !e)}
            className="text-xs font-semibold text-[#666666] hover:text-[#191919] mt-1 cursor-pointer"
          >
            {expanded ? 'Weniger anzeigen' : 'Mehr anzeigen'}
          </button>
        )}
      </div>

      {/* Footer */}
      <div className="px-4 py-2 border-t border-[#E0DFDC] flex items-center gap-4">
        {[
          { icon: '👍', label: 'Gefällt mir' },
          { icon: '💬', label: 'Kommentieren' },
          { icon: '↗️', label: 'Weiterleiten' },
        ].map(btn => (
          <button key={btn.label} className="flex items-center gap-1 text-xs text-[#666666] hover:text-[#191919] py-2 cursor-pointer">
            <span>{btn.icon}</span>
            <span className="hidden sm:inline">{btn.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

export default function ArticleView({ content, platform, onBack, onContentChange, isRefining, styleProfile, topPosts, onSavePost }) {
  const [activeTab, setActiveTab] = useState('preview')
  const [editedContent, setEditedContent] = useState(content)
  const [copied, setCopied] = useState(false)
  const [saved, setSaved] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysis, setAnalysis] = useState(null)
  const [analyzeError, setAnalyzeError] = useState(null)

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

  const handleAnalyze = async () => {
    setIsAnalyzing(true)
    setAnalyzeError(null)
    setAnalysis(null)
    try {
      const res = await fetch('/api/analyze-post', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ post: editedContent, styleProfile, topPosts }),
      })
      const data = await res.json()
      if (!data.success) throw new Error(data.error)
      setAnalysis(data.analysis)
    } catch (err) {
      setAnalyzeError(err.message)
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleUseHook = (hook) => {
    const lines = editedContent.split('\n')
    lines[0] = hook
    const newContent = lines.join('\n')
    setEditedContent(newContent)
    onContentChange(newContent)
    setAnalysis(null)
    setActiveTab('preview')
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

  const title = displayContent?.split('\n')[0]?.slice(0, 100) || 'Generierter Artikel'

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
          Zurück zur Übersicht
        </button>

        <div className="flex items-center gap-2">
          <span className="text-[10px] font-medium px-2 py-0.5 rounded-md border bg-[#F7F5F0] text-[#8A8578] border-[#E8E4DD]">
            Quelle: {platformLabels[platform] || 'LinkedIn'}
          </span>
          <button
            onClick={handleAnalyze}
            disabled={isAnalyzing}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-[#D97706] text-[#D97706] bg-[#FEF3C7] hover:bg-[#FDE68A] transition-all cursor-pointer disabled:opacity-50"
          >
            {isAnalyzing ? (
              <><div className="w-3 h-3 border-2 border-[#D97706] border-t-transparent rounded-full animate-spin" /> Analysiere…</>
            ) : (
              <><svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/></svg> Virality Score</>
            )}
          </button>
          {onSavePost && (
            <button
              onClick={async () => { await onSavePost(editedContent); setSaved(true); setTimeout(() => setSaved(false), 2000) }}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-[#E8E4DD] text-[#6B6560] hover:bg-[#F7F5F0] hover:text-[#2D2B28] transition-all cursor-pointer"
            >
              {saved ? '✓ Gespeichert' : 'Speichern'}
            </button>
          )}
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-[#E8E4DD] text-[#6B6560] hover:bg-[#F7F5F0] hover:text-[#2D2B28] transition-all cursor-pointer"
          >
            {copied ? (
              <>
                <svg className="w-3.5 h-3.5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Kopiert!
              </>
            ) : (
              <>
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9.75a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184" />
                </svg>
                Artikel kopieren
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
        {[
          { id: 'preview', label: 'Vorschau' },
          { id: 'linkedin', label: 'LinkedIn-Ansicht' },
          { id: 'edit', label: 'Bearbeiten' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 text-xs font-medium transition-all cursor-pointer border-b-2 -mb-px ${
              activeTab === tab.id
                ? 'border-[#D97706] text-[#D97706]'
                : 'border-transparent text-[#8A8578] hover:text-[#2D2B28]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {analyzeError && (
        <p className="text-xs text-red-500 mb-3">{analyzeError}</p>
      )}

      {/* Content area */}
      {isRefining ? (
        <div className="space-y-4 animate-pulse">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-5 h-5 bg-[#FEF3C7] rounded-full" />
            <span className="text-sm text-[#D97706] font-medium">Artikel wird angepasst...</span>
          </div>
          <div className="h-4 bg-[#E8E4DD] rounded-lg w-3/4" />
          <div className="h-4 bg-[#E8E4DD] rounded-lg w-full" />
          <div className="h-4 bg-[#E8E4DD] rounded-lg w-5/6" />
        </div>
      ) : activeTab === 'linkedin' ? (
        <div className="min-h-[300px] bg-[#F3F2EF] rounded-xl p-4">
          <LinkedInPreview content={displayContent} />
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

      {analysis && (
        <AnalysisPanel
          analysis={analysis}
          onUseHook={handleUseHook}
          onClose={() => setAnalysis(null)}
        />
      )}
    </div>
  )
}
