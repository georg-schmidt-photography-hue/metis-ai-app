import LoadingSkeleton from './LoadingSkeleton'
import PostsGrid from './PostsGrid'

export default function ContentOutput({
  step,
  topPosts,
  searchTerm,
  platform,
  generatedPosts,
  generatingIndex,
  error,
  onGenerateForPost,
  onViewPost,
  onRefresh,
  onFetchFresh,
}) {
  return (
    <div className="rounded-xl p-6 min-h-[400px] relative" style={{background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)'}}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold" style={{color:'rgba(255,255,255,0.85)'}}>
          {step === 'posts' || step === 'generating' ? 'Top Beiträge' : 'Ergebnis'}
        </h2>
      </div>

      <div className="pt-4" style={{borderTop:'1px solid rgba(255,255,255,0.07)'}}>
        {step === 'searching' ? (
          <LoadingSkeleton text="Suche nach Top-Beiträgen..." />
        ) : step === 'posts' || step === 'generating' ? (
          <PostsGrid
            posts={topPosts}
            searchTerm={searchTerm}
            platform={platform}
            generatedPosts={generatedPosts}
            generatingIndex={generatingIndex}
            onGenerateForPost={onGenerateForPost}
            onViewPost={onViewPost}
            onRefresh={onRefresh}
            onFetchFresh={onFetchFresh}
            isSearching={step === 'searching'}
          />
        ) : error ? (
          <div className="flex items-center gap-2 text-sm" style={{color:'#f87171'}}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
            </svg>
            {error}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <svg className="w-12 h-12 mb-4" style={{color:'rgba(255,255,255,0.15)'}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
            </svg>
            <p className="text-sm" style={{color:'rgba(255,255,255,0.3)'}}>
              Gib ein Thema ein und drücke Enter, um Top-Beiträge zu finden
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
