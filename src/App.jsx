import { useState } from 'react'
import Header from './components/Header'
import ContentOutput from './components/ContentOutput'
import ArticleView from './components/ArticleView'
import QuickEdits from './components/QuickEdits'
import LandingPage from './components/LandingPage'
import CreatorReport from './components/CreatorReport'

function App() {
  const [showLanding, setShowLanding] = useState(true)
  const [appMode, setAppMode] = useState('inspiration') // 'inspiration' | 'creator-report'
  const [step, setStep] = useState('idle') // idle | searching | posts | generating | refining
  const [topPosts, setTopPosts] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [platform, setPlatform] = useState('linkedin')
  const [searchMode, setSearchMode] = useState('topic') // 'topic' | 'account'
  const [accountFilter, setAccountFilter] = useState('top4weeks') // 'top4weeks' | 'last10days'
  const [error, setError] = useState(null)
  const [translateDE, setTranslateDE] = useState(false)

  // Creator Report state
  const [creatorReport, setCreatorReport] = useState(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analyzeError, setAnalyzeError] = useState(null)
  const [analyzedUsername, setAnalyzedUsername] = useState('')

  // Per-card generated content: { [index]: { content, sourcePost } }
  const [generatedPosts, setGeneratedPosts] = useState({})
  const [generatingIndex, setGeneratingIndex] = useState(null)
  const [viewingPostId, setViewingPostId] = useState(null)

  const [settings, setSettings] = useState({
    quickEdits: [],
  })

  // Step 1: Search for top posts
  const handleSearch = async (term) => {
    setStep('searching')
    setError(null)
    setSearchTerm(term)
    setTopPosts([])
    setGeneratedPosts({})
    setViewingPostId(null)
    setGeneratingIndex(null)

    try {
      const response = await fetch(import.meta.env.VITE_N8N_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'ngrok-skip-browser-warning': 'true' },
        body: JSON.stringify({ searchTerm: term, platform, searchMode, accountFilter, translate: translateDE }),
      })

      if (!response.ok) throw new Error(`Server error: ${response.status}`)

      const data = await response.json()

      if (!data.success || !data.posts || data.posts.length === 0) {
        throw new Error('Keine Beiträge gefunden. Versuche einen anderen Suchbegriff.')
      }

      setTopPosts(data.posts)
      setStep('posts')
    } catch (err) {
      setError(err.message || 'Suche fehlgeschlagen. Bitte versuche es erneut.')
      setStep('idle')
    }
  }

  // Step 2: Generate article for a single post
  const handleGenerateForPost = async (index) => {
    setGeneratingIndex(index)
    setStep('generating')
    setError(null)

    const post = topPosts[index]

    try {
      const response = await fetch(import.meta.env.VITE_N8N_GENERATE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'ngrok-skip-browser-warning': 'true' },
        body: JSON.stringify({
          post,
          posts: [post],
          searchTerm,
          platform,
          quickEdits: settings.quickEdits || [],
        }),
      })

      if (!response.ok) throw new Error(`Server error: ${response.status}`)

      const data = await response.json()
      const content = data.generatedPost || data.output || data.text || ''

      if (!content) throw new Error('Keine Inhalte vom Server erhalten.')

      const contentStr = typeof content === 'string' ? content : JSON.stringify(content, null, 2)

      setGeneratedPosts(prev => ({
        ...prev,
        [index]: { content: contentStr, sourcePost: post },
      }))
      setStep('posts')
    } catch (err) {
      setError(err.message || 'Erstellung fehlgeschlagen. Bitte versuche es erneut.')
      setStep('posts')
    } finally {
      setGeneratingIndex(null)
    }
  }

  // Step 3: Refine existing article for the currently viewed post
  const handleRefine = async () => {
    if (viewingPostId === null || !generatedPosts[viewingPostId]) return

    setStep('refining')
    setError(null)

    try {
      const response = await fetch(import.meta.env.VITE_N8N_GENERATE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'ngrok-skip-browser-warning': 'true' },
        body: JSON.stringify({
          existingPost: generatedPosts[viewingPostId].content,
          searchTerm,
          platform,
          quickEdits: settings.quickEdits || [],
        }),
      })

      if (!response.ok) throw new Error(`Server error: ${response.status}`)

      const data = await response.json()
      const content = data.generatedPost || data.output || data.text || ''

      if (!content) throw new Error('Keine Inhalte vom Server erhalten.')

      const contentStr = typeof content === 'string' ? content : JSON.stringify(content, null, 2)

      setGeneratedPosts(prev => ({
        ...prev,
        [viewingPostId]: { ...prev[viewingPostId], content: contentStr },
      }))
      setStep('posts')
    } catch (err) {
      setError(err.message || 'Anpassung fehlgeschlagen. Bitte versuche es erneut.')
      setStep('posts')
    }
  }

  // Creator Report analysis
  const handleCreatorAnalysis = async (username) => {
    setIsAnalyzing(true)
    setAnalyzeError(null)
    setCreatorReport(null)
    setAnalyzedUsername(username)

    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 180000) // 3 Minuten

    try {
      const response = await fetch(import.meta.env.VITE_N8N_CREATOR_REPORT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'ngrok-skip-browser-warning': 'true' },
        body: JSON.stringify({ username }),
        signal: controller.signal,
      })

      if (!response.ok) {
        const text = await response.text().catch(() => '')
        throw new Error(`HTTP ${response.status}: ${text.substring(0, 200)}`)
      }

      const data = await response.json()

      if (!data.success) {
        throw new Error(data.error || 'Analyse fehlgeschlagen. Bitte versuche es erneut.')
      }

      setCreatorReport(data.report)
    } catch (err) {
      if (err.name === 'AbortError') {
        setAnalyzeError('Zeitüberschreitung (3 Min) — bitte versuche es erneut.')
      } else if (err.name === 'TypeError' && err.message.includes('fetch')) {
        setAnalyzeError('Netzwerkfehler — CORS oder Verbindung unterbrochen.')
      } else {
        setAnalyzeError(err.message || 'Analyse fehlgeschlagen.')
      }
    } finally {
      clearTimeout(timeout)
      setIsAnalyzing(false)
    }
  }

  // Refresh: re-run same search, keep generated articles
  const handleRefresh = () => {
    if (searchTerm) handleSearch(searchTerm)
  }

  // Fetch Fresh: re-run search AND clear all generated articles
  const handleFetchFresh = () => {
    if (searchTerm) {
      setGeneratedPosts({})
      setViewingPostId(null)
      handleSearch(searchTerm)
    }
  }

  const handleViewPost = (index) => {
    setViewingPostId(index)
  }

  const handleBackToDashboard = () => {
    setViewingPostId(null)
  }

  const handleArticleContentChange = (newContent) => {
    if (viewingPostId === null) return
    setGeneratedPosts(prev => ({
      ...prev,
      [viewingPostId]: { ...prev[viewingPostId], content: newContent },
    }))
  }

  const isLoading = step === 'searching' || step === 'generating' || step === 'refining'
  const isViewingArticle = viewingPostId !== null && generatedPosts[viewingPostId]

  if (showLanding) {
    return <LandingPage onStart={() => setShowLanding(false)} />
  }

  return (
    <div className="min-h-screen bg-[#F7F5F0]">
      <Header
        onSearch={handleSearch}
        isLoading={isLoading}
        platform={platform}
        onPlatformChange={setPlatform}
        searchMode={searchMode}
        onSearchModeChange={setSearchMode}
        accountFilter={accountFilter}
        onAccountFilterChange={setAccountFilter}
        onBackToLanding={() => setShowLanding(true)}
        appMode={appMode}
        onAppModeChange={setAppMode}
        onCreatorAnalysis={handleCreatorAnalysis}
        isAnalyzing={isAnalyzing}
      />

      <main className="max-w-7xl mx-auto px-6 pt-28 pb-12">
        {appMode === 'creator-report' ? (
          <CreatorReport
            report={creatorReport}
            isLoading={isAnalyzing}
            error={analyzeError}
            username={analyzedUsername}
          />
        ) : (
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="flex-1 lg:w-2/3">
              {/* DE/EN Toggle — nur wenn Posts vorhanden */}
              {topPosts.length > 0 && !isViewingArticle && (
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs text-[#A39E93]">Sprache:</span>
                  <div className="flex rounded-lg border border-[#E8E4DD] overflow-hidden">
                    <button
                      type="button"
                      onClick={() => setTranslateDE(false)}
                      className={`px-3 py-1.5 text-xs font-medium transition-all cursor-pointer ${!translateDE ? 'bg-[#2D2B28] text-white' : 'bg-white text-[#6B6560] hover:bg-[#F7F5F0]'}`}
                    >
                      Original
                    </button>
                    <button
                      type="button"
                      onClick={() => { setTranslateDE(true); if (!topPosts[0]?.textDe) handleSearch(searchTerm) }}
                      className={`px-3 py-1.5 text-xs font-medium transition-all cursor-pointer ${translateDE ? 'bg-[#2D2B28] text-white' : 'bg-white text-[#6B6560] hover:bg-[#F7F5F0]'}`}
                    >
                      Deutsch
                    </button>
                  </div>
                  {translateDE && !topPosts[0]?.textDe && (
                    <span className="text-xs text-[#A39E93] italic">Wird übersetzt…</span>
                  )}
                </div>
              )}
              {isViewingArticle ? (
                <ArticleView
                  content={generatedPosts[viewingPostId].content}
                  platform={platform}
                  onBack={handleBackToDashboard}
                  onContentChange={handleArticleContentChange}
                  isRefining={step === 'refining'}
                />
              ) : (
                <ContentOutput
                  step={step}
                  topPosts={topPosts}
                  searchTerm={searchTerm}
                  platform={platform}
                  generatedPosts={generatedPosts}
                  generatingIndex={generatingIndex}
                  error={error}
                  onGenerateForPost={handleGenerateForPost}
                  onViewPost={handleViewPost}
                  onRefresh={handleRefresh}
                  onFetchFresh={handleFetchFresh}
                />
              )}
            </div>

            <div className="lg:w-80 flex-shrink-0">
              <QuickEdits
                settings={settings}
                onSettingsChange={setSettings}
                step={isViewingArticle ? 'result' : step}
                onRefine={handleRefine}
                isLoading={isLoading}
              />
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

export default App
