import type { PropsWithChildren } from 'react'
import { Logo } from '@shared/icon'
import { Heading, Text } from '@shared/ui'

/**
 * 온보딩 공통 레이아웃
 *
 * 상단 Scoop 로고 헤더 + 화면 중앙 정렬 콘텐츠(최대 500px)로 구성된다.
 * 사이드바 없는 `(without_sidebar)` 라우트에서 사용한다.
 *
 * @example
 * ```tsx
 * <OnboardingLayout>
 *   <OnboardingStepHeader title="제목" description="설명" />
 *   ...
 * </OnboardingLayout>
 * ```
 */
export const OnboardingLayout = ({ children }: PropsWithChildren) => {
  return (
    <main className="bg-element-white flex min-h-screen flex-col">
      <header className="border-border-subtle flex items-center justify-center border-b py-3">
        <Logo />
      </header>
      <div className="flex flex-1 items-center justify-center px-6 py-10">
        <div className="flex w-125 max-w-full flex-col gap-10">{children}</div>
      </div>
    </main>
  )
}

/**
 * 온보딩 스텝 상단 제목/설명 (중앙 정렬)
 *
 * @example
 * ```tsx
 * <OnboardingStepHeader title="이미 만들어둔 이력서가 있으신가요?" description="기본 정보와 경력 사항을 자동으로 불러올 수 있어요." />
 * ```
 */
export const OnboardingStepHeader = ({ title, description }: { title: string; description: string }) => {
  return (
    <div className="flex w-full flex-col items-center gap-2 text-center">
      <Heading variant="title3" color="text-basic">
        {title}
      </Heading>
      <Text variant="body1" color="text-subtle">
        {description}
      </Text>
    </div>
  )
}
