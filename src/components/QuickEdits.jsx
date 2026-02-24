const sections = [
  {
    label: 'Tonalität',
    options: [
      { value: 'Professioneller Ton', label: 'Professioneller' },
      { value: 'Lockerer Ton', label: 'Lockerer' },
      { value: 'Autoritärer Ton', label: 'Autoritärer' },
      { value: 'Freundlicher Ton', label: 'Freundlicher' },
    ],
  },
  {
    label: 'Länge',
    options: [
      { value: 'Kürzer schreiben', label: 'Kürzer' },
      { value: 'Länger schreiben', label: 'Länger' },
      { value: 'Mehr Details hinzufügen', label: 'Mehr Details' },
    ],
  },
  {
    label: 'Engagement',
    options: [
      { value: 'Stärkerer Hook', label: 'Stärkerer Hook' },
      { value: 'CTA hinzufügen', label: 'CTA hinzufügen' },
      { value: 'Persönlicher / Storytelling', label: 'Persönlicher / Story' },
    ],
  },
  {
    label: 'Format',
    options: [
      { value: 'Add Bullet Points', label: 'Aufzählungen' },
      { value: 'Add Emojis', label: 'Emojis hinzufügen' },
      { value: 'Remove Emojis', label: 'Emojis entfernen' },
      { value: 'Add Statistics', label: 'Statistiken' },
    ],
  },
]

function ChipGroup({ label, options, selected, onToggle }) {
  return (
    <div>
      <label className="block text-xs font-medium uppercase tracking-wide mb-2" style={{color:'rgba(255,255,255,0.3)'}}>
        {label}
      </label>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => {
          const isSelected = selected.includes(opt.value)
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => onToggle(opt.value)}
              className="text-xs font-medium cursor-pointer transition-all"
              style={{padding:'6px 12px', borderRadius:999, border: isSelected ? '1px solid rgba(212,149,43,0.4)' : '1px solid rgba(255,255,255,0.1)', background: isSelected ? 'rgba(212,149,43,0.15)' : 'rgba(255,255,255,0.04)', color: isSelected ? '#D4952B' : 'rgba(255,255,255,0.45)'}}
            >
              {opt.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default function QuickEdits({ settings, onSettingsChange, step, onRefine, isLoading }) {
  const handleToggle = (value) => {
    const current = settings.quickEdits || []
    const updated = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value]
    onSettingsChange({ ...settings, quickEdits: updated })
  }

  const showRefineButton = step === 'result'

  return (
    <div className="rounded-xl p-5" style={{background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)'}}>
      <h2 className="text-sm font-semibold mb-5" style={{color:'rgba(255,255,255,0.85)'}}>Schnellbearbeitung</h2>
      <div className="space-y-5">
        {sections.map((section) => (
          <ChipGroup
            key={section.label}
            label={section.label}
            options={section.options}
            selected={settings.quickEdits || []}
            onToggle={handleToggle}
          />
        ))}
      </div>

      {showRefineButton && (
        <button
          onClick={onRefine}
          disabled={isLoading}
          className="w-full mt-6 cursor-pointer transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          style={{padding:'12px 16px', borderRadius:999, background:'rgba(255,255,255,0.07)', border:'1px solid rgba(255,255,255,0.15)', color:'rgba(255,255,255,0.7)', fontSize:13, fontWeight:600}}
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Wird angepasst...
            </span>
          ) : (
            'Post anpassen'
          )}
        </button>
      )}
    </div>
  )
}
