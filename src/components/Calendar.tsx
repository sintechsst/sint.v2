'use client'

import { useState } from 'react'
import { format, startOfMonth, endOfMonth, eachDayOfInterval, getDay } from 'date-fns'

interface CalendarProps {
  selectedDate?: string
  blockedDates?: string[]
  ocupacao?: Record<string, number>
  onDateSelect: (date: string) => void
}

export default function Calendar({
  selectedDate,
  blockedDates = [],
  ocupacao = {},
  onDateSelect
}: CalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date())

  const days = eachDayOfInterval({
    start: startOfMonth(currentMonth),
    end: endOfMonth(currentMonth)
  })

  function renderCells() {
    return days.map((day, i) => {
      const formattedDate = format(day, 'yyyy-MM-dd')
      const isBlocked = blockedDates.includes(formattedDate)
      const isSelected = formattedDate === selectedDate
      const isWeekend = [0, 6].includes(getDay(day))
      const total = ocupacao[formattedDate] || 0

      return (
        <button
          key={i}
          onClick={() => {
            if (!isBlocked) {
              onDateSelect(formattedDate)
            }
          }}
          className={`relative h-16 w-full rounded-xl text-sm transition
            ${isSelected ? 'bg-indigo-600 text-white' : 'bg-white/5 text-slate-400'}
            ${isBlocked ? 'opacity-20 cursor-not-allowed' : 'hover:bg-indigo-500/10'}
            ${isWeekend ? 'ring-1 ring-purple-500/10' : ''}
          `}
        >
          <div className="absolute top-1 left-2 text-xs">
            {format(day, 'd')}
          </div>

          {total >= 5 && !isBlocked && (
            <div className="absolute top-1 right-1 w-2 h-2 bg-purple-500 rounded-full" />
          )}
        </button>
      )
    })
  }

  return (
    <div className="grid grid-cols-7 gap-3">
      {renderCells()}
    </div>
  )
}
