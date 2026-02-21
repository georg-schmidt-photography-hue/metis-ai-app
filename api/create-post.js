export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const { topic, creator } = req.body
  if (!topic || !creator) return res.status(400).json({ error: 'topic und creator erforderlich' })

  // Build creator style context from saved analysis
  const pillars = creator.contentPillars?.map(p => `${p.pillar} (${p.percentage}%)`).join(', ') || ''
  const tactics = creator.tactics?.slice(0, 3).map(t => `• ${t.title}: ${t.description || ''}`).join('\n') || ''
  const formats = creator.formatBreakdown?.map(f => `${f.format} (${f.percentage}%)`).join(', ') || ''

  const systemPrompt = `Du bist ein LinkedIn Content Creator und schreibst Posts im exakten Stil von ${creator.name}.

CREATOR-PROFIL:
- Name: ${creator.name}
- Headline: ${creator.headline || ''}
- Erfolgsfaktor: ${creator.successFactor || ''}
- Inhalts-Schwerpunkte: ${pillars}
- Bevorzugte Formate: ${formats}

TAKTIKEN DIESES CREATORS:
${tactics}

STIL-REGELN (aus der Analyse):
- Schreibe GENAU so wie ${creator.name} auf LinkedIn schreibt
- Übernimm die Satzstruktur, den Rhythmus, die Zeilenumbrüche
- Nutze dieselbe Tonalität (z.B. direkt/reflektiv/motivierend)
- Baue den Post nach dem typischen Format dieses Creators auf
- Nutze Hashtags wie dieser Creator sie einsetzt
- Länge und Struktur sollen dem typischen Post dieses Creators entsprechen

WICHTIG: Schreibe den Post auf DEUTSCH. Nur den fertigen Post ausgeben, keine Erklärungen.`

  const userPrompt = `Schreibe einen LinkedIn Post über folgendes Thema im Stil von ${creator.name}:

Thema: ${topic}

Vergiss nicht:
- Der Post muss authentisch nach ${creator.name} klingen
- Nutze seine/ihre typischen Einstiegssätze, Struktur und Abschlüsse
- Passende Hashtags am Ende`

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4.1-mini',
        max_tokens: 1500,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
      }),
    })

    const data = await response.json()
    const post = data.choices?.[0]?.message?.content?.trim() || ''

    if (!post) throw new Error('Kein Inhalt vom Server erhalten')

    res.json({ post })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}
