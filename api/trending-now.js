async function fetchPlatformTrends(platform, prompt) {
  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 7000) // 7s max per call

    const res = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.PERPLEXITY_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'sonar',
        max_tokens: 300,
        messages: [
          {
            role: 'system',
            content: 'Antworte NUR mit einem JSON-Array. Kein Markdown, keine Erklärungen.',
          },
          { role: 'user', content: prompt },
        ],
      }),
    })
    clearTimeout(timeout)

    const data = await res.json()
    const raw = (data.choices?.[0]?.message?.content || '').trim()
    const cleaned = raw.replace(/```json\s*/gi, '').replace(/```\s*/g, '').trim()

    const start = cleaned.indexOf('[')
    const end = cleaned.lastIndexOf(']')
    if (start === -1 || end === -1) return []

    const parsed = JSON.parse(cleaned.slice(start, end + 1))
    if (!Array.isArray(parsed)) return []
    return parsed.slice(0, 5).map(item => {
      if (typeof item === 'string') {
        try { item = JSON.parse(item) } catch { return { title: item } }
      }
      // unwrap double-encoded title: {"title":"{\"title\":\"X\"}"}
      if (item?.title && typeof item.title === 'string' && item.title.trim().startsWith('{')) {
        try { const inner = JSON.parse(item.title); return { ...item, ...inner } } catch {}
      }
      return item
    })
  } catch (e) {
    console.error(`${platform} fetch failed:`, e.message)
    return []
  }
}

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).end()

  // Run sequentially to stay within Vercel's 10s limit
  const google = await fetchPlatformTrends('google',
    `Nenne die 5 meistgesuchten Themen auf Google Deutschland heute als JSON-Array:
[{"title":"Thema 1","category":"Sport"},{"title":"Thema 2","category":"Politik"},{"title":"Thema 3","category":"Tech"},{"title":"Thema 4","category":"Wirtschaft"},{"title":"Thema 5","category":"Lifestyle"}]`)

  const reddit = await fetchPlatformTrends('reddit',
    `Nenne 5 trending Themen auf Reddit Deutschland heute als JSON-Array:
[{"title":"Titel 1","subreddit":"de"},{"title":"Titel 2","subreddit":"germany"},{"title":"Titel 3","subreddit":"finanzen"},{"title":"Titel 4","subreddit":"de"},{"title":"Titel 5","subreddit":"germany"}]`)

  res.setHeader('Cache-Control', 'no-store')
  res.json({
    google,
    reddit,
    twitter: [],
    youtube: [],
    instagram: [],
    date: new Date().toLocaleDateString('de-DE'),
    time: new Date().toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' }),
  })
}
