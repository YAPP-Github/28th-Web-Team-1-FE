'use client'
import { useCallback, useState } from 'react'

export type OnboardingStep = 'has-resume' | 'resume-upload' | 'resume-info' | 'notion-connect' | 'notion-page-select' | 'complete'

export const INITIAL_STEP: OnboardingStep = 'has-resume'

/** 모든 온보딩 스텝 컴포넌트가 공유하는 props. 스텝별 입력값은 각 스텝의 로컬 상태로 관리한다. */
export interface OnboardingStepProps {
  /** 스텝 완료. 분기가 답변에 따라 갈리는 스텝(이력서/Notion 보유 여부)만 answer를 넘긴다. */
  onDone: (answer?: boolean) => void
  onPrev?: () => void
  onSkip?: () => void
}

interface FlowNode {
  /** 다음 스텝. 함수면 스텝의 답변(answer)에 따라 분기, null이면 마지막 스텝 */
  next: OnboardingStep | ((answer: boolean) => OnboardingStep) | null
  /** "다음에 할게요" 클릭 시 이동할 스텝. 없으면 스킵 버튼 미노출 */
  skip?: OnboardingStep
}

const ONBOARDING_FLOW: Record<OnboardingStep, FlowNode> = {
  'has-resume': { next: (hasResume) => (hasResume ? 'resume-upload' : 'notion-connect') },
  'resume-upload': { next: 'resume-info', skip: 'notion-connect' },
  'resume-info': { next: 'notion-connect' },
  'notion-connect': { next: (hasNotion) => (hasNotion ? 'notion-page-select' : 'complete'), skip: 'complete' },
  'notion-page-select': { next: 'complete', skip: 'complete' },
  complete: { next: null }
}

/**
 * 온보딩 스텝 네비게이션 훅.
 *
 * 스텝 전환 그래프(`ONBOARDING_FLOW`)와 이동 방식(현재는 로컬 히스토리 상태)을
 * 캡슐화하는 **유일한 지점**이다. 추후 스텝별 URL 라우팅(`/onboarding/[step]`)으로
 * 전환할 때 이 훅 내부만 `useRouter`/`usePathname` 기반으로 교체하면 되고,
 * 스텝 컴포넌트는 건드리지 않는다.
 *
 * @example
 * ```tsx
 * const { step, next, skip, back } = useOnboardingFlow()
 * next(true) // 현재 스텝의 답변으로 플로우 맵을 따라 다음 스텝 이동
 * skip()     // 현재 스텝의 skip 경로로 이동
 * back()     // 이전 스텝으로 복귀
 * ```
 */
export const useOnboardingFlow = () => {
  const [history, setHistory] = useState<OnboardingStep[]>([INITIAL_STEP])
  const step = history[history.length - 1]

  const next = useCallback((answer?: boolean) => {
    setHistory((prev) => {
      const target = ONBOARDING_FLOW[prev[prev.length - 1]].next
      const resolved = typeof target === 'function' ? target(answer ?? false) : target
      return resolved ? [...prev, resolved] : prev
    })
  }, [])

  const skip = useCallback(() => {
    setHistory((prev) => {
      const target = ONBOARDING_FLOW[prev[prev.length - 1]].skip
      return target ? [...prev, target] : prev
    })
  }, [])

  const back = useCallback(() => setHistory((prev) => (prev.length > 1 ? prev.slice(0, -1) : prev)), [])

  return { step, next, skip, back, hasPrev: history.length > 1, hasSkip: ONBOARDING_FLOW[step].skip !== undefined }
}
