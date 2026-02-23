async function fetchTitles(platform, prompt) {
  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 7000)

    const res = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.PERPLEXITY_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'sonar',
        max_tokens: 200,
        messages: [
          { role: 'system', content: 'Antworte NUR mit einem JSON-Array aus Strings. Beispiel: ["Thema 1","Thema 2"]. Kein Markdown, keine Objekte, keine Erklärungen.' },
          { role: 'user', content: prompt },
        ],
      }),
    })
    clearTimeout(timeout)

    const data = await res.json()
    const raw = (data.choices?.[0]?.message?.content || '').trim()
      .replace(/```json\s*/gi, '').replace(/```\s*/g, '').trim()

    const start = raw.indexOf('[')
    const end = raw.lastIndexOf(']')
    if (start === -1 || end === -1) return []

    const parsed = JSON.parse(raw.slice(start, end + 1))
    if (!Array.isArray(parsed)) return []

    // Normalize everything to { title: string }
    return parsed.slice(0, 5)
      .map(item => {
        if (typeof item === 'string') return { title: item.replace(/^["']|["']$/g, '').trim() }
        if (item?.title) return { title: String(item.title).trim() }
        if (item?.name) return { title: String(item.name).trim() }
        return null
      })
      .filter(item => item && item.title.length > 0)
  } catch (e) {
    console.error(`${platform} failed:`, e.message)
    return []
  }
}

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).end()

  const google = await fetchTitles('google',
    'Was sind die 5 meistgesuchten Themen auf Google in Deutschland heute? Nur ein JSON-Array aus 5 Strings: ["Thema1","Thema2","Thema3","Thema4","Thema5"]')

  const reddit = await fetchTitles('reddit',
    'Was sind 5 trending Diskussionsthemen auf Reddit in Deutschland heute? Nur ein JSON-Array aus 5 Strings: ["Thema1","Thema2","Thema3","Thema4","Thema5"]')

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
