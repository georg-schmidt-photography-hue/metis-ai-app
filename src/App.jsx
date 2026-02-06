import { useState } from 'react'
import Header from './components/Header'
import ContentOutput from './components/ContentOutput'
import QuickEdits from './components/QuickEdits'

function App() {
  const [generatedPost, setGeneratedPost] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [settings, setSettings] = useState({
    tone: 'professional',
    length: 'medium',
    engagement: 'high',
    format: 'story',
  })

  const handleSearch = async (searchTerm) => {
    setIsLoading(true)
    setError(null)
    setGeneratedPost('')

    try {
      const response = await fetch(import.meta.env.VITE_N8N_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          searchTerm,
          ...settings,
        }),
      })

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`)
      }

      const data = await response.json()
      const post = data.generatedPost || data.output || data.text || data.message || ''

      if (!post) {
        throw new Error('No content received from the server.')
      }

      setGeneratedPost(typeof post === 'string' ? post : JSON.stringify(post, null, 2))
    } catch (err) {
      setError(err.message || 'Failed to generate content. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <Header onSearch={handleSearch} isLoading={isLoading} />

      <main className="max-w-7xl mx-auto px-6 pt-24 pb-12">
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1 lg:w-2/3">
            <ContentOutput
              content={generatedPost}
              isLoading={isLoading}
              error={error}
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
