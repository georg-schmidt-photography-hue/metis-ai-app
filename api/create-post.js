export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const { topic, creator, trendContext } = req.body
  if (!topic || !creator) return res.status(400).json({ error: 'topic und creator erforderlich' })

  // Step 1: Perplexity — get current real-time research on the topic
  let currentResearch = ''
  try {
    const perpRes = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.PERPLEXITY_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'sonar',
        max_tokens: 800,
        messages: [
          {
            role: 'system',
            content: 'Du recherchierst aktuelle Fakten und Entwicklungen zu einem Thema. Gib eine kompakte Zusammenfassung der wichtigsten aktuellen Informationen, Zahlen, Trends und Entwicklungen. Nur Fakten, keine Empfehlungen.',
          },
          {
            role: 'user',
            content: `Recherchiere aktuelle Informationen zu: "${topic}"\n\nFokus: aktuelle Zahlen, Entwicklungen 2025/2026, relevante Trends, konkrete Fakten die man in einem LinkedIn Post verwenden kann.`,
          },
        ],
      }),
    })
    const perpData = await perpRes.json()
    currentResearch = perpData.choices?.[0]?.message?.content || ''
  } catch (_) {
    // Falls Perplexity nicht verfügbar, ohne Research weitermachen
  }

  // Step 2: Build creator style context
  const pillars = creator.contentPillars?.map(p => `${p.pillar} (${p.percentage}%)`).join(', ') || ''
  const tactics = creator.tactics?.slice(0, 3).map(t => `• ${t.title}: ${t.description || ''}`).join('\n') || ''
  const formats = creator.formatBreakdown?.map(f => `${f.format} (${f.percentage}%)`).join(', ') || ''

  const trendInfo = trendContext
    ? `\nGOOGLE TRENDS KONTEXT:\n- Trend: ${trendContext.trend === 'rising' ? '📈 Steigend' : trendContext.trend === 'falling' ? '📉 Fallend' : '➡️ Stabil'}\n- Aktueller Score: ${trendContext.currentScore}/100\n- Aufsteigende Fragen: ${trendContext.risingQueries?.slice(0, 3).map(q => q.query).join(', ') || ''}`
    : ''

  const researchSection = currentResearch
    ? `\nAKTUELLE RECHERCHE (Perplexity, Stand heute):\n${currentResearch}`
    : ''

  const systemPrompt = `Du bist ein LinkedIn Content Creator und schreibst Posts im exakten Stil von ${creator.name}.

CREATOR-PROFIL:
- Name: ${creator.name}
- Erfolgsfaktor: ${creator.successFactor || ''}
- Inhalts-Schwerpunkte: ${pillars}
- Bevorzugte Formate: ${formats}

TAKTIKEN DIESES CREATORS:
${tactics}
${trendInfo}
${researchSection}

STIL-REGELN:
- Schreibe GENAU so wie ${creator.name} auf LinkedIn schreibt
- Übernimm die Satzstruktur, den Rhythmus, die Zeilenumbrüche
- Nutze dieselbe Tonalität und Energie
- Baue den Post nach dem typischen Format dieses Creators auf
- Verwende die aktuellen Fakten aus der Recherche — mache den Post zeitgemäß und relevant
- Nutze Hashtags wie dieser Creator sie einsetzt

WICHTIG: Schreibe den Post auf DEUTSCH. Nur den fertigen Post ausgeben, keine Erklärungen.`

  const userPrompt = `Schreibe einen LinkedIn Post über folgendes Thema im Stil von ${creator.name}:

Thema: ${topic}

Nutze die aktuellen Fakten aus der Recherche oben um den Post konkret und aktuell zu machen.`

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4.1-mini',
        max_tokens: 1500,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
      }),
    })

    const data = await response.json()
    const post = data.choices?.[0]?.message?.content?.trim() || ''

    if (!post) throw new Error('Kein Inhalt vom Server erhalten')

    res.json({ post, researchUsed: !!currentResearch })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}
