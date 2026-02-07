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
      <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
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
                  ? 'bg-indigo-50 border-indigo-300 text-indigo-700'
                  : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300'
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

export default function QuickEdits({ settings, onSettingsChange }) {
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

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5">
      <h2 className="text-sm font-semibold text-gray-900 mb-5">Quick Edits</h2>
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
    </div>
  )
}
