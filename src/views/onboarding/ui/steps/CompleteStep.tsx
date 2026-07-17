import Link from 'next/link'
import { Button, Heading, Text } from '@shared/ui'

interface CompleteStepProps {
  /** 이력서 보유 여부에 따라 문구/CTA가 달라진다. */
  hasResume: boolean
}

const COMPLETE_CONTENT = {
  withResume: {
    titleLines: ['이력서와 경험 정리, 마이페이지에', 'SCOOP과 함께 채우면서 시작해 보세요.'],
    ctaLabel: '대시보드로 이동하기',
    ctaHref: '/home'
  },
  withoutResume: {
    titleLines: ['이력서와 경험 정리, 아직이라면', 'SCOOP과 함께 처음부터 시작해 보세요.'],
    ctaLabel: '경험정리 하러가기',
    ctaHref: '/experiences'
  }
} as const

/** 온보딩 완료 화면: 이력서 보유 여부에 따라 대시보드/경험정리로 안내한다. */
export const CompleteStep = ({ hasResume }: CompleteStepProps) => {
  const { titleLines, ctaLabel, ctaHref } = hasResume ? COMPLETE_CONTENT.withResume : COMPLETE_CONTENT.withoutResume

  return (
    <>
      <div className="flex w-full flex-col items-center gap-2 text-center">
        <Heading variant="title3" color="text-basic">
          {titleLines[0]}
          <br />
          {titleLines[1]}
        </Heading>
        <Text variant="body1" color="text-subtle">
          흩어져 있는 경험을 하나씩 정리해,
          <br />
          지원하는 직무에 맞는 이력서로 완성할 수 있어요.
        </Text>
      </div>
      <Button asChild variant="primary" size="xl" fullWidth>
        <Link href={ctaHref}>{ctaLabel}</Link>
      </Button>
    </>
  )
}
