import { useState } from 'react'
import LoadingSkeleton from './LoadingSkeleton'
import PostsGrid from './PostsGrid'

export default function ContentOutput({
  step,
  topPosts,
  searchTerm,
  generatedPost,
  isLoading,
  error,
  onGenerate,
  onBackToPosts,
}) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    if (!generatedPost) return
    try {
      await navigator.clipboard.writeText(generatedPost)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      const textarea = document.createElement('textarea')
      textarea.value = generatedPost
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('copy')
      document.body.removeChild(textarea)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 min-h-[400px] relative">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          {step === 'result' && (
            <button
              onClick={onBackToPosts}
              className="flex items-center gap-1 text-xs text-gray-500 hover:text-indigo-600 transition-colors cursor-pointer"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.75 19.5L8.25 12l7.5-7.5" />
              </svg>
              Back to Posts
            </button>
          )}
          <h2 className="text-sm font-semibold text-gray-900">
            {step === 'posts' || step === 'generating'
              ? 'Top Posts'
              : step === 'result'
              ? 'Generated Post'
              : 'Output'}
          </h2>
        </div>
        {step === 'result' && generatedPost && (
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-all cursor-pointer"
          >
            {copied ? (
              <>
                <svg className="w-3.5 h-3.5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Copied!
              </>
            ) : (
              <>
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9.75a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184" />
                </svg>
                Copy
              </>
            )}
          </button>
        )}
      </div>

      <div className="border-t border-gray-100 pt-4">
        {step === 'searching' ? (
          <LoadingSkeleton text="Searching for top posts..." />
        ) : step === 'posts' ? (
          <PostsGrid
            posts={topPosts}
            searchTerm={searchTerm}
            onGenerate={onGenerate}
            isGenerating={false}
          />
        ) : step === 'generating' ? (
          <LoadingSkeleton text="Generating your post..." />
        ) : step === 'result' && generatedPost ? (
          <div className="text-sm text-gray-800 leading-relaxed whitespace-pre-wrap">
            {generatedPost}
          </div>
        ) : error ? (
          <div className="flex items-center gap-2 text-red-500 text-sm">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
            </svg>
            {error}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <svg className="w-12 h-12 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
            </svg>
            <p className="text-sm text-gray-400">
              Enter a topic and press Enter to discover top LinkedIn posts
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
