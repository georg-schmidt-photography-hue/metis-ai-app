import googleTrends from 'google-trends-api'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const { keyword, geo = 'DE' } = req.body
  if (!keyword) return res.status(400).json({ error: 'keyword erforderlich' })

  try {
    // Fetch daily trending searches in Germany to get comparison topic
    let trendingNow = null
    try {
      const daily = await googleTrends.dailyTrends({ geo }).then(r => JSON.parse(r))
      const top = daily?.default?.trendingSearchesDays?.[0]?.trendingSearches?.[0]
      if (top) {
        trendingNow = {
          title: top.title?.query || '',
          traffic: top.formattedTraffic || '',
          articles: top.articles?.length || 0,
        }
      }
    } catch (_) {}

    // Compare keyword vs. trending topic over time
    const comparisonKeywords = trendingNow?.title && trendingNow.title !== keyword
      ? [keyword, trendingNow.title]
      : [keyword]

    const [interestOverTime, relatedTopics, relatedQueries] = await Promise.all([
      googleTrends.interestOverTime({
        keyword: comparisonKeywords,
        geo,
        startTime: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000),
      }).then(r => JSON.parse(r)),

      googleTrends.relatedTopics({
        keyword,
        geo,
      }).then(r => JSON.parse(r)),

      googleTrends.relatedQueries({
        keyword,
        geo,
      }).then(r => JSON.parse(r)),
    ])

    // Parse interest over time — supports 1 or 2 keywords
    const timelineData = interestOverTime?.default?.timelineData?.map(d => ({
      date: d.formattedTime,
      value: d.value?.[0] || 0,
      compareValue: d.value?.[1] ?? null,
    })) || []

    // Rising topics
    const risingTopics = relatedTopics?.default?.rankedList?.[0]?.rankedKeyword
      ?.slice(0, 6)
      ?.map(t => ({ title: t.topic?.title, type: t.topic?.type, value: t.value })) || []

    // Top topics
    const topTopics = relatedTopics?.default?.rankedList?.[1]?.rankedKeyword
      ?.slice(0, 6)
      ?.map(t => ({ title: t.topic?.title, type: t.topic?.type, value: t.value })) || []

    // Rising queries
    const risingQueries = relatedQueries?.default?.rankedList?.[0]?.rankedKeyword
      ?.slice(0, 8)
      ?.map(q => ({ query: q.query, value: q.value })) || []

    // Top queries
    const topQueries = relatedQueries?.default?.rankedList?.[1]?.rankedKeyword
      ?.slice(0, 8)
      ?.map(q => ({ query: q.query, value: q.value })) || []

    // Current trend score (last value)
    const currentScore = timelineData[timelineData.length - 1]?.value || 0
    const peakScore = Math.max(...timelineData.map(d => d.value), 1)
    const trend = timelineData.length > 4
      ? timelineData.slice(-4).reduce((a, b) => a + b.value, 0) / 4 >
        timelineData.slice(-8, -4).reduce((a, b) => a + b.value, 0) / 4
        ? 'rising' : 'falling'
      : 'stable'

    res.json({
      keyword,
      compareKeyword: comparisonKeywords[1] || null,
      trendingNow,
      geo,
      currentScore,
      peakScore,
      trend,
      timelineData,
      risingTopics,
      topTopics,
      risingQueries,
      topQueries,
    })
  } catch (err) {
    res.status(500).json({ error: err.message || 'Google Trends Fehler' })
  }
}
