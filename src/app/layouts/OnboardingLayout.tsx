import type { PropsWithChildren } from 'react'
import { Logo } from '@shared/icon'

/**
 * 온보딩 공통 레이아웃 (Next route segment `layout.tsx`에서 사용)
 *
 * 상단 Scoop 로고 헤더 + 화면 중앙 정렬 영역으로 구성된 온보딩 셸이다.
 * 콘텐츠 폭(narrow 500px / wide 992px)은 스텝별로 다르므로 각 스텝 컴포넌트가 자체 폭 컨테이너를 소유한다.
 *
 * @example
 * ```tsx
 * // app/(without_sidebar)/onboarding/layout.tsx
 * import { OnboardingLayout } from '@app/layouts/OnboardingLayout'
 * export default OnboardingLayout
 * ```
 */
export const OnboardingLayout = ({ children }: PropsWithChildren) => {
  return (
    <main className="bg-element-white flex min-h-screen flex-col">
      <header className="border-border-subtle flex items-center justify-center border-b py-3">
        <Logo />
      </header>
      <div className="flex flex-1 items-center justify-center px-6 py-10">{children}</div>
    </main>
  )
}
