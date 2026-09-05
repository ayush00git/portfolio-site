import React from 'react'
import type { Contributions as ContributionsData } from '../lib/contributions'

const LEVEL_CLASSES = [
  'bg-neutral-900',
  'bg-emerald-900',
  'bg-emerald-700',
  'bg-emerald-500',
  'bg-emerald-300',
]

const formatDate = (date: string) =>
  new Date(date + 'T00:00:00Z').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' })

export const Contributions: React.FC<{ data: ContributionsData | null }> = ({ data }) => {
  if (!data) return null

  return (
    <div className="max-w-2xl w-full px-6 select-none">
      <a
        href="https://github.com/ayush00git"
        target="_blank"
        rel="noreferrer"
        className="flex flex-col items-center gap-4 bg-[#0a0a0c]/60 border border-neutral-900 hover:border-neutral-700 rounded-2xl px-5 py-5 shadow-lg shadow-black/30 transition-colors duration-300 cursor-pointer"
      >
      <span className="text-xs text-neutral-400 font-semibold uppercase tracking-widest font-sans">
        {data.total.toLocaleString()} contributions in the last year
      </span>

      {/* rtl on the scroller so narrow screens start at the most recent weeks */}
      <div dir="rtl" className="w-full overflow-x-auto no-scrollbar">
        <div dir="ltr" className="flex gap-[3px] w-max mx-auto">
          {data.weeks.map((week, w) => (
            <div key={w} className="flex flex-col gap-[3px]">
              {week.map((day, d) => (
                <div
                  key={d}
                  title={day.date ? `${day.count} contributions on ${formatDate(day.date)}` : undefined}
                  className={`w-2 h-2 rounded-[2px] ${day.date ? LEVEL_CLASSES[day.level] : 'bg-transparent'}`}
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      <span className="text-sm text-neutral-500 font-sans">github.com/ayush00git</span>
      </a>
    </div>
  )
}
