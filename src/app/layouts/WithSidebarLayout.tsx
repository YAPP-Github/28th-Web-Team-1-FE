import { Flex } from '@radix-ui/themes'
import { Sidebar } from '@widgets/sidebar'
import { AmplitudeIdentify } from '../provider/AmplitudeIdentify'

export const WithSidebarLayout = ({
  children
}: Readonly<{
  children: React.ReactNode
}>) => {
  return (
    <Flex className={'h-full'}>
      <AmplitudeIdentify />
      <Sidebar />
      <Flex direction={'column'} justify={'center'} className={'flex-1'}>
        {children}
      </Flex>
    </Flex>
  )
}
