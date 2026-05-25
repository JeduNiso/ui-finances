import dayjs from 'dayjs'
import { useCurrency } from '../../hooks/useCurrency'

export default function ExpenseCalendar({ events = [] }) {
  const { format } = useCurrency()
  const today = dayjs()

  // Group by day of month
  const byDay = {}
  events.forEach((ev) => {
    const day = ev.day_of_month
    if (!byDay[day]) byDay[day] = []
    byDay[day].push(ev)
  })

  const daysInMonth = today.daysInMonth()
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1)

  return (
    <div className="grid grid-cols-7 gap-1">
      {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
        <div key={d} className="text-center text-xs font-medium text-slate-400 py-1">
          {d}
        </div>
      ))}

      {/* Offset for first day of month */}
      {Array.from({ length: today.startOf('month').day() }).map((_, i) => (
        <div key={`offset-${i}`} />
      ))}

      {days.map((day) => {
        const items = byDay[day] ?? []
        const isToday = today.date() === day
        return (
          <div
            key={day}
            className={`min-h-16 rounded-lg border p-1 ${
              isToday ? 'border-indigo-300 bg-indigo-50' : 'border-slate-100 bg-white'
            }`}
          >
            <p className={`text-xs font-medium mb-1 ${isToday ? 'text-indigo-600' : 'text-slate-500'}`}>
              {day}
            </p>
            {items.map((item) => (
              <div
                key={item.id}
                className="text-xs bg-amber-100 text-amber-700 rounded px-1 py-0.5 truncate mb-0.5"
                title={`${item.name} — ${format(item.amount)}`}
              >
                {item.name}
              </div>
            ))}
          </div>
        )
      })}
    </div>
  )
}
