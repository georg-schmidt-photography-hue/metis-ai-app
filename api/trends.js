import googleTrends from 'google-trends-api'
import https from 'https'

// Google Autocomplete — gibt echte Suchvorschläge zurück
function getAutocomplete(query, hl = 'de') {
  return new Promise((resolve) => {
    const url = `https://suggestqueries.google.com/complete/search?client=firefox&q=${encodeURIComponent(query)}&hl=${hl}`
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      let data = ''
      res.on('data', c => data += c)
      res.on('end', () => { try { resolve(JSON.parse(data)[1] || []) } catch { resolve([]) } })
    }).on('error', () => resolve([]))
  })
}

// GPT als Fallback für Nischen-Keywords
async function getRelatedFromGPT(keyword) {
  try {
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${process.env.OPENAI_API_KEY}` },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        max_tokens: 120,
        messages: [{ role: 'user', content: `Gib mir exakt 8 verwandte Google-Suchbegriffe zu "${keyword}" die in Deutschland häufig gesucht werden. Bevorzuge bekannte Tools, Plattformen, Markennamen und häufig gesuchte Oberbegriffe. Keine Nischenbegriffe. NUR JSON-Array: ["Begriff1",...,"Begriff8"]` }],
      }),
    })
    const json = await res.json()
    const text = json.choices?.[0]?.message?.content?.trim() || '[]'
    const match = text.match(/\[.*\]/s)
    return match ? JSON.parse(match[0]) : []
  } catch { return [] }
}

// Scores für eine Batch von max. 4 Kandidaten holen (+ Keyword als Anker)
async function scoreBatch(keyword, candidates, geo, startTime) {
  if (!candidates.length) return []
  try {
    const allKw = [keyword, ...candidates]
    const raw = await googleTrends.interestOverTime({ keyword: allKw, geo, startTime })
    const items = JSON.parse(raw).default?.timelineData || []
    const half = Math.floor(items.length / 2)
    return candidates.map((kw, i) => {
      const idx = i + 1
      const vals = items.map(it => it.value?.[idx] || 0)
      const avg = Math.round(vals.reduce((a, b) => a + b, 0) / (vals.length || 1))
      const recent = items.slice(half).map(it => it.value?.[idx] || 0)
      const older = items.slice(0, half).map(it => it.value?.[idx] || 0)
      const rAvg = recent.reduce((a, b) => a + b, 0) / (recent.length || 1)
      const oAvg = older.reduce((a, b) => a + b, 0) / (older.length || 1)
      const change = oAvg > 0 ? Math.round(((rAvg - oAvg) / oAvg) * 100) : null
      return { query: kw, avg, change }
    }).filter(e => e.avg > 0)
  } catch { return [] }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const { keyword, compareWith, geo = 'DE' } = req.body
  if (!keyword) return res.status(400).json({ error: 'keyword erforderlich' })

  try {
    const startTime = new Date()
    startTime.setDate(startTime.getDate() - 90)

    const keywords = compareWith ? [keyword, compareWith] : [keyword]

    // 1. Interest Over Time (Timeline)
    const timelineRaw = await googleTrends.interestOverTime({
      keyword: keywords,
      geo,
      startTime,
      granularTime: false,
    })
    const timelineJson = JSON.parse(timelineRaw)
    const timelineItems = timelineJson.default?.timelineData || []

    // Aggregate weekly data to monthly averages
    const monthMap = {}
    for (const item of timelineItems) {
      const date = new Date(Number(item.time) * 1000)
      const key = date.toLocaleDateString('de-DE', { month: 'short', year: 'numeric' })
      if (!monthMap[key]) monthMap[key] = { sum: 0, sum2: 0, count: 0 }
      monthMap[key].sum += item.value[0] || 0
      if (keywords.length > 1) monthMap[key].sum2 += item.value[1] || 0
      monthMap[key].count++
    }

    const timelineData = Object.entries(monthMap).map(([date, v]) => ({
      date,
      value: Math.round(v.sum / v.count),
      compareValue: compareWith ? Math.round(v.sum2 / v.count) : null,
    }))

    const values = timelineData.map(d => d.value)
    const currentScore = values[values.length - 1] ?? 0
    const peakScore = Math.max(...values, 1)
    const recent3 = values.slice(-3)
    const older3 = values.slice(-6, -3)
    const recentAvg = recent3.reduce((a, b) => a + b, 0) / (recent3.length || 1)
    const olderAvg = older3.reduce((a, b) => a + b, 0) / (older3.length || 1)
    const trend = recentAvg > olderAvg * 1.1 ? 'rising' : recentAvg < olderAvg * 0.9 ? 'falling' : 'stable'

    // 2. Related Queries — Autocomplete primär, GPT als Fallback, 2 Batches → bis zu 8 Ergebnisse
    let risingQueries = []
    let topQueries = []

    try {
      // Kandidaten holen: Autocomplete zuerst
      let candidates = (await getAutocomplete(keyword))
        .filter(s => s.toLowerCase() !== keyword.toLowerCase())
        .slice(0, 8)

      // Fallback zu GPT wenn Autocomplete < 3 brauchbare Vorschläge
      if (candidates.length < 3) {
        candidates = await getRelatedFromGPT(keyword)
      }

      // 2 Batches à max. 4 Kandidaten parallel abfragen
      const [batch1, batch2] = [candidates.slice(0, 4), candidates.slice(4, 8)]
      const [results1, results2] = await Promise.all([
        scoreBatch(keyword, batch1, geo, startTime),
        scoreBatch(keyword, batch2, geo, startTime),
      ])

      const allResults = [...results1, ...results2].sort((a, b) => b.avg - a.avg)
      const maxAvg = Math.max(...allResults.map(e => e.avg), 1)

      topQueries = allResults.slice(0, 10).map(e => ({
        query: e.query,
        value: Math.round((e.avg / maxAvg) * 100),
      }))

      risingQueries = [...allResults]
        .filter(e => e.change !== null && e.change !== 0)
        .sort((a, b) => (b.change === null ? -1 : a.change === null ? 1 : b.change - a.change))
        .slice(0, 10)
        .map(e => ({
          query: e.query,
          value: e.change > 4999 ? 'Breakout' : e.change,
        }))
    } catch (_) {}

    // 3. Related Topics
    let risingTopics = []
    try {
      const topicsRaw = await googleTrends.relatedTopics({ keyword, geo, startTime })
      const topicsJson = JSON.parse(topicsRaw)
      const topicData = topicsJson.default?.rankedList || []
      const risingList = topicData[0]?.rankedKeyword || []
      risingTopics = risingList.slice(0, 6).map(t => ({
        title: t.topic?.title || t.query || '',
        type: t.topic?.type || '',
      }))
    } catch (_) {}

    res.json({
      keyword,
      compareKeyword: compareWith || null,
      geo,
      currentScore,
      peakScore,
      trend,
      timelineData,
      risingQueries,
      topQueries,
      risingTopics,
      topTopics: [],
    })
  } catch (err) {
    res.status(500).json({ error: err.message || 'Trend-Analyse fehlgeschlagen' })
  }
}
