import { Heading, Text } from '@shared/ui'

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
