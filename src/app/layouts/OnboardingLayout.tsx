import type { PropsWithChildren } from 'react'
import { Logo } from '@shared/icon'

/**
 * 온보딩 공통 레이아웃 (Next route segment `layout.tsx`에서 사용)
 *
 * 상단 Scoop 로고 헤더 + 화면 중앙 정렬 영역으로 구성된 온보딩 셸이다.
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
    <main className="bg-element-white h-screen overflow-x-hidden">
      <header className="border-border-subtle bg-element-white fixed inset-x-0 top-0 z-10 flex items-center justify-center border-b py-4">
        <Logo />
      </header>
      {/* 헤더가 fixed라 그만큼(h-16) 상단 패딩으로 밀어내고, 콘텐츠가 화면보다 커지면 이 영역 전체가 스크롤된다(min-h-full이라 넘치는 순간부터 상단 정렬로 자연스럽게 전환). */}
      <div className="h-full overflow-y-auto pt-16">
        <div className="flex min-h-full items-center justify-center px-6 py-10">{children}</div>
      </div>
    </main>
  )
}
