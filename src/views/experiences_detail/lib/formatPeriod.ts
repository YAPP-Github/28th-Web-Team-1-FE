/**
 * 기간 객체를 `"2025.05 - 2025.08"` 형태로 표기한다. 값이 없으면 빈 문자열.
 * @param period `{ startAt, endAt }` (예: `"2025-05"` / `"2025.05"`)
 * @example
 * ```ts
 * formatPeriod({ startAt: '2025-05', endAt: '2025-08' }) // "2025.05 - 2025.08"
 * ```
 */
export const formatPeriod = (period?: { startAt?: string | null; endAt?: string | null } | null) => {
  if (!period) return ''
  const formatYearMonth = (value?: string | null) => {
    if (!value) return ''
    const [year, month] = value.split(/[-.]/)
    return month ? `${year}.${month}` : year
  }
  const start = formatYearMonth(period.startAt)
  const end = formatYearMonth(period.endAt)
  return start && end ? `${start} - ${end}` : start || end
}
