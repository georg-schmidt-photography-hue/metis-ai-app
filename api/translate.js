export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const { texts } = req.body
  if (!texts || !texts.length) return res.json({ translations: [] })

  const prompt = texts
    .slice(0, 10)
    .map((t, i) => `[${i}]\n${t.substring(0, 600)}`)
    .join('\n\n---\n\n')

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4.1-mini',
        max_tokens: 4000,
        messages: [
          {
            role: 'system',
            content:
              'Übersetze jeden LinkedIn-Post ins Deutsche. Behalte Stil und Emojis bei. Antworte NUR mit den übersetzten Texten, nummeriert mit [0], [1] etc., getrennt durch ---. Kein zusätzlicher Text.',
          },
          { role: 'user', content: prompt },
        ],
      }),
    })

    const data = await response.json()
    const raw = data.choices?.[0]?.message?.content || ''
    const translations = raw
      .split(/---/)
      .map((p) => p.replace(/^\s*\[\d+\]\s*/, '').trim())

    res.json({ translations })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}
