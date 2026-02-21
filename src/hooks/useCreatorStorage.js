import { useState, useEffect } from 'react'

const STORAGE_KEY = 'metis_saved_creators'

export function useCreatorStorage() {
  const [savedCreators, setSavedCreators] = useState([])

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) setSavedCreators(JSON.parse(raw))
    } catch (_) {}
  }, [])

  const saveCreator = (report, username) => {
    const entry = {
      id: username || report.creator?.name?.toLowerCase().replace(/\s+/g, '-') || Date.now().toString(),
      savedAt: new Date().toISOString(),
      username,
      name: report.creator?.name || username,
      headline: report.creator?.headline || '',
      avatarUrl: report.creator?.avatarUrl || '',
      followers: report.creator?.followers || '',
      profileUrl: report.creator?.profileUrl || '',
      postsPerWeek: report.stats?.postsPerWeek || '–',
      postingTime: report.stats?.postingTime || '',
      avgReactions: report.stats?.avgReactions || 0,
      ctaFrequency: report.stats?.ctaFrequency || '–',
      successFactor: report.successFactor || '',
      contentPillars: report.contentPillars || [],
      tactics: report.tactics || [],
      formatBreakdown: report.formatBreakdown || [],
      // Full report for later use (post generation)
      fullReport: report,
    }

    setSavedCreators(prev => {
      const filtered = prev.filter(c => c.id !== entry.id)
      const updated = [entry, ...filtered]
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
      return updated
    })

    return entry
  }

  const deleteCreator = (id) => {
    setSavedCreators(prev => {
      const updated = prev.filter(c => c.id !== id)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
      return updated
    })
  }

  const isCreatorSaved = (username) => {
    if (!username) return false
    const id = username.toLowerCase().replace(/\s+/g, '-')
    return savedCreators.some(c => c.id === id || c.username === username)
  }

  return { savedCreators, saveCreator, deleteCreator, isCreatorSaved }
}
