import PostCard from './PostCard'

export default function PostsGrid({ posts, searchTerm, onGenerate, isGenerating }) {
  return (
    <div>
      <div className="mb-4">
        <h2 className="text-sm font-semibold text-[#2D2B28]">
          Top {posts.length} Posts for "{searchTerm}"
        </h2>
        <p className="text-xs text-[#A39E93] mt-0.5">
          Sorted by engagement
        </p>
      </div>

      <div className="space-y-3 mb-6">
        {posts.map((post, i) => (
          <PostCard key={i} post={post} index={i} />
        ))}
      </div>

      <button
        onClick={onGenerate}
        disabled={isGenerating}
        className="w-full py-3 px-6 bg-[#D97706] hover:bg-[#B45309] disabled:bg-[#D4A574] text-white text-sm font-semibold rounded-xl transition-colors cursor-pointer disabled:cursor-not-allowed"
      >
        {isGenerating ? (
          <span className="flex items-center justify-center gap-2">
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Generating your post...
          </span>
        ) : (
          'Generate Post'
        )}
      </button>
    </div>
  )
}
