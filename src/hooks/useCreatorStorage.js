import { useState, useEffect, useRef } from 'react'
import { supabase } from '../lib/supabase'

// Stable browser session ID (persists across reloads, resets on clear)
function getSessionId() {
  let id = localStorage.getItem('metis_session_id')
  if (!id) {
    id = 'sess_' + Math.random().toString(36).slice(2) + Date.now().toString(36)
    localStorage.setItem('metis_session_id', id)
  }
  return id
}

const SESSION_ID = getSessionId()
const FALLBACK_KEY = 'metis_saved_creators'

export function useCreatorStorage() {
  const [savedCreators, setSavedCreators] = useState([])
  const [loaded, setLoaded] = useState(false)
  const useSupabase = useRef(true)

  // Load creators on mount
  useEffect(() => {
    async function load() {
      try {
        const { data, error } = await supabase
          .from('saved_creators')
          .select('*')
          .eq('session_id', SESSION_ID)
          .order('saved_at', { ascending: false })

        if (error) throw error
        useSupabase.current = true
        setSavedCreators(data.map(row => ({
          ...row.data,
          id: row.creator_id,
          _dbId: row.id,
        })))
      } catch (_) {
        // Fallback to localStorage
        useSupabase.current = false
        try {
          const raw = localStorage.getItem(FALLBACK_KEY)
          if (raw) setSavedCreators(JSON.parse(raw))
        } catch (_) {}
      } finally {
        setLoaded(true)
      }
    }
    load()
  }, [])

  const saveCreator = async (report, username) => {
    const creatorId = username
      ? username.toLowerCase().replace(/\s+/g, '-')
      : report.creator?.name?.toLowerCase().replace(/\s+/g, '-') || Date.now().toString()

    const entry = {
      id: creatorId,
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
      fullReport: report,
    }

    if (useSupabase.current) {
      try {
        // Upsert (update if exists, insert if not)
        const { error } = await supabase
          .from('saved_creators')
          .upsert({
            session_id: SESSION_ID,
            creator_id: creatorId,
            data: entry,
            saved_at: new Date().toISOString(),
          }, { onConflict: 'session_id,creator_id' })

        if (error) throw error
      } catch (err) {
        console.warn('Supabase save failed, using localStorage:', err.message)
        useSupabase.current = false
      }
    }

    setSavedCreators(prev => {
      const filtered = prev.filter(c => c.id !== creatorId)
      const updated = [entry, ...filtered]
      if (!useSupabase.current) {
        localStorage.setItem(FALLBACK_KEY, JSON.stringify(updated))
      }
      return updated
    })

    return entry
  }

  const deleteCreator = async (id) => {
    if (useSupabase.current) {
      try {
        const { error } = await supabase
          .from('saved_creators')
          .delete()
          .eq('session_id', SESSION_ID)
          .eq('creator_id', id)

        if (error) throw error
      } catch (err) {
        console.warn('Supabase delete failed:', err.message)
      }
    }

    setSavedCreators(prev => {
      const updated = prev.filter(c => c.id !== id)
      if (!useSupabase.current) {
        localStorage.setItem(FALLBACK_KEY, JSON.stringify(updated))
      }
      return updated
    })
  }

  const isCreatorSaved = (username) => {
    if (!username) return false
    const id = username.toLowerCase().replace(/\s+/g, '-')
    return savedCreators.some(c => c.id === id || c.username === username)
  }

  return { savedCreators, saveCreator, deleteCreator, isCreatorSaved, loaded }
}
