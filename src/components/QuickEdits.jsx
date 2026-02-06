const options = {
  tone: [
    { value: 'professional', label: 'Professional' },
    { value: 'casual', label: 'Casual' },
    { value: 'provocative', label: 'Provocative' },
    { value: 'inspirational', label: 'Inspirational' },
  ],
  length: [
    { value: 'short', label: 'Short (3-5 Zeilen)' },
    { value: 'medium', label: 'Medium (8-12 Zeilen)' },
    { value: 'long', label: 'Long (15-25 Zeilen)' },
  ],
  engagement: [
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' },
  ],
  format: [
    { value: 'story', label: 'Story' },
    { value: 'listicle', label: 'Listicle' },
    { value: 'hot-take', label: 'Hot Take' },
    { value: 'how-to', label: 'How-To' },
  ],
}

function SelectField({ label, value, onChange, items }) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1.5">
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all cursor-pointer appearance-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%239CA3AF'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'right 0.75rem center',
          backgroundSize: '1.25rem',
        }}
      >
        {items.map((item) => (
          <option key={item.value} value={item.value}>
            {item.label}
          </option>
        ))}
      </select>
    </div>
  )
}

export default function QuickEdits({ settings, onSettingsChange }) {
  const update = (key) => (value) => {
    onSettingsChange({ ...settings, [key]: value })
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5">
      <h2 className="text-sm font-semibold text-gray-900 mb-5">Quick Edits</h2>
      <div className="space-y-4">
        <SelectField
          label="Tone"
          value={settings.tone}
          onChange={update('tone')}
          items={options.tone}
        />
        <SelectField
          label="Length"
          value={settings.length}
          onChange={update('length')}
          items={options.length}
        />
        <SelectField
          label="Engagement"
          value={settings.engagement}
          onChange={update('engagement')}
          items={options.engagement}
        />
        <SelectField
          label="Format"
          value={settings.format}
          onChange={update('format')}
          items={options.format}
        />
      </div>
    </div>
  )
}
