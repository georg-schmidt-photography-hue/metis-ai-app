const sections = [
  {
    label: 'Tone',
    key: 'tone',
    options: [
      { value: 'professional', label: 'More Professional' },
      { value: 'casual', label: 'More Casual' },
      { value: 'provocative', label: 'More Authoritative' },
      { value: 'inspirational', label: 'More Friendly' },
    ],
  },
  {
    label: 'Length',
    key: 'length',
    options: [
      { value: 'short', label: 'Shorter' },
      { value: 'long', label: 'Longer' },
      { value: 'medium', label: 'Add More Detail' },
    ],
  },
  {
    label: 'Engagement',
    key: 'engagement',
    options: [
      { value: 'high', label: 'Stronger Hook' },
      { value: 'medium', label: 'Add CTA' },
      { value: 'low', label: 'More Personal/Storytelling' },
    ],
  },
  {
    label: 'Format',
    key: 'format',
    multi: true,
    options: [
      { value: 'Add Bullet Points', label: 'Add Bullet Points' },
      { value: 'Add Emojis', label: 'Add Emojis' },
      { value: 'Remove Emojis', label: 'Remove Emojis' },
      { value: 'Add Statistics', label: 'Add Statistics' },
    ],
  },
]

function ChipGroup({ label, options, selected, onSelect, multi }) {
  return (
    <div>
      <label className="block text-xs font-medium text-[#8A8578] uppercase tracking-wide mb-2">
        {label}
      </label>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => {
          const isSelected = multi
            ? selected.includes(opt.value)
            : selected === opt.value

          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => onSelect(opt.value)}
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
  const handleSelect = (key, value, multi) => {
    if (multi) {
      const current = settings.quickEdits || []
      const updated = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value]
      onSettingsChange({ ...settings, quickEdits: updated })
    } else {
      onSettingsChange({ ...settings, [key]: value })
    }
  }

  const showRefineButton = step === 'result'

  return (
    <div className="bg-[#FFFDF9] border border-[#E8E4DD] rounded-xl p-5 shadow-sm">
      <h2 className="text-sm font-semibold text-[#2D2B28] mb-5">Quick Edits</h2>
      <div className="space-y-5">
        {sections.map((section) => (
          <ChipGroup
            key={section.key}
            label={section.label}
            options={section.options}
            selected={section.multi ? (settings.quickEdits || []) : settings[section.key]}
            onSelect={(value) => handleSelect(section.key, value, section.multi)}
            multi={section.multi}
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
              Refining...
            </span>
          ) : (
            'Post anpassen'
          )}
        </button>
      )}
    </div>
  )
}
