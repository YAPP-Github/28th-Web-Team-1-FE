/**
 * 로그인 관련 오류를 식별하는 코드 모음이다.
 * 서버 응답의 `error.code`, OAuth 콜백 리다이렉트의 `?error=` 값으로 공통 사용해 문자열이 흩어지지 않게 한다.
 * `next/server`를 쓰지 않는 순수 모듈이라 클라이언트 컴포넌트에서도 안전하게 import할 수 있다.
 * (`next/server` 빌더는 `./auth`에 분리돼 있다 — 서버 전용이라 barrel(`@shared/lib`)로 노출하지 않고 직접 import한다.)
 */
export const AUTH_ERROR = {
  AUTH: 'auth' /** OAuth 콜백에서 인가 코드 누락·토큰 교환 실패 등 로그인 자체가 실패한 경우 */,
  TOKEN_EXPIRED: 'token_expired' /** accessToken 만료 후 refresh까지 실패해 재인증이 필요한 경우 */,
  REQUIRED: 'auth_required' /** 로그인하지 않은 상태로 보호된 페이지에 접근한 경우 */,
  INTERNAL: 'internal_error' /** 그 밖의 서버 측 처리 실패 */
} as const

export type AuthErrorCode = (typeof AUTH_ERROR)[keyof typeof AUTH_ERROR]

/** 각 오류 코드에 대응하는 사용자 노출 메시지. 리다이렉트(`?error=`)·토스트 등에서 공통으로 사용한다. */
export const AUTH_ERROR_MESSAGE: Record<AuthErrorCode | 'DEFAULT', string> = {
  [AUTH_ERROR.AUTH]: '로그인에 실패했어요. 다시 시도해 주세요',
  [AUTH_ERROR.TOKEN_EXPIRED]: '로그인이 만료됐어요. 다시 로그인해 주세요.',
  [AUTH_ERROR.REQUIRED]: '로그인이 필요한 페이지예요. 로그인 후 이어서 진행해 주세요.',
  [AUTH_ERROR.INTERNAL]: '일시적인 오류가 생겼어요. 잠시 후 다시 시도해 주세요.',
  /** 알 수 없는 코드가 들어왔을 때 보여줄 기본 메시지. */
  DEFAULT: '문제가 발생했어요. 잠시 후 다시 시도해 주세요.'
}

/**
 * 오류 코드 문자열을 사용자 메시지로 변환하는 함수이다.
 * 주로 `?error=` 쿼리 파라미터 값을 받아 화면에 표시할 메시지를 얻는 데 쓴다.
 * @param code 오류 코드(`?error=`/`error.code` 값). 없으면 표시할 메시지가 없다는 뜻으로 `null`을 반환한다.
 * @returns 매핑된 메시지, 알 수 없는 코드면 기본 메시지, 코드가 없으면 `null`
 * @example
 * ```ts
 * getAuthErrorMessage('token_expired') // '세션이 만료되었습니다. 다시 로그인해주세요.'
 * getAuthErrorMessage(null)            // null
 * ```
 */
export const getAuthErrorMessage = (code?: string | null): string | null => {
  if (!code) return null
  return AUTH_ERROR_MESSAGE[code as AuthErrorCode] ?? AUTH_ERROR_MESSAGE.DEFAULT
}
