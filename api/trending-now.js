export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).end()

  try {
    const response = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.PERPLEXITY_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'sonar',
        max_tokens: 1200,
        messages: [
          {
            role: 'system',
            content: 'Du gibst ausschließlich valides JSON zurück. Kein Text davor oder danach.',
          },
          {
            role: 'user',
            content: `Was sind heute die aktuell trendenden Themen in Deutschland auf folgenden Plattformen? Recherchiere aktuelle Daten von heute.

Antworte NUR mit diesem JSON:
{
  "google": [
    { "title": "Thema", "category": "Politik|Wirtschaft|Sport|Tech|Gesellschaft" }
  ],
  "reddit": [
    { "title": "Thema", "subreddit": "de|germany|..." }
  ],
  "twitter": [
    { "title": "Hashtag oder Thema", "context": "kurze Erklärung warum es trendet" }
  ],
  "youtube": [
    { "title": "Video-Titel oder Thema", "channel": "Kanalname falls bekannt" }
  ],
  "instagram": [
    { "title": "Hashtag oder Thema", "context": "kurze Erklärung" }
  ]
}

Jeweils 5 Einträge pro Plattform. Fokus auf Deutschland.`,
          },
        ],
      }),
    })

    const data = await response.json()
    const raw = data.choices?.[0]?.message?.content || ''
    const jsonMatch = raw.match(/\{[\s\S]*\}/)
    if (!jsonMatch) throw new Error('Kein JSON')

    const parsed = JSON.parse(jsonMatch[0])

    res.json({
      google: (parsed.google || []).slice(0, 5),
      reddit: (parsed.reddit || []).slice(0, 5),
      twitter: (parsed.twitter || []).slice(0, 5),
      youtube: (parsed.youtube || []).slice(0, 5),
      instagram: (parsed.instagram || []).slice(0, 5),
      date: new Date().toLocaleDateString('de-DE'),
      time: new Date().toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' }),
    })
  } catch (err) {
    res.status(500).json({ error: err.message, google: [], reddit: [], twitter: [], youtube: [], instagram: [] })
  }
}
