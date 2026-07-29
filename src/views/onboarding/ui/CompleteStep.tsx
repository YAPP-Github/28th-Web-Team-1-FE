'use client'
import { useCallback } from 'react'
import Link from 'next/link'
import { Flex } from '@radix-ui/themes'
import { Button, Heading, Text } from '@shared/ui'
import { AMPLITUDE_EVENTS } from '@shared/lib'
import * as amplitude from '@amplitude/unified'

interface CompleteStepProps {
  hasConnected: boolean
}

export const CompleteStep = ({ hasConnected }: CompleteStepProps) => {
  // TODO : 라이팅은 추후에 수정될 수 있음.
  const content = hasConnected
    ? {
        title: `이력서 준비가 끝났어요!\n이제 SCOOP을 시작해 보세요.`,
        description: `가져온 정보를 바탕으로\n지원하는 직무에 맞는 이력서를 완성할 수 있어요.`,
        href: '/home',
        cta: '홈으로 가기'
      }
    : {
        title: `이력서와 경험 정리, 아직이라면\nSCOOP과 함께 처음부터 시작해 보세요.`,
        description: `흩어져 있는 경험을 하나씩 정리해,\n지원하는 직무에 맞는 이력서로 완성할 수 있어요.`,
        href: '/experiences',
        cta: '경험정리 하러가기'
      }

  const handleCtaClick = useCallback(() => {
    if (!hasConnected) amplitude.track(AMPLITUDE_EVENTS.DIRECT_WRITE_ENTERED)
  }, [hasConnected])

  return (
    <Flex direction="column" gap="7" className="w-full max-w-125">
      <Flex direction="column" align="center" gap="2" className="w-full text-center">
        <Heading variant="title3" color="text-basic" className="whitespace-pre-line">
          {content.title}
        </Heading>
        <Text variant="body1" color="text-subtle" className="whitespace-pre-line">
          {content.description}
        </Text>
      </Flex>
      <Button asChild variant="primary" size="xl" fullWidth onClick={handleCtaClick}>
        <Link href={content.href}>{content.cta}</Link>
      </Button>
    </Flex>
  )
}
