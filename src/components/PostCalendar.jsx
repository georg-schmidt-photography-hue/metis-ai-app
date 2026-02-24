import { useState, useMemo } from 'react'

const DAYS = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So']
const MONTHS = ['Januar','Februar','März','April','Mai','Juni','Juli','August','September','Oktober','November','Dezember']

// Best times to post on LinkedIn (research-based)
const BEST_TIMES = {
  0: { label: 'Di & Mi 10–11 Uhr', slots: ['08:00','10:00','12:00'] }, // Mon
  1: { label: 'Di 10–11 Uhr', slots: ['08:00','10:00','12:00'] },      // Tue ★
  2: { label: 'Mi 10–11 Uhr', slots: ['08:00','10:00','18:00'] },      // Wed ★
  3: { label: 'Do 10 Uhr', slots: ['08:00','10:00','17:00'] },         // Thu
  4: { label: 'Fr 8–9 Uhr', slots: ['08:00','12:00'] },               // Fri
  5: { label: 'Wochenende', slots: [] },                               // Sat (avoid)
  6: { label: 'Wochenende', slots: [] },                               // Sun (avoid)
}

const BEST_DAYS = [1, 2, 3] // Tue, Wed, Thu

function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate()
}

function getFirstDayOfWeek(year, month) {
  // 0=Sun → convert to Mon-based
  const d = new Date(year, month, 1).getDay()
  return d === 0 ? 6 : d - 1
}

function isSameDay(a, b) {
  return a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
}

