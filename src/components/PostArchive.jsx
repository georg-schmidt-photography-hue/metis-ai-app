import { useState } from 'react'

const platformLabels = { linkedin: 'LinkedIn', youtube: 'YouTube', twitter: 'Twitter / X' }
const platformColors = { linkedin: 'bg-[#EFF6FF] text-[#1D4ED8]', youtube: 'bg-red-50 text-red-700', twitter: 'bg-[#F0F9FF] text-[#0369A1]' }

function PostCard({ post, onDelete, onEdit }) {
  const [expanded, setExpanded] = useState(false)
  const [editing, setEditing] = useState(false)
  const [editText, setEditText] = useState(post.content)
  const [copied, setCopied] = useState(false)

  const preview = post.content?.split('\n').slice(0, 3).join('\n')
  const hasMore = (post.content?.split('\n').length || 0) > 3

  const handleCopy = async () => {
    await navigator.clipboard.writeText(post.content).catch(() => {})
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleSaveEdit = () => {
    onEdit(post.id, editText)
    setEditing(false)
  }

  const date = new Date(post.saved_at).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: '2-digit' })

  return (
    <div className="bg-[#FFFDF9] border border-[#E8E4DD] rounded-xl p-4 space-y-3">
      {/* Meta */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${platformColors[post.platform] || platformColors.linkedin}`}>
          {platformLabels[post.platform] || 'LinkedIn'}
        </span>
        {post.search_term && (
          <span className="text-[10px] text-[#A39E93] bg-[#F0EDE8] px-2 py-0.5 rounded-full">
            #{post.search_term}
          </span>
        )}
        <span className="text-[10px] text-[#C4BFB6] ml-auto">{date}</span>
      </div>

      {/* Content */}
      {editing ? (
        <div className="space-y-2">
          <textarea
            value={editText}
            onChange={e => setEditText(e.target.value)}
            rows={8}
            className="w-full p-3 text-sm text-[#2D2B28] bg-[#F7F5F0] border border-[#E8E4DD] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D97706] resize-y"
          />
          <div className="flex gap-2">
            <button onClick={handleSaveEdit} className="px-3 py-1.5 bg-[#D97706] text-white text-xs font-semibold rounded-lg cursor-pointer hover:bg-[#B45309]">Speichern</button>
            <button onClick={() => { setEditing(false); setEditText(post.content) }} className="px-3 py-1.5 text-xs text-[#6B6560] border border-[#E8E4DD] rounded-lg cursor-pointer hover:bg-[#F7F5F0]">Abbrechen</button>
          </div>
        </div>
      ) : (
        <div>
          <p className="text-sm text-[#2D2B28] leading-relaxed whitespace-pre-wrap">
            {expanded ? post.content : preview}
            {!expanded && hasMore && '…'}
          </p>
          {hasMore && (
            <button onClick={() => setExpanded(e => !e)} className="text-xs text-[#D97706] mt-1 cursor-pointer hover:underline">
              {expanded ? 'Weniger anzeigen' : 'Mehr anzeigen'}
            </button>
          )}
        </div>
      )}

      {/* Actions */}
      {!editing && (
        <div className="flex items-center gap-2 pt-1">
          <button onClick={handleCopy} className="flex items-center gap-1 text-xs text-[#6B6560] border border-[#E8E4DD] px-2.5 py-1.5 rounded-lg hover:bg-[#F7F5F0] cursor-pointer transition-all">
            {copied ? '✓ Kopiert' : 'Kopieren'}
          </button>
          <button onClick={() => setEditing(true)} className="flex items-center gap-1 text-xs text-[#6B6560] border border-[#E8E4DD] px-2.5 py-1.5 rounded-lg hover:bg-[#F7F5F0] cursor-pointer transition-all">
            Bearbeiten
          </button>
          <button onClick={() => onDelete(post.id)} className="ml-auto text-xs text-red-400 hover:text-red-600 cursor-pointer transition-colors">
            Löschen
          </button>
        </div>
      )}
    </div>
  )
}

export default function PostArchive({ savedPosts, onDelete, onEdit }) {
  const [filter, setFilter] = useState('all')

  const platforms = ['all', ...new Set(savedPosts.map(p => p.platform).filter(Boolean))]
  const filtered = filter === 'all' ? savedPosts : savedPosts.filter(p => p.platform === filter)

  return (
    <div className="space-y-5 max-w-3xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-[#2D2B28]">Meine Posts</h2>
          <p className="text-xs text-[#A39E93] mt-0.5">{savedPosts.length} gespeicherte Posts</p>
        </div>

        {/* Filter */}
        {platforms.length > 1 && (
          <div className="flex gap-1 bg-[#F0EDE8] rounded-xl p-1">
            {platforms.map(p => (
              <button
                key={p}
                onClick={() => setFilter(p)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                  filter === p ? 'bg-white text-[#2D2B28] shadow-sm' : 'text-[#6B6560] hover:text-[#2D2B28]'
                }`}
              >
                {p === 'all' ? 'Alle' : platformLabels[p] || p}
              </button>
            ))}
          </div>
        )}
      </div>

      {filtered.length === 0 ? (
        <div className="bg-[#FFFDF9] border border-[#E8E4DD] rounded-2xl p-12 text-center">
          <p className="text-2xl mb-3">📝</p>
          <p className="text-sm font-semibold text-[#2D2B28] mb-1">Noch keine Posts gespeichert</p>
          <p className="text-xs text-[#A39E93]">Generiere einen Post und klicke auf "Speichern" um ihn hier zu sichern.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map(post => (
            <PostCard key={post.id} post={post} onDelete={onDelete} onEdit={onEdit} />
          ))}
        </div>
      )}
    </div>
  )
}
