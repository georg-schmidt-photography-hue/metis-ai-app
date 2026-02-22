import googleTrends from 'google-trends-api'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const { keyword, compareWith, geo = 'DE' } = req.body
  if (!keyword) return res.status(400).json({ error: 'keyword erforderlich' })

  try {
    // Build keyword array for comparison
    const comparisonKeywords = compareWith && compareWith !== keyword
      ? [keyword, compareWith]
      : [keyword]

    const startTime = new Date(Date.now() - 365 * 24 * 60 * 60 * 1000)

    // Fetch main keyword data + optional compare separately (array call is unreliable)
    const [mainOverTime, compareOverTime, relatedTopics, relatedQueries] = await Promise.all([
      googleTrends.interestOverTime({ keyword, geo, startTime }).then(r => JSON.parse(r)),
      compareWith && compareWith !== keyword
        ? googleTrends.interestOverTime({ keyword: compareWith, geo, startTime }).then(r => JSON.parse(r)).catch(() => null)
        : Promise.resolve(null),
      googleTrends.relatedTopics({ keyword, geo }).then(r => JSON.parse(r)).catch(() => null),
      googleTrends.relatedQueries({ keyword, geo }).then(r => JSON.parse(r)).catch(() => null),
    ])

    // Merge both timelines by index
    const mainTimeline = mainOverTime?.default?.timelineData || []
    const compareTimeline = compareOverTime?.default?.timelineData || []

    const timelineData = mainTimeline.map((d, i) => ({
      date: d.formattedTime,
      value: d.value?.[0] || 0,
      compareValue: compareTimeline[i]?.value?.[0] ?? null,
    }))

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
