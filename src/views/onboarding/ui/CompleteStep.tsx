import Link from 'next/link'
import { Flex } from '@radix-ui/themes'
import { Button, Heading, Text } from '@shared/ui'

export const CompleteStep = ({ hasConnected }: { hasConnected: boolean }) => {
  const content = hasConnected
    ? {
        title: `경험을 모두 등록했어요\nSCOOP과 함께 이력서를 만들어 보세요`,
        description: `등록된 경험을 바탕으로\n채용 공고에 맞춰 이력서를 만들 수 있어요`,
        href: '/home',
        cta: '이력서 만들러 가기'
      }
    : {
        title: `경험 정리와 이력서,\n아직이라면 SCOOP과 함께 시작해 보세요`,
        description: `채용 공고에 맞춰 이력서를 만들 수 있어요.\n흩어져 있는 경험을 정리하는 것부터 시작하면 돼요.`,
        href: '/experiences',
        cta: '경험 정리하러 가기'
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
