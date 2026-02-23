import { useState } from 'react'

const BRAND = '#D97706'

export default function StyleSetup({ styleProfile, styleSource, selectedStyleCreator, savedCreators, onSaveOwn, onUseCreator, onUseMix, onClear }) {
  const [posts, setPosts] = useState('')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [error, setError] = useState(null)
  const [activeTab, setActiveTab] = useState('own') // 'own' | 'creator' | 'mix'
  const [mixCreator, setMixCreator] = useState(null)
  const [ownPostsForMix, setOwnPostsForMix] = useState('')

  const handleAnalyze = async (postsText, isMix = false) => {
    const text = postsText || posts
    if (!text.trim()) return
    setIsAnalyzing(true)
    setError(null)
    try {
      const res = await fetch('/api/analyze-style', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ posts: text }),
      })
      const data = await res.json()
      if (!data.success) throw new Error(data.error || 'Analyse fehlgeschlagen')
      if (isMix && mixCreator) {
        onUseMix(data.profile, mixCreator)
      } else {
        onSaveOwn(data.profile)
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setIsAnalyzing(false)
    }
  }

  const hasOwnProfile = styleProfile && (styleSource === 'own' || styleSource === 'mix')

  return (
    <div className="space-y-5 max-w-3xl">

      {/* Current Status */}
      {styleSource !== 'none' && (
        <div className="bg-[#FEF3C7] border border-[#F59E0B] rounded-2xl p-4 flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold text-[#92400E] uppercase tracking-wider mb-1">
              Aktiver Schreibstil
            </p>
            <p className="text-sm text-[#78350F]">
              {styleSource === 'own' && `Dein eigener Stil — "${styleProfile?.summary}"`}
              {styleSource === 'creator' && `Stil von ${selectedStyleCreator?.name || selectedStyleCreator?.username}`}
              {styleSource === 'mix' && `Stil-Mix: Du (70%) + ${selectedStyleCreator?.name || selectedStyleCreator?.username} (30%)`}
            </p>
          </div>
          <button
            onClick={onClear}
            className="text-[10px] text-[#92400E] border border-[#F59E0B] px-3 py-1.5 rounded-lg hover:bg-[#FDE68A] transition-colors cursor-pointer flex-shrink-0"
          >
            Zurücksetzen
          </button>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 bg-[#F0EDE8] rounded-xl p-1">
        {[
          { id: 'own', label: '✍️ Mein Stil' },
          { id: 'creator', label: '👤 Creator-Stil' },
          { id: 'mix', label: '🔀 Stil-Mix' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 px-3 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              activeTab === tab.id ? 'bg-white text-[#2D2B28] shadow-sm' : 'text-[#6B6560] hover:text-[#2D2B28]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab: Eigener Stil */}
      {activeTab === 'own' && (
        <div className="bg-[#FFFDF9] border border-[#E8E4DD] rounded-2xl p-5 space-y-4">
          <div>
            <p className="text-sm font-semibold text-[#2D2B28] mb-1">Deine eigenen LinkedIn-Posts</p>
            <p className="text-xs text-[#A39E93] mb-3">Füge 3–5 deiner besten Posts ein. Die KI lernt deinen Ton, Satzbau und Struktur.</p>
            <textarea
              value={posts}
              onChange={e => setPosts(e.target.value)}
              placeholder={'Post 1:\n[Text deines ersten Posts]\n\n---\n\nPost 2:\n[Text deines zweiten Posts]'}
              rows={10}
              className="w-full p-3 border border-[#E8E4DD] rounded-xl text-sm text-[#2D2B28] placeholder-[#C4BFB6] bg-[#F7F5F0] focus:outline-none focus:ring-2 focus:ring-[#D97706] focus:border-transparent resize-none"
            />
          </div>

          {error && <p className="text-xs text-red-500">{error}</p>}

          <button
            onClick={() => handleAnalyze(posts)}
            disabled={isAnalyzing || !posts.trim()}
            className="w-full py-3 bg-[#D97706] hover:bg-[#B45309] disabled:bg-[#D4A574] text-white text-sm font-semibold rounded-xl transition-colors cursor-pointer disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isAnalyzing ? (
              <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Analysiere Stil…</>
            ) : (
              'Schreibstil analysieren'
            )}
          </button>

          {/* Show profile if exists */}
          {hasOwnProfile && styleSource === 'own' && (
            <div className="border border-[#E8E4DD] rounded-xl p-4 space-y-2 bg-white">
              <p className="text-xs font-semibold text-[#2D2B28] uppercase tracking-wider mb-3">Dein Stil-Profil</p>
              {[
                { label: 'Ton', value: styleProfile.tone },
                { label: 'Satzbau', value: styleProfile.sentenceStyle },
                { label: 'Hook-Muster', value: styleProfile.hookPattern },
                { label: 'Emojis', value: styleProfile.emojis },
                { label: 'CTA', value: styleProfile.cta },
                { label: 'Vokabular', value: styleProfile.vocabulary },
                { label: 'Vermeide', value: styleProfile.avoid },
              ].map(({ label, value }) => value ? (
                <div key={label} className="flex gap-2 text-xs">
                  <span className="text-[#A39E93] w-24 flex-shrink-0">{label}</span>
                  <span className="text-[#2D2B28]">{value}</span>
                </div>
              ) : null)}
            </div>
          )}
        </div>
      )}

      {/* Tab: Creator-Stil */}
      {activeTab === 'creator' && (
        <div className="bg-[#FFFDF9] border border-[#E8E4DD] rounded-2xl p-5 space-y-4">
          <div>
            <p className="text-sm font-semibold text-[#2D2B28] mb-1">Stil eines Creators übernehmen</p>
            <p className="text-xs text-[#A39E93] mb-4">Wähle einen gespeicherten Creator — alle generierten Posts werden in seinem Stil geschrieben.</p>
          </div>

          {savedCreators.length === 0 ? (
            <div className="text-xs text-[#A39E93] bg-[#F7F5F0] rounded-xl p-4 text-center">
              Noch keine Creators gespeichert. Analysiere einen Creator im Tab "Creator-Analyse".
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2">
              {savedCreators.map(c => (
                <button
                  key={c.id}
                  onClick={() => onUseCreator(c)}
                  className={`flex items-center gap-3 p-3 rounded-xl border transition-all cursor-pointer text-left ${
                    styleSource === 'creator' && selectedStyleCreator?.id === c.id
                      ? 'border-[#D97706] bg-[#FEF3C7]'
                      : 'border-[#E8E4DD] bg-white hover:border-[#C4BFB6]'
                  }`}
                >
                  <div className="w-9 h-9 rounded-full bg-[#E8E4DD] flex items-center justify-center overflow-hidden flex-shrink-0">
                    {c.avatarUrl
                      ? <img src={c.avatarUrl} alt={c.name} className="w-full h-full object-cover" />
                      : <span className="text-sm font-bold text-[#6B6560]">{c.name?.charAt(0)}</span>
                    }
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-[#2D2B28] truncate">{c.name}</p>
                    <p className="text-[10px] text-[#A39E93]">{c.postsPerWeek} Posts/Woche</p>
                  </div>
                  {styleSource === 'creator' && selectedStyleCreator?.id === c.id && (
                    <span className="ml-auto text-[#D97706] text-xs">✓</span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab: Stil-Mix */}
      {activeTab === 'mix' && (
        <div className="bg-[#FFFDF9] border border-[#E8E4DD] rounded-2xl p-5 space-y-4">
          <div>
            <p className="text-sm font-semibold text-[#2D2B28] mb-1">Stil-Mix: Du + Creator</p>
            <p className="text-xs text-[#A39E93] mb-4">70% dein Stil, 30% die Energie und Struktur eines Creators. Das Ergebnis klingt wie du — aber mit mehr Impact.</p>
          </div>

          {/* Step 1: Choose creator */}
          <div>
            <p className="text-xs font-semibold text-[#6B6560] uppercase tracking-wider mb-2">1. Creator wählen</p>
            {savedCreators.length === 0 ? (
              <p className="text-xs text-[#A39E93]">Keine gespeicherten Creators.</p>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                {savedCreators.map(c => (
                  <button
                    key={c.id}
                    onClick={() => setMixCreator(c)}
                    className={`flex items-center gap-2 p-2.5 rounded-xl border transition-all cursor-pointer text-left text-xs ${
                      mixCreator?.id === c.id
                        ? 'border-[#D97706] bg-[#FEF3C7] text-[#92400E]'
                        : 'border-[#E8E4DD] bg-white text-[#6B6560] hover:border-[#C4BFB6]'
                    }`}
                  >
                    <div className="w-7 h-7 rounded-full bg-[#E8E4DD] flex items-center justify-center overflow-hidden flex-shrink-0">
                      {c.avatarUrl
                        ? <img src={c.avatarUrl} alt={c.name} className="w-full h-full object-cover" />
                        : <span className="text-xs font-bold text-[#6B6560]">{c.name?.charAt(0)}</span>
                      }
                    </div>
                    <span className="font-medium truncate">{c.name}</span>
                    {mixCreator?.id === c.id && <span className="ml-auto text-[#D97706]">✓</span>}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Step 2: Own posts */}
          <div>
            <p className="text-xs font-semibold text-[#6B6560] uppercase tracking-wider mb-2">2. Deine Posts eingeben</p>
            <textarea
              value={ownPostsForMix}
              onChange={e => setOwnPostsForMix(e.target.value)}
              placeholder="Füge 3–5 deiner eigenen Posts ein..."
              rows={6}
              className="w-full p-3 border border-[#E8E4DD] rounded-xl text-sm text-[#2D2B28] placeholder-[#C4BFB6] bg-[#F7F5F0] focus:outline-none focus:ring-2 focus:ring-[#D97706] resize-none"
            />
          </div>

          {error && <p className="text-xs text-red-500">{error}</p>}

          <button
            onClick={() => handleAnalyze(ownPostsForMix, true)}
            disabled={isAnalyzing || !ownPostsForMix.trim() || !mixCreator}
            className="w-full py-3 bg-[#D97706] hover:bg-[#B45309] disabled:bg-[#D4A574] text-white text-sm font-semibold rounded-xl transition-colors cursor-pointer disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isAnalyzing ? (
              <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Analysiere Mix…</>
            ) : (
              'Stil-Mix erstellen'
            )}
          </button>
        </div>
      )}
    </div>
  )
}
