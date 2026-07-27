/**
 * 숫자만 남겨 자릿수에 맞춰 하이픈을 자동으로 넣는다(10자리는 3-3-4, 11자리는 3-4-4). `onChange`에서 그대로
 * 반환값을 넣으면 타이핑 중에 실시간으로 포맷된다. 11자리(휴대폰 번호)를 넘는 입력은 잘라낸다.
 * @param value 사용자가 입력 중인 원본 문자열(숫자 외 문자 포함 가능)
 * @returns 하이픈이 들어간 전화번호 문자열
 * @example
 * ```ts
 * formatPhoneNumber('01012345678') // '010-1234-5678'
 * formatPhoneNumber('0111234567')  // '011-123-4567'
 * formatPhoneNumber('010')         // '010'
 * ```
 */
export const formatPhoneNumber = (value: string): string => {
  const digits = value.replace(/\D/g, '').slice(0, 11)
  if (digits.length < 4) return digits
  if (digits.length < 7) return `${digits.slice(0, 3)}-${digits.slice(3)}`
  if (digits.length < 11) return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}`
  return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`
}
