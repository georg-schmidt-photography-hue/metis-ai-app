async function fetchPlatformTrends(platform, prompt) {
  const res = await fetch('https://api.perplexity.ai/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.PERPLEXITY_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'sonar',
      max_tokens: 400,
      messages: [
        { role: 'system', content: 'Antworte NUR mit einem JSON-Array. Kein Text davor oder danach.' },
        { role: 'user', content: prompt },
      ],
    }),
  })
  const data = await res.json()
  const raw = data.choices?.[0]?.message?.content || ''
  const match = raw.match(/\[[\s\S]*\]/)
  if (!match) return []
  return JSON.parse(match[0]).slice(0, 5)
}

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).end()

  try {
    const [google, reddit, twitter, youtube, instagram] = await Promise.all([

      fetchPlatformTrends('google', `Was sind heute die 5 meistgesuchten Themen auf Google in Deutschland?
Fokus: Was suchen Deutsche gerade aktiv — nicht nur Nachrichten.
JSON-Array: [{"title":"...", "category":"Politik|Wirtschaft|Sport|Tech|Lifestyle|Unterhaltung"}]`),

      fetchPlatformTrends('reddit', `Was sind heute die 5 heißesten Posts oder Diskussionen auf Reddit in deutschen Subreddits (r/de, r/germany, r/finanzen, r/de_it etc.)?
Was diskutieren Deutsche auf Reddit gerade — typisch Reddit: kontroverse Meinungen, Alltagsthemen, Humor, Tech-Fragen.
JSON-Array: [{"title":"...", "subreddit":"de|germany|finanzen|..."}]`),

      fetchPlatformTrends('twitter', `Was sind heute die 5 trending Hashtags oder Themen auf X (Twitter) in Deutschland?
Typisch Twitter/X: politische Debatten, Breaking News, Memes, Empörungsthemen, Promi-Drama.
Nicht dieselben Themen wie Google — Twitter hat eigene Dynamik.
JSON-Array: [{"title":"#Hashtag oder Thema", "context":"1 Satz warum es gerade trendet"}]`),

      fetchPlatformTrends('youtube', `Was sind heute die 5 trending Videos oder Themen auf YouTube in Deutschland?
Typisch YouTube: Musik-Releases, Gaming, Tutorials, Reaktionsvideos, politische Kommentare, Unterhaltung.
Nicht dieselben Nachrichten-Themen wie Google.
JSON-Array: [{"title":"...", "channel":"Kanalname falls bekannt", "type":"Musik|Gaming|News|Tutorial|Entertainment"}]`),

      fetchPlatformTrends('instagram', `Was sind heute die 5 trending Hashtags oder Themen auf Instagram in Deutschland?
Typisch Instagram: Lifestyle, Mode, Food, Reise, Fitness, Beauty, Creator-Content, Reels-Trends.
Sehr anders als Google oder Twitter — visueller Lifestyle-Content.
JSON-Array: [{"title":"#hashtag oder Thema", "context":"1 Satz Kontext"}]`),
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
  } catch (err) {
    res.status(500).json({ error: err.message, google: [], reddit: [], twitter: [], youtube: [], instagram: [] })
  }
}
