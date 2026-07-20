export type OnboardingStep = 'has-resume' | 'resume-upload' | 'resume-info' | 'notion-connect' | 'notion-page-select' | 'complete'

export const INITIAL_STEP: OnboardingStep = 'has-resume'

/** 모든 온보딩 스텝 컴포넌트가 공유하는 props. 스텝별 입력값은 각 스텝의 로컬 상태로 관리한다. */
/** 스텝 완료. 분기가 답변에 따라 갈리는 스텝(이력서/Notion 보유 여부)만 answer를 넘긴다. */
export interface OnboardingStepProps {
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

export const ONBOARDING_FLOW: Record<OnboardingStep, FlowNode> = {
  'has-resume': { next: (hasResume) => (hasResume ? 'resume-upload' : 'notion-connect') },
  'resume-upload': { next: 'resume-info', skip: 'notion-connect' },
  'resume-info': { next: 'notion-connect' },
  'notion-connect': { next: (hasNotion) => (hasNotion ? 'notion-page-select' : 'complete'), skip: 'complete' },
  'notion-page-select': { next: 'complete', skip: 'complete' },
  complete: { next: null }
}

/**
 * 초기 스텝에 맞는 히스토리 스택을 구성한다.
 * OAuth 콜백 복귀처럼 중간 스텝에서 시작할 때, "이전" 버튼이 자연스러운 스텝으로 가도록
 * 앞 스텝을 채워 넣는다 — `notion-page-select`의 이전은 `notion-connect`(재연동 진입점).
 */
export const buildInitialHistory = (initialStep?: OnboardingStep): OnboardingStep[] => {
  if (initialStep === 'notion-page-select') return ['notion-connect', 'notion-page-select']
  return [initialStep ?? INITIAL_STEP]
}
