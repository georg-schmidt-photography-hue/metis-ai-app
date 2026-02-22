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
        max_tokens: 600,
        messages: [
          {
            role: 'system',
            content: 'Du gibst eine JSON-Antwort zurück. Nur JSON, kein Text drumherum.',
          },
          {
            role: 'user',
            content: `Was sind heute die 10 meistgesuchten und trending Themen in Deutschland? Beziehe dich auf aktuelle Nachrichten, Google Trends Deutschland, Social Media Trends.

Antworte NUR mit diesem JSON-Format:
{
  "topics": [
    { "title": "Thema", "category": "Politik|Wirtschaft|Sport|Tech|Gesellschaft|Unterhaltung" },
    ...
  ]
}`,
          },
        ],
      }),
    })

    const data = await response.json()
    const raw = data.choices?.[0]?.message?.content || ''

    // Extract JSON from response
    const jsonMatch = raw.match(/\{[\s\S]*\}/)
    if (!jsonMatch) throw new Error('Kein JSON in Antwort')

    const parsed = JSON.parse(jsonMatch[0])
    const topics = (parsed.topics || []).slice(0, 10).map(t => ({
      title: t.title || '',
      category: t.category || '',
      traffic: '',
    }))

    res.json({ topics, date: new Date().toLocaleDateString('de-DE'), source: 'perplexity' })
  } catch (err) {
    res.status(500).json({ error: err.message, topics: [] })
  }
}
