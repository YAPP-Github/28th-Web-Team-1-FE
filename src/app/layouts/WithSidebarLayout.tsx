import { Flex } from '@radix-ui/themes'
import { Sidebar } from '@widgets/sidebar'

export const WithSidebarLayout = ({
  children
}: Readonly<{
  children: React.ReactNode
}>) => {
  return (
    <Flex className={'min-h-full'}>
      <Sidebar />
      <Flex direction={'column'} justify={'center'} className={'w-full flex-1'}>
        {children}
      </Flex>
    </Flex>
  )
}
