import { usePathname } from 'next/navigation'
/**
 * 현재 라우트 경로(pathname)가 인자로 받은 특정 주소(href)와 일치하거나
 * 하위 경로에 속해 있는지 체크하여 활성화 상태를 반환하는 커스텀 훅입니다.
 *
 * @param href - 검사할 대상 경로 (예: '/', '/experiences')
 * @returns 현재 경로가 대상 경로와 일치하거나 하위 경로이면 `true`, 그렇지 않으면 `false`
 *
 * @example
 * ```tsx
 * const isActive = useActivePath('/experiences'); // 현재 /experiences/123 이라면 true
 * const isHomeActive = useActivePath('/');        // 현재 / 이외의 경로에서는 false
 * ```
 */
export const useActivePath = (href: string): boolean => {
  const pathname = usePathname()
  return href === '/' ? pathname === '/' : pathname === href || pathname.startsWith(`${href}/`)
}

// Todo: 만약  반복문 안에서 훅 호출 상황일 경우 아래 처럼 변경 필요
// ❌ 반복문 안에서 훅 호출은 Rules of Hooks 위반
// const { checkActive } = useActivePath()
// NAV_ITEMS.map(({ href }) => {
//   const isActive = checkActive(href) // OK
// })
