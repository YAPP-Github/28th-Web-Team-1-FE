import { Button } from '@shared/ui'

interface OnboardingFooterProps {
  /** 다음/완료 버튼 클릭 */
  onNext: () => void
  /** 다음 버튼 비활성화 여부 */
  nextDisabled?: boolean
  /** 다음 버튼 라벨 (기본: "다음") */
  nextLabel?: string
  /** 제공 시 좌측에 "이전" 버튼을 노출하고 2열 레이아웃이 된다. */
  onPrev?: () => void
  /** 제공 시 하단에 "다음에 할게요" 스킵 링크를 노출한다. */
  onSkip?: () => void
}

/**
 * 온보딩 스텝 하단 네비게이션
 *
 * `onPrev` 유무에 따라 단일 "다음"(풀폭) 또는 "이전 / 다음"(2열)로 렌더하고,
 * `onSkip`이 있으면 "다음에 할게요" 링크를 아래에 추가한다.
 *
 * @example
 * ```tsx
 * <OnboardingFooter onNext={next} nextDisabled={!selected} />
 * <OnboardingFooter onPrev={back} onNext={next} nextDisabled={!file} onSkip={skip} />
 * ```
 */
export const OnboardingFooter = ({ onNext, nextDisabled = false, nextLabel = '다음', onPrev, onSkip }: OnboardingFooterProps) => {
  return (
    <div className="flex w-full flex-col items-center gap-4">
      {onPrev ? (
        <div className="flex w-full gap-4">
          <Button variant="tertiary" size="xl" className="flex-1" onClick={onPrev}>
            이전
          </Button>
          <Button variant="primary" size="xl" className="flex-1" onClick={onNext} disabled={nextDisabled}>
            {nextLabel}
          </Button>
        </div>
      ) : (
        <Button variant="primary" size="xl" fullWidth onClick={onNext} disabled={nextDisabled}>
          {nextLabel}
        </Button>
      )}
      {onSkip && (
        <Button variant="text" size="sm" className="text-caption1" onClick={onSkip}>
          다음에 할게요
        </Button>
      )}
    </div>
  )
}
