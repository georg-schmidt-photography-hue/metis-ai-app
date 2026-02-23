export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const { post, styleProfile, topPosts } = req.body
  if (!post) return res.status(400).json({ error: 'Kein Post übergeben' })

  const styleContext = styleProfile
    ? `\nDer Schreibstil des Users: Ton: ${styleProfile.tone}, Satzbau: ${styleProfile.sentenceStyle}, Vermeide: ${styleProfile.avoid}`
    : ''

  const topPostsContext = topPosts?.length
    ? `\nTop-performing Posts zum Thema (Referenz):\n${topPosts.slice(0, 3).map(p => `- "${(p.text || '').slice(0, 150)}"`).join('\n')}`
    : ''

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4.1-mini',
        max_tokens: 800,
        messages: [
          {
            role: 'system',
            content: `Du bist ein LinkedIn-Experte der Posts analysiert und konkrete Verbesserungen liefert.
Sei spezifisch — keine generischen Ratschläge. Liefere echte Rewrites.
Antworte NUR mit validem JSON, kein Markdown.`,
          },
          {
            role: 'user',
            content: `Analysiere diesen LinkedIn-Post und gib konkrete Verbesserungen:

POST:
"${post}"
${styleContext}
${topPostsContext}

Antworte NUR mit diesem JSON:
{
  "score": <Zahl 0-100>,
  "scoreLabel": <"Schwach"|"Okay"|"Gut"|"Stark"|"Viral-Potenzial">,
  "hookAnalysis": {
    "rating": <"Schwach"|"Okay"|"Stark">,
    "problem": "<Was ist das konkrete Problem mit dem aktuellen Hook? Max 1 Satz.>",
    "rewrites": [
      "<Komplett ausgeschriebener Hook-Alternativ 1>",
      "<Komplett ausgeschriebener Hook-Alternativ 2>",
      "<Komplett ausgeschriebener Hook-Alternativ 3>"
    ]
  },
  "improvements": [
    {
      "type": "<Lesbarkeit|Emotion|CTA|Struktur|Länge>",
      "issue": "<Konkretes Problem in 1 Satz>",
      "fix": "<Konkreter Lösungsvorschlag oder Rewrite in 1-2 Sätzen>"
    }
  ],
  "styleConsistency": "<Falls Stil-Profil vorhanden: Abweichungen vom persönlichen Stil. Sonst: leer lassen.>",
  "verdict": "<1 Satz Gesamturteil — direkt und ehrlich>"
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
    if (start === -1) throw new Error('Keine Analyse erhalten')

    const analysis = JSON.parse(raw.slice(start, end + 1))
    res.json({ success: true, analysis })
  } catch (err) {
    res.status(500).json({ error: err.message || 'Analyse fehlgeschlagen' })
  }
}
