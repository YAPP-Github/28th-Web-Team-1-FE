export type OnboardingStep = 'has-resume' | 'resume-upload' | 'notion-connect' | 'complete'

export const INITIAL_STEP: OnboardingStep = 'has-resume'

/** 온보딩 진행 중 수집하는 답변 상태 (이번 범위: UI/로컬 상태만) */
export interface OnboardingAnswers {
  hasResume: boolean | null
  resumeFile: File | null
  hasNotion: boolean | null
}

/**
 * 현재 스텝과 답변으로 다음 스텝을 결정한다.
 * `'complete'`는 온보딩 마지막(완료) 화면이며 CTA로 온보딩을 벗어난다.
 *
 * 스텝 순서/분기 정의를 여기 한 곳에 모아 라우팅 방식과 분리한다.
 * (정보 확인/노션 스텝은 이후 이 분기 사이에 끼워 넣는다.)
 *
 * @param step 현재 스텝
 * @param answers 지금까지 수집된 답변
 * @example
 * ```ts
 * resolveNextStep('has-resume', { hasResume: true }) // 'resume-upload'
 * resolveNextStep('has-resume', { hasResume: false }) // 'notion-connect'
 * ```
 */
export const resolveNextStep = (step: OnboardingStep, answers: OnboardingAnswers): OnboardingStep => {
  switch (step) {
    case 'has-resume':
      // 이력서 있음 → 파일 업로드, 없음 → 노션 연동
      return answers.hasResume ? 'resume-upload' : 'notion-connect'
    case 'resume-upload':
      return 'complete'
    case 'notion-connect':
      return 'complete'
    case 'complete':
      return 'complete'
    default:
      return 'complete'
  }
}
