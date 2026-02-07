import { useState } from 'react'
import Header from './components/Header'
import ContentOutput from './components/ContentOutput'
import QuickEdits from './components/QuickEdits'

function App() {
  const [step, setStep] = useState('idle') // idle | searching | posts | generating | result
  const [topPosts, setTopPosts] = useState([])
  const [generatedPost, setGeneratedPost] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [error, setError] = useState(null)
  const [settings, setSettings] = useState({
    tone: 'professional',
    length: 'medium',
    engagement: 'high',
    format: 'story',
    quickEdits: [],
  })

  // Step 1: Search for top posts
  const handleSearch = async (term) => {
    setStep('searching')
    setError(null)
    setSearchTerm(term)
    setTopPosts([])
    setGeneratedPost('')

    try {
      const response = await fetch(import.meta.env.VITE_N8N_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ searchTerm: term }),
      })

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`)
      }

      const data = await response.json()

      if (!data.success || !data.posts || data.posts.length === 0) {
        throw new Error('No posts found. Try a different search term.')
      }

      setTopPosts(data.posts)
      setStep('posts')
    } catch (err) {
      setError(err.message || 'Failed to search. Please try again.')
      setStep('idle')
    }
  }

  // Step 2: Generate post from top posts + settings
  const handleGenerate = async () => {
    setStep('generating')
    setError(null)

    try {
      const response = await fetch(import.meta.env.VITE_N8N_GENERATE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          posts: topPosts,
          searchTerm,
          tone: settings.tone,
          length: settings.length,
          engagement: settings.engagement,
          format: settings.format,
          quickEdits: settings.quickEdits || [],
        }),
      })

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`)
      }

      const data = await response.json()
      const post = data.generatedPost || data.output || data.text || ''

      if (!post) {
        throw new Error('No content received from the server.')
      }

      setGeneratedPost(typeof post === 'string' ? post : JSON.stringify(post, null, 2))
      setStep('result')
    } catch (err) {
      setError(err.message || 'Failed to generate content. Please try again.')
      setStep('posts') // go back to posts view on error
    }
  }

  const handleBackToPosts = () => {
    setStep('posts')
    setGeneratedPost('')
  }

  const isLoading = step === 'searching' || step === 'generating'

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <Header onSearch={handleSearch} isLoading={isLoading} />

      <main className="max-w-7xl mx-auto px-6 pt-24 pb-12">
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1 lg:w-2/3">
            <ContentOutput
              step={step}
              topPosts={topPosts}
              searchTerm={searchTerm}
              generatedPost={generatedPost}
              isLoading={isLoading}
              error={error}
              onGenerate={handleGenerate}
              onBackToPosts={handleBackToPosts}
            />
          </div>

          <div className="lg:w-80 flex-shrink-0">
            <QuickEdits
              settings={settings}
              onSettingsChange={setSettings}
            />
          </div>
        </div>
      </main>
    </div>
  )
}

export default App