export default function PostCalendar({ savedPosts, onSchedule }) {
  const today = new Date()
  const [viewYear, setViewYear] = useState(today.getFullYear())
  const [viewMonth, setViewMonth] = useState(today.getMonth())
  const [selectedDay, setSelectedDay] = useState(null)
  const [showScheduler, setShowScheduler] = useState(false)
  const [schedulerPost, setSchedulerPost] = useState(null)
  const [scheduledTime, setScheduledTime] = useState('10:00')
  const [scheduled, setScheduled] = useState({}) // { 'YYYY-MM-DD': [{postId, time, content}] }

  const daysInMonth = getDaysInMonth(viewYear, viewMonth)
  const firstDay = getFirstDayOfWeek(viewYear, viewMonth)

  const prevMonth = () => {
    if (viewMonth === 0) { setViewYear(y => y - 1); setViewMonth(11) }
    else setViewMonth(m => m - 1)
  }

  const nextMonth = () => {
    if (viewMonth === 11) { setViewYear(y => y + 1); setViewMonth(0) }
    else setViewMonth(m => m + 1)
  }

  const dateKey = (day) => `${viewYear}-${String(viewMonth + 1).padStart(2,'0')}-${String(day).padStart(2,'0')}`

  const handleDayClick = (day) => {
    const date = new Date(viewYear, viewMonth, day)
    setSelectedDay(date)
  }

  const handleSchedulePost = (post) => {
    setSchedulerPost(post)
    const dow = selectedDay ? selectedDay.getDay() === 0 ? 6 : selectedDay.getDay() - 1 : 1
    setScheduledTime(BEST_TIMES[dow]?.slots[0] || '10:00')
    setShowScheduler(true)
  }

  const confirmSchedule = () => {
    if (!selectedDay || !schedulerPost) return
    const key = dateKey(selectedDay.getDate())
    setScheduled(prev => ({
      ...prev,
      [key]: [...(prev[key] || []), { postId: schedulerPost.id, time: scheduledTime, content: schedulerPost.content }]
    }))
    setShowScheduler(false)
    setSchedulerPost(null)
  }

  const removeScheduled = (key, idx) => {
    setScheduled(prev => ({
      ...prev,
      [key]: prev[key].filter((_, i) => i !== idx)
    }))
  }

  const selectedKey = selectedDay ? dateKey(selectedDay.getDate()) : null
  const selectedDow = selectedDay ? (selectedDay.getDay() === 0 ? 6 : selectedDay.getDay() - 1) : null
  const isBestDay = selectedDow !== null && BEST_DAYS.includes(selectedDow)
  const isWeekend = selectedDow !== null && (selectedDow === 5 || selectedDow === 6)

  // Unscheduled posts (not yet placed in calendar)
  const unscheduledPosts = savedPosts.filter(p => {
    const allScheduledIds = Object.values(scheduled).flat().map(s => s.postId)
    return !allScheduledIds.includes(p.id)
  })

  return (
    <div className="space-y-5 max-w-5xl">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-[#2D2B28]">Post-Kalender</h2>
          <p className="text-xs text-[#A39E93] mt-0.5">Plane deine Posts zur optimalen Zeit</p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-5">
        {/* Calendar */}
        <div className="flex-1 bg-[#FFFDF9] border border-[#E8E4DD] rounded-2xl p-5">
          {/* Month nav */}
          <div className="flex items-center justify-between mb-5">
            <button onClick={prevMonth} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#F0EDE8] cursor-pointer text-[#6B6560]">‹</button>
            <h3 className="text-sm font-bold text-[#2D2B28]">{MONTHS[viewMonth]} {viewYear}</h3>
            <button onClick={nextMonth} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#F0EDE8] cursor-pointer text-[#6B6560]">›</button>
          </div>

          {/* Day headers */}
          <div className="grid grid-cols-7 mb-2">
            {DAYS.map((d, i) => (
              <div key={d} className={`text-center text-[10px] font-semibold py-1 ${BEST_DAYS.includes(i) ? 'text-[#D97706]' : 'text-[#A39E93]'}`}>{d}</div>
            ))}
          </div>

          {/* Days grid */}
          <div className="grid grid-cols-7 gap-1">
            {Array.from({ length: firstDay }, (_, i) => <div key={'e' + i} />)}
            {Array.from({ length: daysInMonth }, (_, i) => {
              const day = i + 1
              const date = new Date(viewYear, viewMonth, day)
              const dow = date.getDay() === 0 ? 6 : date.getDay() - 1
              const key = dateKey(day)
              const hasPost = (scheduled[key] || []).length > 0
              const isToday = isSameDay(date, today)
              const isSelected = selectedDay && isSameDay(date, selectedDay)
              const isPast = date < new Date(today.getFullYear(), today.getMonth(), today.getDate())
              const best = BEST_DAYS.includes(dow)
              const weekend = dow === 5 || dow === 6

              return (
                <button
                  key={day}
                  onClick={() => handleDayClick(day)}
                  className={`relative aspect-square flex flex-col items-center justify-center rounded-xl text-xs font-medium transition-all cursor-pointer
                    ${isSelected ? 'bg-[#D97706] text-white shadow-md' : ''}
                    ${!isSelected && isToday ? 'border-2 border-[#D97706] text-[#D97706]' : ''}
                    ${!isSelected && !isToday && best && !isPast ? 'bg-[#FEF3C7] text-[#92400E] hover:bg-[#FDE68A]' : ''}
                    ${!isSelected && !isToday && weekend ? 'text-[#C4BFB6]' : ''}
                    ${!isSelected && !isToday && !best && !weekend ? 'hover:bg-[#F0EDE8] text-[#2D2B28]' : ''}
                    ${isPast && !isSelected ? 'opacity-40' : ''}
                  `}
                >
                  {day}
                  {hasPost && (
                    <span className={`absolute bottom-0.5 w-1 h-1 rounded-full ${isSelected ? 'bg-white' : 'bg-[#D97706]'}`} />
                  )}
                </button>
              )
            })}
          </div>

          {/* Legend */}
          <div className="flex items-center gap-4 mt-4 pt-4 border-t border-[#E8E4DD]">
            <div className="flex items-center gap-1.5 text-[10px] text-[#92400E]">
              <div className="w-3 h-3 rounded-sm bg-[#FEF3C7]" /> Optimale Tage (Di–Do)
            </div>
            <div className="flex items-center gap-1.5 text-[10px] text-[#6B6560]">
              <div className="w-1.5 h-1.5 rounded-full bg-[#D97706]" /> Post geplant
            </div>
          </div>
        </div>

        {/* Right panel */}
        <div className="lg:w-80 space-y-4">
          {/* Selected day info */}
          {selectedDay && (
            <div className="bg-[#FFFDF9] border border-[#E8E4DD] rounded-2xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-sm font-bold text-[#2D2B28]">
                  {selectedDay.toLocaleDateString('de-DE', { weekday: 'long', day: 'numeric', month: 'long' })}
                </p>
                {isBestDay && (
                  <span className="text-[10px] bg-[#FEF3C7] text-[#92400E] px-2 py-0.5 rounded-full font-semibold">Optimaler Tag</span>
                )}
                {isWeekend && (
                  <span className="text-[10px] bg-[#F0EDE8] text-[#A39E93] px-2 py-0.5 rounded-full font-semibold">Wochenende</span>
                )}
              </div>

              {/* Timing tip */}
              {!isWeekend && (
                <div className="bg-[#F7F5F0] rounded-xl p-3">
                  <p className="text-[10px] font-semibold text-[#6B6560] uppercase tracking-wider mb-1">Beste Zeiten</p>
                  <div className="flex flex-wrap gap-1">
                    {(BEST_TIMES[selectedDow]?.slots || []).map(t => (
                      <span key={t} className="text-xs bg-white border border-[#E8E4DD] text-[#2D2B28] px-2 py-0.5 rounded-lg font-mono">{t}</span>
                    ))}
                  </div>
                  {isBestDay && <p className="text-[10px] text-[#D97706] mt-2">Dienstag–Donnerstag zwischen 8–11 Uhr erzielen auf LinkedIn durchschnittlich 2× mehr Reichweite.</p>}
                </div>
              )}
              {isWeekend && (
                <p className="text-xs text-[#A39E93]">Am Wochenende ist die Reichweite auf LinkedIn deutlich geringer. Empfehlung: Di–Do nutzen.</p>
              )}

              {/* Scheduled posts for this day */}
              {(scheduled[selectedKey] || []).length > 0 && (
                <div className="space-y-2">
                  <p className="text-[10px] font-semibold text-[#6B6560] uppercase tracking-wider">Geplante Posts</p>
                  {scheduled[selectedKey].map((s, i) => (
                    <div key={i} className="flex items-start gap-2 p-2.5 bg-white border border-[#E8E4DD] rounded-xl">
                      <span className="text-[10px] font-mono text-[#D97706] mt-0.5 flex-shrink-0">{s.time}</span>
                      <p className="text-xs text-[#2D2B28] flex-1 leading-relaxed line-clamp-2">{s.content?.split('\n')[0]}</p>
                      <button onClick={() => removeScheduled(selectedKey, i)} className="text-[#C4BFB6] hover:text-red-400 text-xs cursor-pointer flex-shrink-0">✕</button>
                    </div>
                  ))}
                </div>
              )}

              {/* Assign post button */}
              {!isWeekend && savedPosts.length > 0 && (
                <button
                  onClick={() => setShowScheduler(true)}
                  className="w-full py-2 text-xs font-semibold bg-[#D97706] text-white rounded-xl hover:bg-[#B45309] transition-colors cursor-pointer"
                >
                  + Post einplanen
                </button>
              )}
              {savedPosts.length === 0 && (
                <p className="text-xs text-[#A39E93] text-center">Speichere zuerst Posts im Archiv.</p>
              )}
            </div>
          )}

          {/* Unscheduled posts queue */}
          {unscheduledPosts.length > 0 && (
            <div className="bg-[#FFFDF9] border border-[#E8E4DD] rounded-2xl p-4 space-y-3">
              <p className="text-xs font-semibold text-[#2D2B28]">Noch nicht eingeplant ({unscheduledPosts.length})</p>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {unscheduledPosts.map(post => (
                  <div key={post.id} className="p-2.5 bg-[#F7F5F0] rounded-xl">
                    <p className="text-xs text-[#2D2B28] line-clamp-2 leading-relaxed mb-2">{post.content?.split('\n')[0]}</p>
                    <p className="text-[10px] text-[#A39E93]">
                      {selectedDay ? (
                        <button
                          onClick={() => handleSchedulePost(post)}
                          className="text-[#D97706] font-semibold hover:underline cursor-pointer"
                        >
                          Am {selectedDay.toLocaleDateString('de-DE', { day: 'numeric', month: 'short' })} einplanen →
                        </button>
                      ) : 'Tag im Kalender wählen'}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Schedule modal */}
      {showScheduler && schedulerPost && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl space-y-4">
            <h3 className="text-sm font-bold text-[#2D2B28]">Post einplanen</h3>
            <div className="bg-[#F7F5F0] rounded-xl p-3">
              <p className="text-xs text-[#2D2B28] line-clamp-3 leading-relaxed">{schedulerPost.content?.split('\n').slice(0,3).join('\n')}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-[#6B6560] mb-2">
                Datum: {selectedDay?.toLocaleDateString('de-DE', { weekday: 'long', day: 'numeric', month: 'long' })}
              </p>
              <p className="text-xs font-semibold text-[#6B6560] mb-2">Uhrzeit</p>
              <div className="flex flex-wrap gap-2">
                {(BEST_TIMES[selectedDow]?.slots || ['08:00','10:00','12:00','17:00']).map(t => (
                  <button
                    key={t}
                    onClick={() => setScheduledTime(t)}
                    className={`px-3 py-1.5 text-xs font-mono rounded-lg border cursor-pointer transition-all ${
                      scheduledTime === t ? 'bg-[#D97706] text-white border-[#D97706]' : 'border-[#E8E4DD] text-[#6B6560] hover:border-[#D97706]'
                    }`}
                  >{t}</button>
                ))}
                <input
                  type="time"
                  value={scheduledTime}
                  onChange={e => setScheduledTime(e.target.value)}
                  className="px-3 py-1.5 text-xs font-mono rounded-lg border border-[#E8E4DD] text-[#6B6560] focus:outline-none focus:ring-2 focus:ring-[#D97706]"
                />
              </div>
            </div>
            <div className="flex gap-2 pt-2">
              <button onClick={confirmSchedule} className="flex-1 py-2.5 bg-[#D97706] text-white text-sm font-semibold rounded-xl hover:bg-[#B45309] cursor-pointer">Einplanen</button>
              <button onClick={() => { setShowScheduler(false); setSchedulerPost(null) }} className="px-4 py-2.5 text-sm text-[#6B6560] border border-[#E8E4DD] rounded-xl hover:bg-[#F7F5F0] cursor-pointer">Abbrechen</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
