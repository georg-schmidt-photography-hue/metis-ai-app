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
      <label className="block text-xs font-medium text-[#8A8578] uppercase tracking-wide mb-2">
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
              className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-all cursor-pointer ${
                isSelected
                  ? 'bg-[#FEF3C7] border-[#D97706] text-[#92400E]'
                  : 'bg-white border-[#E8E4DD] text-[#6B6560] hover:bg-[#F7F5F0] hover:border-[#C4BFB6]'
              }`}
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
    <div className="bg-[#FFFDF9] border border-[#E8E4DD] rounded-xl p-5 shadow-sm">
      <h2 className="text-sm font-semibold text-[#2D2B28] mb-5">Schnellbearbeitung</h2>
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
          className="w-full mt-6 py-2.5 px-4 bg-[#D97706] hover:bg-[#B45309] disabled:bg-[#D4A574] text-white text-sm font-semibold rounded-xl transition-colors cursor-pointer disabled:cursor-not-allowed"
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
