import googleTrends from 'google-trends-api'

// GPT generiert verwandte Suchbegriffe mit echtem Suchvolumen
async function getRelatedKeywordsFromGPT(keyword) {
  try {
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        max_tokens: 80,
        messages: [{
          role: 'user',
          content: `Gib mir exakt 6 verwandte Google-Suchbegriffe zu "${keyword}" die in Deutschland häufig gesucht werden. Bevorzuge: bekannte Tools (z.B. ChatGPT, n8n, Zapier), populäre Plattformen, bekannte Markennamen und häufig gesuchte Oberbegriffe. Keine zu spezifischen Nischenbegriffe. Antworte NUR mit einem JSON-Array: ["Begriff1","Begriff2","Begriff3","Begriff4","Begriff5","Begriff6"]`,
        }],
      }),
    })
    const json = await res.json()
    const text = json.choices?.[0]?.message?.content?.trim() || '[]'
    const match = text.match(/\[.*\]/s)
    return match ? JSON.parse(match[0]) : []
  } catch { return [] }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const { keyword, compareWith, geo = 'DE' } = req.body
  if (!keyword) return res.status(400).json({ error: 'keyword erforderlich' })

  try {
    const startTime = new Date()
    startTime.setMonth(startTime.getMonth() - 12)

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

    // 2. Related Queries via Google Autocomplete + interestOverTime
    let risingQueries = []
    let topQueries = []

    let _debugRelated = {}
    try {
      const allCandidates = await getRelatedKeywordsFromGPT(keyword)
      const candidates = allCandidates.slice(0, 4)
      _debugRelated.candidates = candidates

      if (candidates.length > 0) {
        const allKw = [keyword, ...candidates]
        const raw = await googleTrends.interestOverTime({ keyword: allKw, geo, startTime })
        const json = JSON.parse(raw)
        const items = json.default?.timelineData || []
        _debugRelated.itemsCount = items.length

        const avgScores = allKw.map((kw, idx) => {
          const vals = items.map(it => it.value?.[idx] || 0)
          const avg = vals.length > 0 ? vals.reduce((a, b) => a + b, 0) / vals.length : 0
          return { query: kw, avg: Math.round(avg) }
        })
        _debugRelated.avgScores = avgScores

        const related = avgScores.slice(1).filter(e => e.avg > 0).sort((a, b) => b.avg - a.avg)
        const maxVal = Math.max(...related.map(e => e.avg), 1)

        topQueries = related.map(e => ({
          query: e.query,
          value: Math.round((e.avg / maxVal) * 100),
        }))

        const half = Math.floor(items.length / 2)
        risingQueries = related.map(e => {
          const idx = allKw.indexOf(e.query)
          const recent = items.slice(half).map(it => it.value?.[idx] || 0)
          const older = items.slice(0, half).map(it => it.value?.[idx] || 0)
          const recentAvg = recent.reduce((a, b) => a + b, 0) / (recent.length || 1)
          const olderAvg = older.reduce((a, b) => a + b, 0) / (older.length || 1)
          const change = olderAvg > 0 ? Math.round(((recentAvg - olderAvg) / olderAvg) * 100) : null
          return { query: e.query, value: change !== null && change > 4999 ? 'Breakout' : (change ?? 0) }
        }).filter(e => e.value !== 0).sort((a, b) => {
          const va = a.value === 'Breakout' ? 9999 : a.value
          const vb = b.value === 'Breakout' ? 9999 : b.value
          return vb - va
        })
      }
    } catch (e) { _debugRelated.error = e.message }

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
      _debug: _debugRelated,
    })
  } catch (err) {
    res.status(500).json({ error: err.message || 'Trend-Analyse fehlgeschlagen' })
  }
}
