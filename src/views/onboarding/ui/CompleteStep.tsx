import Link from 'next/link'
import { Flex } from '@radix-ui/themes'
import { Button, Heading, Text } from '@shared/ui'

export const CompleteStep = ({ hasConnected }: { hasConnected: boolean }) => {
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

  return (
    <Flex direction="column" gap="7" className="w-125 max-w-full">
      <Flex direction="column" align="center" gap="2" className="w-full text-center">
        <Heading variant="title3" color="text-basic" className="whitespace-pre-line">
          {content.title}
        </Heading>
        <Text variant="body1" color="text-subtle" className="whitespace-pre-line">
          {content.description}
        </Text>
      </Flex>
      <Button asChild variant="primary" size="xl" fullWidth>
        <Link href={content.href}>{content.cta}</Link>
      </Button>
    </Flex>
  )
}
