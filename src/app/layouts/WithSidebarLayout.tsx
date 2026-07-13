import { Flex } from '@radix-ui/themes'
import { userAPI } from '@entities/user'
import { Sidebar } from '@widgets/sidebar'

export const WithSidebarLayout = async ({
  children
}: Readonly<{
  children: React.ReactNode
}>) => {
  // 사이드바 링크(경험 정리)를 workspace 경로로 만들기 위해 기본 워크스페이스를 서버에서 확정한다.
  // 조회 실패 시에도 사이드바는 렌더되도록 방어한다(링크는 /experiences 폴백 → redirect).
  const data = await userAPI.getUserWorkspaces().catch(() => null)
  const defaultWorkspaceId = data?.me.workspaces[0]?.workspaceId ?? ''

  return (
    <Flex className={'h-full'}>
      <Sidebar defaultWorkspaceId={defaultWorkspaceId} />
      <Flex direction={'column'} justify={'center'} className={'flex-1'}>
        {children}
      </Flex>
    </Flex>
  )
}
