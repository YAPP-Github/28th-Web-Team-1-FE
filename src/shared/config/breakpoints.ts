/**
 * Radix Themes·Tailwind 공통 브레이크포인트의 min-width 미디어 쿼리. `globals.css`의 `--breakpoint-*`와 값을 함께 맞춘다.
 * Tailwind 기본값이 아니라 Radix 기준이다(sm 768 / md 1024).
 */
export const MEDIA_QUERY = {
  xs: '(min-width: 520px)',
  sm: '(min-width: 768px)',
  md: '(min-width: 1024px)',
  lg: '(min-width: 1280px)',
  xl: '(min-width: 1640px)'
} as const
