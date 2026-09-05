const API_URL = 'https://github-contributions-api.jogruber.de/v4/ayush00git?y=last'
const REVALIDATE = 3600

export interface ContributionDay {
  date: string
  count: number
  level: 0 | 1 | 2 | 3 | 4
}

export interface Contributions {
  total: number
  weeks: ContributionDay[][]
}

/** Last year of contributions, grouped into Sunday-first weeks like GitHub's own chart. Null when the API is down. */
export const getContributions = async (): Promise<Contributions | null> => {
  try {
    const res = await fetch(API_URL, { next: { revalidate: REVALIDATE } })
    if (!res.ok) return null

    const data = await res.json()
    const days: ContributionDay[] = data.contributions

    const weeks: ContributionDay[][] = []
    // The first day may fall mid-week, so pad the first column to keep rows aligned to weekdays.
    const firstDay = new Date(days[0].date + 'T00:00:00Z').getUTCDay()
    let week: ContributionDay[] = Array.from({ length: firstDay }, () => ({ date: '', count: 0, level: 0 }))

    for (const day of days) {
      week.push(day)
      if (week.length === 7) {
        weeks.push(week)
        week = []
      }
    }
    if (week.length) weeks.push(week)

    return { total: data.total.lastYear ?? 0, weeks }
  } catch {
    return null
  }
}
