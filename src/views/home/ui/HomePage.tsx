import { Flex } from '@radix-ui/themes'
import { GoogleLoginButton, LogoutButton } from '@features/authenticate'
import { Heading, Text } from '@shared/ui'
import { UserProfile } from '@entities/user'

export const HomePage = async () => {
  return (
    <Flex direction={'column'} align={'center'} justify={'center'} className="h-screen">
      <Heading weight={'bold'} size={'8'} className="mb-4">
        Welcome to the Home Page
      </Heading>
      <Text as={'p'} size={'6'} color={'gray-10'} className="mb-8">
        This is the main landing page of our application.
      </Text>
      <div className="flex flex-col items-center gap-3">
        <UserProfile />
        <LogoutButton />
      </div>
      <div className="flex space-x-4">
        <div className="flex flex-col items-center">
          <span>홈으로 돌아오는 로그인 버튼</span>
          <GoogleLoginButton />
        </div>
        <div className="flex flex-col items-center">
          <span>특정 URL로 이동하는 로그인 버튼</span>
          <GoogleLoginButton redirectTo="/jdurl" />
        </div>
      </div>
    </Flex>
  )
}
