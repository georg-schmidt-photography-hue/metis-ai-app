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
    return Array.isArray(parsed) ? parsed.slice(0, 5) : []
  } catch (e) {
    console.error(`${platform} fetch failed:`, e.message)
    return []
  }
}

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).end()

  const [google, reddit, twitter, youtube, instagram] = await Promise.all([

    fetchPlatformTrends('google', `5 meistgesuchte Themen auf Google Deutschland heute. Nur JSON-Array:
[{"title":"Thema","category":"Politik|Wirtschaft|Sport|Tech|Lifestyle"}]`),

    fetchPlatformTrends('reddit', `5 trending Diskussionen in deutschen Reddit-Communitys (r/de, r/germany, r/finanzen) heute. Typisch Reddit: Alltag, Humor, Kontroversen. Nur JSON-Array:
[{"title":"Thema","subreddit":"de"}]`),

    fetchPlatformTrends('twitter', `5 trending Hashtags auf X/Twitter Deutschland heute. Typisch: Breaking News, Politik-Debatten, Memes. Nur JSON-Array:
[{"title":"#Hashtag","context":"Grund in 5 Worten"}]`),

    fetchPlatformTrends('youtube', `5 trending Videos oder Themen auf YouTube Deutschland heute. Typisch: Musik, Gaming, News, Entertainment. Nur JSON-Array:
[{"title":"Video-Titel","channel":"Kanal","type":"Musik|Gaming|News|Entertainment"}]`),

    fetchPlatformTrends('instagram', `5 trending Hashtags oder Themen auf Instagram Deutschland heute. Typisch: Lifestyle, Mode, Food, Fitness, Reels. Nur JSON-Array:
[{"title":"#hashtag","context":"Kontext in 5 Worten"}]`),
  ])

  res.json({
    google,
    reddit,
    twitter,
    youtube,
    instagram,
    date: new Date().toLocaleDateString('de-DE'),
    time: new Date().toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' }),
  })
}
