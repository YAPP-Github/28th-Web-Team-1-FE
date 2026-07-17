import dayjs from 'dayjs'

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

// TODO : 날짜 형식이 늘어날 경우 추가 필요
type DateFormat = 'YYYY.MM.DD' | 'YYYY.MM'

/**
 * 날짜 값을 지정한 포맷 문자열로 변환한다. 값이 없거나(`null`/`undefined`) 유효하지 않으면 빈 문자열.
 * @param date dayjs가 받는 입력(ISO 문자열·타임스탬프·`Date`·`Dayjs`). API의 nullable 필드를
 *   옵셔널 체이닝(`a?.b?.c`)으로 전처리 없이 넘길 수 있도록 `null`/`undefined`도 허용한다.
 * @param format 출력 포맷(기본 `'YYYY.MM.DD'`). `DateFormat` 유니온으로 제한해 미지원 포맷을 컴파일 타임에 막는다.
 * @returns 변환된 문자열, 값이 없거나 유효하지 않으면 빈 문자열
 * @example
 * ```ts
 * formatDate('2025-07-01')             // '2025.07.01'
 * formatDate('2025-07-01', 'YYYY.MM')  // '2025.07'
 * formatDate(null)                     // ''
 * ```
 */
const formatDate = (date?: dayjs.ConfigType, format: DateFormat = 'YYYY.MM.DD'): string => {
  if (date === null || date === undefined) return ''
  const d = dayjs(date)
  return d.isValid() ? d.format(format) : ''
}

/**
 * 시작·종료 날짜를 `"2025.07 - 2025.09"` 형태로 합친다. 두 값 모두 같은 `format`으로 변환한다.
 * 한쪽만 있으면 그 값만(구분자 없음), 둘 다 없으면 빈 문자열. (`'-'` 대체는 표시하는 쪽에서 `|| '-'`로 처리)
 * @param startAt 시작 날짜 값
 * @param endAt 종료 날짜 값
 * @param format 각 날짜의 출력 포맷(기본 `'YYYY.MM'`)
 * @returns 합친 문자열
 * @example
 * ```ts
 * formatPeriod('2025-07-01', '2025-09-30')              // '2025.07-2025.09'
 * formatPeriod('2025-07-01', '2025-09-30', 'YYYY.MM.DD')// '2025.07.01-2025.09.30'
 * formatPeriod('2025-07-01', null)                      // '2025.07'
 * formatPeriod(null, null)                              // ''
 * ```
 */
const formatPeriod = (startAt?: dayjs.ConfigType, endAt?: dayjs.ConfigType, format: DateFormat = 'YYYY.MM'): string =>
  [formatDate(startAt, format), formatDate(endAt, format)].filter(Boolean).join(' - ')

export { formatDate, formatPeriod }
