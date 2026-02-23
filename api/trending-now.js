async function fetchPlatformTrends(platform, prompt) {
  try {
    const res = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.PERPLEXITY_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'sonar',
        max_tokens: 500,
        messages: [
          {
            role: 'system',
            content: 'Antworte NUR mit einem JSON-Array ohne Markdown, ohne Erklärungen, ohne Codeblocks. Nur das Array selbst.',
          },
          { role: 'user', content: prompt },
        ],
      }),
    })

    const data = await res.json()
    const raw = (data.choices?.[0]?.message?.content || '').trim()

    // Strip markdown code blocks if present
    const cleaned = raw.replace(/```json\s*/gi, '').replace(/```\s*/g, '').trim()

    // Find first [ and last ] to extract array
    const start = cleaned.indexOf('[')
    const end = cleaned.lastIndexOf(']')
    if (start === -1 || end === -1) return []

    const jsonStr = cleaned.slice(start, end + 1)
    const parsed = JSON.parse(jsonStr)
    if (!Array.isArray(parsed)) return []
    return parsed.slice(0, 5).map(item => {
      if (typeof item === 'string') {
        try { return JSON.parse(item) } catch { return { title: item } }
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

  const [google, reddit] = await Promise.all([

    fetchPlatformTrends('google', `Liste die 5 meistgesuchten Themen auf Google Deutschland heute. Antworte NUR mit diesem JSON-Array, exakt dieses Format:
[{"title":"Thema 1","category":"Sport"},{"title":"Thema 2","category":"Politik"},{"title":"Thema 3","category":"Tech"},{"title":"Thema 4","category":"Wirtschaft"},{"title":"Thema 5","category":"Lifestyle"}]`),

    fetchPlatformTrends('reddit', `Liste 5 trending Diskussionen in deutschen Reddit-Communitys heute. Antworte NUR mit diesem JSON-Array, exakt dieses Format:
[{"title":"Titel 1","subreddit":"de"},{"title":"Titel 2","subreddit":"germany"},{"title":"Titel 3","subreddit":"finanzen"},{"title":"Titel 4","subreddit":"de"},{"title":"Titel 5","subreddit":"germany"}]`),
  ])

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
