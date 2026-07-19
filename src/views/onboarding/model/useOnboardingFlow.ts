'use client'
import { useCallback, useState } from 'react'

export type OnboardingStep = 'has-resume' | 'resume-upload' | 'resume-info' | 'notion-connect' | 'notion-page-select' | 'complete'

export const INITIAL_STEP: OnboardingStep = 'has-resume'

/**
 * 온보딩 스텝 네비게이션 훅.
 *
 * 스텝 이동 방식(현재는 로컬 히스토리 상태)을 캡슐화하는 **유일한 지점**이다.
 * 추후 스텝별 URL 라우팅(`/onboarding/[step]`)으로 전환할 때 이 훅 내부만
 * `useRouter`/`usePathname` 기반으로 교체하면 되고, 스텝 컴포넌트는 건드리지 않는다.
 *
 * @example
 * ```tsx
 * const { step, go, back, canGoBack } = useOnboardingFlow()
 * go('resume-upload') // 다음 스텝으로 이동
 * back()              // 이전 스텝으로 복귀
 * ```
 */
export const useOnboardingFlow = () => {
  const [history, setHistory] = useState<OnboardingStep[]>([INITIAL_STEP])
  const step = history[history.length - 1]

  const go = useCallback((next: OnboardingStep) => setHistory((prev) => [...prev, next]), [])
  const back = useCallback(() => setHistory((prev) => (prev.length > 1 ? prev.slice(0, -1) : prev)), [])

  return { step, go, back, canGoBack: history.length > 1 }
}
