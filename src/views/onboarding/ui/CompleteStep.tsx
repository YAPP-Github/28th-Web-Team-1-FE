import Link from 'next/link'
import { Button, Heading, Text } from '@shared/ui'

/** 온보딩 완료 화면: Notion 미연동 종료 시 경험정리 페이지로 유도한다. */
export const CompleteStep = () => {
  return (
    <div className="flex w-full max-w-125 flex-col gap-10">
      <div className="flex w-full flex-col items-center gap-2 text-center">
        <Heading variant="title3" color="text-basic">
          이력서와 경험 정리, 아직이라면
          <br />
          SCOOP과 함께 처음부터 시작해 보세요.
        </Heading>
        <Text variant="body1" color="text-subtle">
          흩어져 있는 경험을 하나씩 정리해,
          <br />
          지원하는 직무에 맞는 이력서로 완성할 수 있어요.
        </Text>
      </div>
      <Button asChild variant="primary" size="xl" fullWidth>
        <Link href="/experiences">경험정리 하러가기</Link>
      </Button>
    </div>
  )
}
