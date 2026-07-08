import Link from 'next/link'
import { Flex } from '@radix-ui/themes'
import { GoogleLoginButton } from '@features/authenticate'
import { Button, Heading, Text } from '@shared/ui'
import { Logo } from '@shared/icon'

export const LoginPage = () => {
  return (
    <main className="relative">
      <header className="absolute top-8 left-8 flex items-center gap-16">
        <Logo />
        {/* TODO : 링크 연결 필요 */}
        <Button asChild variant="text" size="xl">
          <Link href="/login#">주요기능</Link>
        </Button>
        <Button asChild variant="text" size="xl">
          <Link href="/login#">제보</Link>
        </Button>
      </header>
      <Flex direction="column" gap="48px" align="center" justify="center" className="h-screen">
        <Flex gap="5" direction="column" align="center">
          {/* TODO : 로고가 생기면 변경 필요 */}
          <div className="bg-element-primary-lighter text-text-primary-basic flex h-20 w-20 items-center justify-center">LOGO</div>
          <Flex direction="column" gap="2">
            <Flex direction="column" gap="6px" align="center">
              <Heading variant="display3" color="text-basic">
                떠먹여주는 이력서, SCOOP
              </Heading>
              <Text variant="heading2" color="text-subtler">
                한 번의 경험 정리로, 모든 지원을 더 쉽게
              </Text>
            </Flex>
          </Flex>
        </Flex>
        <Flex direction="column" gap="4" align="center">
          <GoogleLoginButton />
          <Text variant="label1" color="text-disabled-on" className="text-center">
            계속 진행함에 따라{' '}
            <Button asChild variant="text" size="sm">
              {/* TODO : 이용약관 링크 추가 필요 */}
              <Link href="/login#">이용약관</Link>
            </Button>{' '}
            및{' '}
            <Button asChild variant="text" size="sm">
              {/* TODO : 개인정보 처리방침 링크 추가 필요 */}
              <Link href="/login#">개인정보 처리방침</Link>
            </Button>
            에 동의합니다.
          </Text>
        </Flex>
      </Flex>
    </main>
  )
}
