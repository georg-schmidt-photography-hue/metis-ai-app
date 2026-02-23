export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const { posts } = req.body
  if (!posts || !posts.trim()) return res.status(400).json({ error: 'Keine Posts übergeben' })

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4.1-mini',
        max_tokens: 600,
        messages: [
          {
            role: 'system',
            content: `Du bist ein Experte für Personal Branding auf LinkedIn.
Analysiere die LinkedIn-Posts des Users und erstelle ein kompaktes Stil-Profil.
Antworte NUR mit validem JSON, kein Markdown.`,
          },
          {
            role: 'user',
            content: `Analysiere meinen Schreibstil basierend auf diesen LinkedIn-Posts:

${posts}

Antworte NUR mit diesem JSON:
{
  "tone": "Kurze Beschreibung des Tons (z.B. direkt, provokativ, empathisch)",
  "sentenceStyle": "Kurze/lange Sätze? Absätze? Aufzählungen?",
  "hookPattern": "Wie beginnen die Posts typischerweise?",
  "emojis": "Viele/wenige/keine Emojis?",
  "cta": "Wie enden die Posts? Frage, Aufruf, Statement?",
  "vocabulary": "Typische Wörter/Phrasen die diese Person nutzt",
  "avoid": "Was fehlt in diesem Stil? Was sollte NICHT generiert werden?",
  "summary": "Ein Satz der den Gesamtstil beschreibt"
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
    if (start === -1) throw new Error('Kein JSON in Antwort')

    const profile = JSON.parse(raw.slice(start, end + 1))
    res.json({ success: true, profile })
  } catch (err) {
    res.status(500).json({ error: err.message || 'Analyse fehlgeschlagen' })
  }
}
