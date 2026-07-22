import { Flex } from '@radix-ui/themes'
import { cn } from '@shared/lib/cn'
import { Button, Heading, Text } from '@shared/ui'

interface OnboardingStepShellProps {
  title: string
  description: string
  /** 정보 확인 스텝만 넓다(992px). 기본 500px */
  wide?: boolean
  /** 다음/완료 버튼 클릭 */
  onNext: () => void
  /** 다음 버튼 비활성화 여부 */
  nextDisabled?: boolean
  /** 다음 버튼 라벨 (기본: "다음") */
  nextLabel?: string
  /** 제공 시 좌측에 이전 버튼을 노출하고 2열 레이아웃이 된다. */
  onPrev?: () => void
  /** 이전 버튼 라벨 (기본: "이전") */
  prevLabel?: string
  /** 제공 시 하단에 "다음에 할게요" 스킵 링크를 노출한다. */
  onSkip?: () => void
  children: React.ReactNode
}

/**
 * 온보딩 스텝 공통 골격: 폭 컨테이너 + 제목/설명 헤더 + 콘텐츠(children) + 하단 네비게이션
 * @example
 * ```tsx
 * <OnboardingStepShell title="질문" description="설명" onNext={done} nextDisabled={!selected} onPrev={back} onSkip={skip}>
 *   <스텝 콘텐츠 />
 * </OnboardingStepShell>
 * ```
 */
export const OnboardingStepShell = ({ title, description, wide = false, onNext, nextDisabled = false, nextLabel = '다음', onPrev, prevLabel = '이전', onSkip, children }: OnboardingStepShellProps) => {
  return (
    <Flex direction="column" gap="40px" className={cn('max-h-full min-h-0 w-full', wide ? 'max-w-248' : 'max-w-125')}>
      <Flex direction="column" align="center" gap="2" className="shrink-0">
        <Heading variant="title3" color="text-basic">
          {title}
        </Heading>
        <Text variant="body1" color="text-subtle" className="whitespace-nowrap">
          {description}
        </Text>
      </Flex>

      {/* 스텝 콘텐츠 영역: 대부분 자기 크기만큼만 차지하고, 내부 스크롤이 필요한 스텝(Notion 페이지 선택 등)만 flex-1로 남은 공간을 채워 스크롤한다 */}
      <Flex direction="column" className="min-h-0 flex-1">
        {children}
      </Flex>

      <Flex direction="column" align="center" gap="4" className="shrink-0">
        <Flex gap="4" className="w-full">
          {onPrev && (
            <Button variant="tertiary" size="xl" className="flex-1" onClick={onPrev}>
              {prevLabel}
            </Button>
          )}
          <Button variant="primary" size="xl" className="flex-1" onClick={onNext} disabled={nextDisabled}>
            {nextLabel}
          </Button>
        </Flex>
        {onSkip && (
          <Button variant="text" size="xs" onClick={onSkip}>
            다음에 할게요
          </Button>
        )}
      </Flex>
    </Flex>
  )
}
