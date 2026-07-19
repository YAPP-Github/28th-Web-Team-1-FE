import Link from 'next/link'
import { Flex } from '@radix-ui/themes'
import { Button, Heading, Text } from '@shared/ui'

/** 온보딩 완료 화면: Notion 미연동 종료 시 경험정리 페이지로 유도한다. */
export const CompleteStep = () => {
  return (
    <Flex direction="column" gap="7" className="w-full max-w-125">
      <Flex direction="column" align="center" gap="2" className="w-full text-center">
        <Heading variant="title3" color="text-basic" className="whitespace-pre-line">
          {`이력서와 경험 정리, 아직이라면\nSCOOP과 함께 처음부터 시작해 보세요.`}
        </Heading>
        <Text variant="body1" color="text-subtle" className="whitespace-pre-line">
          {`흩어져 있는 경험을 하나씩 정리해,\n지원하는 직무에 맞는 이력서로 완성할 수 있어요.`}
        </Text>
      </Flex>
      <Button asChild variant="primary" size="xl" fullWidth>
        <Link href="/experiences">경험정리 하러가기</Link>
      </Button>
    </Flex>
  )
}
