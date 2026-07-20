'use client'
import { useCallback, useState } from 'react'
import { ONBOARDING_FLOW, buildInitialHistory, type OnboardingStep } from './onboardingFlow'

export type { OnboardingStep, OnboardingStepProps } from './onboardingFlow'

/**
 * 온보딩 스텝 네비게이션 훅.
 *
 * 스텝 전환 그래프(`ONBOARDING_FLOW`)와 이동 방식(현재는 로컬 히스토리 상태)을 캡슐화함
 *
 * @param initialStep 시작 스텝. Notion OAuth 콜백 복귀(`?step=`)처럼 중간 스텝에서 재진입할 때 지정한다.
 * @example
 * ```tsx
 * const { step, next, skip, back } = useOnboardingFlow()
 * next(true) // 현재 스텝의 답변으로 플로우 맵을 따라 다음 스텝 이동
 * skip()     // 현재 스텝의 skip 경로로 이동
 * back()     // 이전 스텝으로 복귀
 * ```
 */
export const useOnboardingFlow = (initialStep?: OnboardingStep) => {
  const [history, setHistory] = useState<OnboardingStep[]>(() => buildInitialHistory(initialStep))
  // "다음"으로 통과한 스텝 기록. 스킵은 기록하지 않아 완료 여부(연동 여부)를 구분한다.
  const [completed, setCompleted] = useState<OnboardingStep[]>([])
  const step = history[history.length - 1]

  const next = useCallback(
    (answer?: boolean) => {
      const target = ONBOARDING_FLOW[step].next
      const resolved = typeof target === 'function' ? target(answer ?? false) : target
      if (!resolved) return
      setCompleted((prev) => (prev.includes(step) ? prev : [...prev, step]))
      setHistory((prev) => [...prev, resolved])
    },
    [step]
  )

  const skip = useCallback(() => {
    const target = ONBOARDING_FLOW[step].skip
    if (target) setHistory((prev) => [...prev, target])
  }, [step])

  const back = useCallback(() => {
    if (history.length <= 1) return
    // 되돌아간 스텝은 다시 진행해야 하므로 완료 기록에서 제거
    const returnTo = history[history.length - 2]
    setCompleted((prev) => prev.filter((completedStep) => completedStep !== returnTo))
    setHistory((prev) => prev.slice(0, -1))
  }, [history])

  return {
    step,
    next,
    skip,
    back,
    hasPrev: history.length > 1,
    hasSkip: ONBOARDING_FLOW[step].skip !== undefined,
    /** 이력서(정보 확인까지) 또는 Notion(페이지 선택까지) 연동을 완료했는지 — 완료 화면 CTA 분기용 */
    hasConnected: completed.includes('resume-info') || completed.includes('notion-page-select')
  }
}
