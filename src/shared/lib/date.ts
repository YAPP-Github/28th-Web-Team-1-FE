import dayjs from 'dayjs'

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
  [formatDate(startAt, format), formatDate(endAt, format)].filter(Boolean).join('-')

export { formatDate, formatPeriod }
