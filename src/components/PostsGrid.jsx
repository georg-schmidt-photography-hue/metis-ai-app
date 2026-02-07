import { useState } from 'react'
import PostCard from './PostCard'
import PostDetailModal from './PostDetailModal'

export default function PostsGrid({ posts, searchTerm, platform, generatedPosts, generatingIndex, onGenerateForPost, onViewPost, onRefresh, onFetchFresh, isSearching }) {
  const [detailIndex, setDetailIndex] = useState(null)

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-sm font-semibold text-[#2D2B28]">
            {posts.length} topics available
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onRefresh}
            disabled={isSearching}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-[#E8E4DD] text-[#6B6560] hover:bg-[#F7F5F0] hover:text-[#2D2B28] transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182" />
            </svg>
            Refresh
          </button>
          <button
            onClick={onFetchFresh}
            disabled={isSearching}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-[#D97706] text-white hover:bg-[#B45309] transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
            </svg>
            Fetch Fresh
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {posts.map((post, i) => (
          <PostCard
            key={i}
            post={post}
            index={i}
            platform={platform}
            hasGeneratedContent={!!generatedPosts[i]}
            isGenerating={generatingIndex === i}
            onGenerate={() => onGenerateForPost(i)}
            onView={() => onViewPost(i)}
            onShowDetail={() => setDetailIndex(i)}
          />
        ))}
      </div>

      {detailIndex !== null && posts[detailIndex] && (
        <PostDetailModal
          post={posts[detailIndex]}
          index={detailIndex}
          platform={platform}
          onClose={() => setDetailIndex(null)}
        />
      )}
    </div>
  )
}
