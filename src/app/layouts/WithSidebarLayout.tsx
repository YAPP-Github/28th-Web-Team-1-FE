import { Flex } from '@radix-ui/themes'
import { HydrationBoundary, dehydrate } from '@tanstack/react-query'
import { userQueries } from '@entities/user'
import { Sidebar } from '@widgets/sidebar'
import { getQueryClient } from '../provider/getQueryClient'

export const WithSidebarLayout = async ({
  children
}: Readonly<{
  children: React.ReactNode
}>) => {
  // me를 서버에서 미리 채운다. 하위의 useSuspenseQuery(me)/useWorkspaceId가
  // 첫 렌더부터 캐시를 읽어 Suspense 경계 밖(헤더 검색창·다이얼로그)에서도 실제로 suspend되지 않게 한다.
  const queryClient = getQueryClient()
  await queryClient.prefetchQuery(userQueries.me())

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Flex className={'h-full'}>
        <Sidebar />
        <Flex direction={'column'} justify={'center'} className={'flex-1'}>
          {children}
        </Flex>
      </Flex>
    </HydrationBoundary>
  )
}
