/**
 * ISO 날짜 문자열 또는 Date를 `yyyy.MM` 형태로 변환한다. (예: '2026-10-01T00:00:00Z' → '2026.10')
 *
 * - string: 타임존 보정 없이 문자열에 쓰인 연-월을 그대로 사용 (ISO 형식이어야 함).
 *   `new Date()`로 파싱하면 date-only ISO가 UTC 자정으로 해석돼 로컬 변환 시 월이 밀릴 수 있어 정규식으로 뽑는다.
 * - Date: 로컬 시간 기준 연-월을 사용.
 *
 * @param value nullable API 필드(`startAt: string | null`)를 옵셔널 체이닝(`a?.b?.c`)으로
 *   전처리 없이 그대로 넘길 수 있도록 `null`/`undefined`도 받는다.
 * @returns 변환된 문자열, 값이 없거나 유효하지 않으면 빈 문자열
 */
const MONTH_LABELS = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12']

export const formatYYYYMM = (value?: string | Date | null): string => {
  if (!value) return ''

  if (value instanceof Date) {
    if (Number.isNaN(value.getTime())) return ''
    return `${value.getFullYear()}.${MONTH_LABELS[value.getMonth()]}`
  }

  const match = /^(\d{4})-(\d{2})/.exec(value)
  return match ? `${match[1]}.${match[2]}` : ''
}
