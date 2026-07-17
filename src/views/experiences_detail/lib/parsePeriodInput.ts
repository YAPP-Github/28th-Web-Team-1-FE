/**
 * `"2025.05 - 2025.08"` / `"2025.05"` 표시 텍스트를 저장용 `{ startAt, endAt }`로 변환한다.
 * 표시 포맷의 점(`.`)은 저장·재파싱이 가능한 대시(`-`) ISO로 정규화한다.
 * (그대로 `"2025.05"`를 저장하면 dayjs가 잘못 파싱해 표시가 깨진다.)
 * @param value 역할/기간 수정 필드에 입력된 기간 텍스트
 * @returns 저장용 기간 객체. 비어 있으면 `null`
 * @example
 * ```ts
 * parsePeriodInput('2025.05 - 2025.08') // { startAt: '2025-05', endAt: '2025-08' }
 * parsePeriodInput('2025.05')           // { startAt: '2025-05', endAt: null }
 * parsePeriodInput('')                  // null
 * ```
 */
export const parsePeriodInput = (value: string): { startAt: string | null; endAt: string | null } | null => {
  const trimmed = value.trim()
  if (!trimmed) return null
  const [start, end] = trimmed.split(/\s*[-~]\s*/)
  const normalize = (v?: string) => v?.trim().replace(/\./g, '-') || null
  return { startAt: normalize(start), endAt: normalize(end) }
}
