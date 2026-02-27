import { useState, useEffect, useRef } from 'react'
import { supabase } from '../lib/supabase'

const STORAGE_KEY = 'metis_style_profile'
const SESSION_ID = 'default'

export function useStyleProfile() {
  const [styleProfile, setStyleProfile] = useState(null)
  const [styleSource, setStyleSource] = useState('none')
  const [selectedStyleCreator, setSelectedStyleCreator] = useState(null)
  const useSupabase = useRef(true)

  useEffect(() => {
    async function load() {
      try {
        const { data, error } = await supabase
          .from('style_profiles')
          .select('*')
          .order('updated_at', { ascending: false })
          .limit(1)
          .maybeSingle()

        if (error) throw error
        if (data) {
          setStyleProfile(data.profile || null)
          setStyleSource(data.source || 'none')
          setSelectedStyleCreator(data.selected_creator || null)
        }
        useSupabase.current = true
      } catch (_) {
        useSupabase.current = false
        try {
          const saved = localStorage.getItem(STORAGE_KEY)
          if (saved) {
            const parsed = JSON.parse(saved)
            setStyleProfile(parsed.profile || null)
            setStyleSource(parsed.source || 'own')
            setSelectedStyleCreator(parsed.selectedCreator || null)
          }
        } catch {}
      }
    }
    load()
  }, [])

  const persist = async (source, profile, creator) => {
    if (useSupabase.current) {
      try {
        await supabase.from('style_profiles').upsert({
          session_id: SESSION_ID,
          source,
          profile: profile || null,
          selected_creator: creator || null,
          updated_at: new Date().toISOString(),
        }, { onConflict: 'session_id' })
      } catch (_) {
        useSupabase.current = false
      }
    }
    if (!useSupabase.current) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ source, profile, selectedCreator: creator }))
    }
  }

  const saveOwnStyle = (profile) => {
    setStyleProfile(profile)
    setStyleSource('own')
    setSelectedStyleCreator(null)
    persist('own', profile, null)
  }

  const useCreatorStyle = (creator) => {
    setSelectedStyleCreator(creator)
    setStyleSource('creator')
    persist('creator', null, creator)
  }

  const useMixedStyle = (ownProfile, creator) => {
    setStyleProfile(ownProfile)
    setSelectedStyleCreator(creator)
    setStyleSource('mix')
    persist('mix', ownProfile, creator)
  }

  const clearStyle = () => {
    setStyleProfile(null)
    setStyleSource('none')
    setSelectedStyleCreator(null)
    persist('none', null, null)
    localStorage.removeItem(STORAGE_KEY)
  }

  const buildStyleInstruction = () => {
    if (styleSource === 'none') return null

    if (styleSource === 'own' && styleProfile) {
      return `WICHTIG — Schreibe im persönlichen Stil des Users:
- Ton: ${styleProfile.tone}
- Satzbau: ${styleProfile.sentenceStyle}
- Hook-Muster: ${styleProfile.hookPattern}
- Emojis: ${styleProfile.emojis}
- Call-to-Action: ${styleProfile.cta}
- Vokabular: ${styleProfile.vocabulary}
- Vermeide unbedingt: ${styleProfile.avoid}
Zusammenfassung: ${styleProfile.summary}`
    }

    if (styleSource === 'creator' && selectedStyleCreator?.fullReport) {
      const r = selectedStyleCreator.fullReport
      return `WICHTIG — Schreibe im Stil von ${selectedStyleCreator.name || selectedStyleCreator.username}:
- Ton und Stimme: ${r.writingStyle?.tone || r.contentStyle || 'professionell und direkt'}
- Typische Struktur: ${r.writingStyle?.structure || r.postStructure || 'kurze prägnante Sätze'}
- Hook-Stil: ${r.writingStyle?.hooks || r.hookPatterns || 'provokante Einstiegsfrage'}
- Besonderheiten: ${r.writingStyle?.uniqueTraits || r.uniqueElements || 'authentische Perspektive'}`
    }

    if (styleSource === 'mix' && styleProfile && selectedStyleCreator?.fullReport) {
      const r = selectedStyleCreator.fullReport
      return `WICHTIG — Schreibe in einem Stil-Mix:
Eigener Stil (70%):
- Ton: ${styleProfile.tone}
- Satzbau: ${styleProfile.sentenceStyle}
- Vermeide: ${styleProfile.avoid}

Annäherung an ${selectedStyleCreator.name || selectedStyleCreator.username} (30%):
- Ton: ${r.writingStyle?.tone || r.contentStyle || 'professionell'}
- Hook-Stil: ${r.writingStyle?.hooks || r.hookPatterns || 'stark'}

Behalte die Persönlichkeit des Users bei, nutze aber die Energie und Struktur des Creators.`
    }

    return null
  }

  return {
    styleProfile,
    styleSource,
    selectedStyleCreator,
    saveOwnStyle,
    useCreatorStyle,
    useMixedStyle,
    clearStyle,
    buildStyleInstruction,
  }
}
