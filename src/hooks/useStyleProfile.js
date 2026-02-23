import { useState, useEffect } from 'react'

const STORAGE_KEY = 'metis_style_profile'

export function useStyleProfile() {
  const [styleProfile, setStyleProfile] = useState(null)
  const [styleSource, setStyleSource] = useState('none') // 'none' | 'own' | 'creator'
  const [selectedStyleCreator, setSelectedStyleCreator] = useState(null)

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        const parsed = JSON.parse(saved)
        setStyleProfile(parsed.profile || null)
        setStyleSource(parsed.source || 'own')
      }
    } catch {}
  }, [])

  const saveOwnStyle = (profile) => {
    const data = { profile, source: 'own' }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
    setStyleProfile(profile)
    setStyleSource('own')
    setSelectedStyleCreator(null)
  }

  const useCreatorStyle = (creator) => {
    setSelectedStyleCreator(creator)
    setStyleSource('creator')
  }

  const useMixedStyle = (ownProfile, creator) => {
    setStyleProfile(ownProfile)
    setSelectedStyleCreator(creator)
    setStyleSource('mix')
  }

  const clearStyle = () => {
    localStorage.removeItem(STORAGE_KEY)
    setStyleProfile(null)
    setStyleSource('none')
    setSelectedStyleCreator(null)
  }

  // Build the style instruction string to inject into prompts
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
