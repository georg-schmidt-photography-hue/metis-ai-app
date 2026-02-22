export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const { keyword, compareWith, geo = 'DE' } = req.body
  if (!keyword) return res.status(400).json({ error: 'keyword erforderlich' })

  try {
    const compareText = compareWith ? ` im Vergleich zu "${compareWith}"` : ''

    const prompt = `Analysiere das Suchinteresse für "${keyword}"${compareText} in Deutschland.

Antworte NUR mit diesem JSON (kein Text davor/danach):
{
  "currentScore": <Zahl 0-100, aktuelles relatives Interesse>,
  "peakScore": <Zahl 0-100, Jahreshöchstwert>,
  "trend": <"rising"|"falling"|"stable">,
  "timelineData": [
    { "date": "Feb 2025", "value": <0-100>${compareWith ? ', "compareValue": <0-100>' : ''} },
    ... (12 Einträge, einen pro Monat Feb 2025 bis Jan 2026)
  ],
  "risingQueries": [
    { "query": "...", "value": "+XX%" },
    ... (8 Einträge, aufsteigende Suchanfragen zu "${keyword}")
  ],
  "topQueries": [
    { "query": "...", "value": <Zahl 0-100> },
    ... (8 Einträge, beliebteste Suchanfragen zu "${keyword}")
  ],
  "risingTopics": [
    { "title": "...", "type": "..." },
    ... (6 verwandte aufsteigende Themen)
  ]
}`

    const perpRes = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.PERPLEXITY_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'sonar',
        max_tokens: 1500,
        messages: [
          { role: 'system', content: 'Antworte NUR mit validem JSON. Kein Markdown, keine Erklärungen.' },
          { role: 'user', content: prompt },
        ],
      }),
    })

    const perpData = await perpRes.json()
    const raw = (perpData.choices?.[0]?.message?.content || '').trim()
      .replace(/```json\s*/gi, '').replace(/```\s*/g, '').trim()

    const start = raw.indexOf('{')
    const end = raw.lastIndexOf('}')
    if (start === -1) throw new Error('Keine Trend-Daten erhalten')

    const parsed = JSON.parse(raw.slice(start, end + 1))

    const timelineData = (parsed.timelineData || []).map(d => ({
      date: d.date || '',
      value: Math.min(100, Math.max(0, Number(d.value) || 0)),
      compareValue: compareWith ? Math.min(100, Math.max(0, Number(d.compareValue) || 0)) : null,
    }))

    const currentScore = parsed.currentScore ?? timelineData[timelineData.length - 1]?.value ?? 0
    const peakScore = parsed.peakScore ?? Math.max(...timelineData.map(d => d.value), 1)

    res.json({
      keyword,
      compareKeyword: compareWith || null,
      geo,
      currentScore,
      peakScore,
      trend: parsed.trend || 'stable',
      timelineData,
      risingQueries: parsed.risingQueries || [],
      topQueries: parsed.topQueries || [],
      risingTopics: parsed.risingTopics || [],
      topTopics: [],
    })
  } catch (err) {
    res.status(500).json({ error: err.message || 'Trend-Analyse fehlgeschlagen' })
  }
}
