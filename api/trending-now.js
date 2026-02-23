export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).end()

  try {
    const controller = new AbortController()
    setTimeout(() => controller.abort(), 8000)

    const response = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.PERPLEXITY_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'sonar',
        max_tokens: 400,
        messages: [
          {
            role: 'system',
            content: 'Antworte NUR mit validem JSON. Kein Markdown, keine Erklärungen.',
          },
          {
            role: 'user',
            content: `Nenne die aktuell trendenden Themen in Deutschland von heute.
Antworte NUR mit diesem JSON-Objekt:
{
  "google": ["Thema 1", "Thema 2", "Thema 3", "Thema 4", "Thema 5"],
  "twitter": ["#Hashtag1", "Thema 2", "Thema 3", "Thema 4", "Thema 5"],
  "youtube": ["Video/Thema 1", "Thema 2", "Thema 3", "Thema 4", "Thema 5"]
}`,
          },
        ],
      }),
    })

    const data = await response.json()
    const raw = (data.choices?.[0]?.message?.content || '')
      .replace(/```json\s*/gi, '').replace(/```\s*/g, '').trim()

    const start = raw.indexOf('{')
    const end = raw.lastIndexOf('}')
    const parsed = start !== -1 ? JSON.parse(raw.slice(start, end + 1)) : {}

    const normalize = (arr) => (Array.isArray(arr) ? arr : [])
      .slice(0, 5)
      .map(item => ({ title: typeof item === 'string' ? item : (item?.title || item?.name || '') }))
      .filter(item => item.title.length > 0)

    res.setHeader('Cache-Control', 'no-store')
    res.json({
      google: normalize(parsed.google),
      twitter: normalize(parsed.twitter),
      youtube: normalize(parsed.youtube),
      reddit: [],
      instagram: [],
      date: new Date().toLocaleDateString('de-DE'),
      time: new Date().toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' }),
    })
  } catch (e) {
    res.setHeader('Cache-Control', 'no-store')
    res.json({ google: [], reddit: [], twitter: [], youtube: [], instagram: [],
      date: new Date().toLocaleDateString('de-DE'),
      time: new Date().toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' }),
    })
  }
}
