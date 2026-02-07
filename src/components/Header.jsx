import { useState } from 'react'

export default function Header({ onSearch, isLoading }) {
  const [searchTerm, setSearchTerm] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (searchTerm.trim() && !isLoading) {
      onSearch(searchTerm.trim())
    }
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#FFFDF9] border-b border-[#E8E4DD]">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center gap-8">
        <div className="flex-shrink-0">
          <span className="text-xl font-bold text-[#2D2B28] tracking-tight">
            Metis AI
          </span>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 max-w-2xl mx-auto">
          <div className="relative">
            <svg
              className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#A39E93]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
              />
            </svg>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search Topic... z.B. Photovoltaik Recruiting"
              className="w-full pl-12 pr-4 py-2.5 border border-[#E8E4DD] rounded-xl text-sm text-[#2D2B28] placeholder-[#A39E93] bg-[#F7F5F0] focus:outline-none focus:ring-2 focus:ring-[#D97706] focus:border-transparent focus:bg-white transition-all"
              disabled={isLoading}
            />
            {isLoading && (
              <div className="absolute right-4 top-1/2 -translate-y-1/2">
                <div className="w-5 h-5 border-2 border-[#D97706] border-t-transparent rounded-full animate-spin" />
              </div>
            )}
          </div>
        </form>

        <div className="flex-shrink-0 w-20" />
      </div>
    </header>
  )
}
