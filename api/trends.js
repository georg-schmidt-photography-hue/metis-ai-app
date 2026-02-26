import googleTrends from 'google-trends-api'

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

    // 2. Related Queries
    let risingQueries = []
    let topQueries = []
    try {
      const relatedRaw = await googleTrends.relatedQueries({ keyword, geo, startTime })
      const relatedJson = JSON.parse(relatedRaw)
      const queryData = relatedJson.default?.rankedList || []

      const risingList = queryData[0]?.rankedKeyword || []
      const topList = queryData[1]?.rankedKeyword || []

      risingQueries = risingList.slice(0, 8).map(q => ({
        query: q.query,
        value: q.value >= 5000 ? 'Breakout' : q.value,
      }))
      const maxTop = Math.max(...topList.map(q => q.value), 1)
      topQueries = topList.slice(0, 8).map(q => ({
        query: q.query,
        value: Math.round((q.value / maxTop) * 100),
      }))
    } catch (_) {}

    // Fallback: wenn relatedQueries blockiert (Vercel IPs) → vergleichbare Suchanfragen via interestOverTime
    if (topQueries.length === 0) {
      try {
        const suffixes = ['Anbieter', 'Vergleich', 'Kosten', 'Erfahrungen', 'Tipps', 'Test', '2025', 'Wechsel']
        const variations = suffixes.map(s => `${keyword} ${s}`)
        // interestOverTime erlaubt max 5 keywords gleichzeitig
        const batch1 = variations.slice(0, 5)
        const batch2 = variations.slice(5, 8)

        const scores = {}
        for (const batch of [batch1, batch2]) {
          if (batch.length === 0) continue
          try {
            const raw = await googleTrends.interestOverTime({ keyword: batch, geo, startTime })
            const json = JSON.parse(raw)
            const items = json.default?.timelineData || []
            // Durchschnittswert pro Keyword
            batch.forEach((kw, idx) => {
              const vals = items.map(it => it.value?.[idx] || 0).filter(v => v > 0)
              if (vals.length > 0) {
                scores[kw] = Math.round(vals.reduce((a, b) => a + b, 0) / vals.length)
              }
            })
          } catch (_) {}
        }

        const entries = Object.entries(scores).filter(([, v]) => v > 0).sort((a, b) => b[1] - a[1])
        if (entries.length > 0) {
          const maxVal = entries[0][1]
          topQueries = entries.slice(0, 8).map(([query, val]) => ({
            query,
            value: Math.round((val / maxVal) * 100),
          }))
        }
      } catch (_) {}
    }

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
