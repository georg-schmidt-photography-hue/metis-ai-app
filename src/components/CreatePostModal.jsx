import { useState } from 'react'

export default function CreatePostModal({ creator, onClose, prefillTopic, trendContext }) {
  const [topic, setTopic] = useState(prefillTopic || '')
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedPost, setGeneratedPost] = useState('')
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState(null)

  const handleGenerate = async () => {
    if (!topic.trim()) return
    setIsGenerating(true)
    setError(null)
    setGeneratedPost('')

    try {
      const res = await fetch('/api/create-post', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic: topic.trim(), creator, trendContext }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Fehler beim Generieren')
      setGeneratedPost(data.post || '')
    } catch (err) {
      setError(err.message)
    } finally {
      setIsGenerating(false)
    }
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedPost)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/40" />
      <div
        className="relative bg-[#FFFDF9] border border-[#E8E4DD] rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-[#FFFDF9] border-b border-[#E8E4DD] px-6 py-4 flex items-center justify-between rounded-t-2xl">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#E8E4DD] flex items-center justify-center overflow-hidden flex-shrink-0">
              {creator.avatarUrl ? (
                <img src={creator.avatarUrl} alt={creator.name} className="w-full h-full object-cover" />
              ) : (
                <span className="text-sm font-bold text-[#6B6560]">{creator.name?.charAt(0)}</span>
              )}
            </div>
            <div>
              <p className="text-sm font-semibold text-[#2D2B28]">Post im Stil von {creator.name}</p>
              <p className="text-xs text-[#A39E93]">Gib ein Thema ein — der Post wird in ihrem Stil geschrieben</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#F7F5F0] text-[#8A8578] cursor-pointer"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="px-6 py-5 space-y-5">
          {/* Trend context badge */}
          {trendContext && (
            <div className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium border ${
              trendContext.trend === 'rising' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-[#F7F5F0] text-[#6B6560] border-[#E8E4DD]'
            }`}>
              {trendContext.trend === 'rising' ? '📈' : '➡️'}
              Google Trends Score: {trendContext.currentScore}/100 · Perplexity recherchiert aktuelle Infos
            </div>
          )}

          {/* Creator Style Preview */}
          <div className="bg-[#F7F5F0] rounded-xl p-4 space-y-2">
            <p className="text-[10px] text-[#A39E93] uppercase tracking-wider font-semibold">Gewählter Creator-Stil</p>
            {creator.successFactor && (
              <p className="text-xs text-[#4A4743] leading-relaxed">
                <span className="font-semibold text-[#2D2B28]">Erfolgsfaktor: </span>
                {creator.successFactor}
              </p>
            )}
            {creator.contentPillars?.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-1">
                {creator.contentPillars.slice(0, 4).map((p) => (
                  <span key={p.pillar} className="text-[10px] px-2 py-0.5 rounded-md bg-white border border-[#E8E4DD] text-[#6B6560]">
                    {p.pillar}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Topic Input */}
          <div>
            <label className="text-xs font-semibold text-[#2D2B28] block mb-2">Thema / Keyword</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && !isGenerating && handleGenerate()}
                placeholder='z.B. "Photovoltaik Trends 2026" oder "KI im Mittelstand"'
                className="flex-1 px-4 py-2.5 border border-[#E8E4DD] rounded-xl text-sm text-[#2D2B28] placeholder-[#A39E93] bg-white focus:outline-none focus:ring-2 focus:ring-[#D97706] focus:border-transparent transition-all"
                disabled={isGenerating}
              />
              <button
                onClick={handleGenerate}
                disabled={isGenerating || !topic.trim()}
                className="px-4 py-2.5 bg-[#D97706] hover:bg-[#B45309] disabled:bg-[#D4A574] text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer disabled:cursor-not-allowed whitespace-nowrap"
              >
                {isGenerating ? (
                  <span className="flex items-center gap-2">
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Generiert…
                  </span>
                ) : (
                  'Post generieren'
                )}
              </button>
            </div>
          </div>

          {/* Error */}
          {error && (
            <p className="text-xs text-red-500 bg-red-50 rounded-lg px-4 py-2">{error}</p>
          )}

          {/* Generated Post */}
          {generatedPost && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold text-[#2D2B28] uppercase tracking-wide">Generierter Post</p>
                <button
                  onClick={handleCopy}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-all cursor-pointer ${
                    copied
                      ? 'bg-green-50 text-green-700 border border-green-200'
                      : 'bg-[#F7F5F0] text-[#6B6560] hover:bg-[#E8E4DD] border border-[#E8E4DD]'
                  }`}
                >
                  {copied ? (
                    <>
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Kopiert!
                    </>
                  ) : (
                    <>
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                      Kopieren
                    </>
                  )}
                </button>
              </div>
              <textarea
                value={generatedPost}
                onChange={(e) => setGeneratedPost(e.target.value)}
                className="w-full h-64 px-4 py-3 border border-[#E8E4DD] rounded-xl text-sm text-[#2D2B28] bg-white focus:outline-none focus:ring-2 focus:ring-[#D97706] resize-none leading-relaxed"
              />
              <div className="flex gap-2">
                <button
                  onClick={handleGenerate}
                  disabled={isGenerating}
                  className="flex items-center gap-1.5 px-4 py-2 text-xs font-medium rounded-xl border border-[#E8E4DD] text-[#6B6560] hover:bg-[#F7F5F0] transition-colors cursor-pointer disabled:opacity-50"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182" />
                  </svg>
                  Neu generieren
                </button>
                <button
                  onClick={handleCopy}
                  className="flex-1 py-2 text-xs font-semibold rounded-xl bg-[#D97706] text-white hover:bg-[#B45309] transition-colors cursor-pointer"
                >
                  {copied ? 'Kopiert!' : 'In Zwischenablage kopieren'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
