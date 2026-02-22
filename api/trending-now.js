import googleTrends from 'google-trends-api'

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).end()

  try {
    const raw = await googleTrends.dailyTrends({ geo: 'DE', trendDate: new Date() })
    const data = JSON.parse(raw)
    const searches = data?.default?.trendingSearchesDays?.[0]?.trendingSearches || []

    const topics = searches.slice(0, 10).map(s => ({
      title: s.title?.query || '',
      traffic: s.formattedTraffic || '',
      relatedQueries: s.relatedQueries?.map(q => q.query) || [],
      articles: s.articles?.slice(0, 1).map(a => ({ title: a.title, source: a.source })) || [],
    }))

    res.json({ topics, date: new Date().toLocaleDateString('de-DE') })
  } catch (err) {
    // Fallback: use realTimeTrends
    try {
      const raw2 = await googleTrends.realTimeTrends({ geo: 'DE', category: 'all' })
      const data2 = JSON.parse(raw2)
      const stories = data2?.storySummaries?.trendingStories || []
      const topics = stories.slice(0, 10).map(s => ({
        title: s.entityNames?.[0] || s.title || '',
        traffic: '',
        relatedQueries: s.entityNames?.slice(1, 4) || [],
        articles: s.articles?.slice(0, 1).map(a => ({ title: a.articleTitle, source: a.source })) || [],
      }))
      res.json({ topics, date: new Date().toLocaleDateString('de-DE') })
    } catch (err2) {
      res.status(500).json({ error: 'Trending-Daten nicht verfügbar', topics: [] })
    }
  }
}
