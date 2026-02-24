import { useState, useEffect, useRef } from 'react'
import { supabase } from '../lib/supabase'

function getSessionId() {
  let id = localStorage.getItem('metis_session_id')
  if (!id) {
    id = 'sess_' + Math.random().toString(36).slice(2) + Date.now().toString(36)
    localStorage.setItem('metis_session_id', id)
  }
  return id
}

const SESSION_ID = getSessionId()

export function usePostArchive() {
  const [savedPosts, setSavedPosts] = useState([])
  const useSupabase = useRef(true)

  useEffect(() => {
    async function load() {
      try {
        const { data, error } = await supabase
          .from('saved_posts')
          .select('*')
          .eq('session_id', SESSION_ID)
          .order('saved_at', { ascending: false })
        if (error) throw error
        useSupabase.current = true
        setSavedPosts(data)
      } catch (_) {
        useSupabase.current = false
      }
    }
    load()
  }, [])

  const savePost = async ({ content, searchTerm, platform }) => {
    const entry = {
      id: Date.now().toString(),
      session_id: SESSION_ID,
      content,
      search_term: searchTerm || '',
      platform: platform || 'linkedin',
      saved_at: new Date().toISOString(),
    }

    if (useSupabase.current) {
      try {
        const { data, error } = await supabase
          .from('saved_posts')
          .insert(entry)
          .select()
          .single()
        if (error) throw error
        setSavedPosts(prev => [data, ...prev])
        return data
      } catch (err) {
        console.warn('Supabase post save failed:', err.message)
        useSupabase.current = false
      }
    }
    // fallback: local state only
    setSavedPosts(prev => [entry, ...prev])
    return entry
  }

  const deletePost = async (id) => {
    if (useSupabase.current) {
      try {
        await supabase.from('saved_posts').delete().eq('id', id).eq('session_id', SESSION_ID)
      } catch (_) {}
    }
    setSavedPosts(prev => prev.filter(p => p.id !== id))
  }

  const updatePost = async (id, content) => {
    if (useSupabase.current) {
      try {
        await supabase.from('saved_posts').update({ content }).eq('id', id).eq('session_id', SESSION_ID)
      } catch (_) {}
    }
    setSavedPosts(prev => prev.map(p => p.id === id ? { ...p, content } : p))
  }

  return { savedPosts, savePost, deletePost, updatePost }
}
