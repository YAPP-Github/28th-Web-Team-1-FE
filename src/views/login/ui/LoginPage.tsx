import { Suspense } from 'react'
import Link from 'next/link'
import { Flex } from '@radix-ui/themes'
import { AuthErrorToast, GoogleLoginButton } from '@features/authenticate'
import { Button, Heading, Text } from '@shared/ui'
import { Logo } from '@shared/icon'

export const LoginPage = () => {
  return (
    <main className="relative">
      <Suspense fallback={null}>
        <AuthErrorToast />
      </Suspense>
      <header className="absolute top-8 left-8 flex items-center gap-16">
        <Logo href="/" />
        <Button asChild variant="text" size="xl">
          <Link href="/">주요기능</Link>
        </Button>
        <Button asChild variant="text" size="xl">
          <Link href="https://tally.so/r/zx497a" target="_blank" rel="noopener noreferrer">
            제보
          </Link>
        </Button>
      </header>

      <Flex direction="column" gap="64px" align="center" justify="center" className="h-screen">
        <Flex gap="5" direction="column" align="center">
          <img src="/landing/login_logo.png" alt="SCOOP" className="w-19.5" />
          <Flex direction="column" gap="2">
            <Flex direction="column" gap="6px" align="center">
              <Heading variant="display3" color="text-basic" className="text-center whitespace-pre-wrap">
                {`채용 마감 하루 전, \n경쟁력 있는 맞춤 이력서를 5분 만에`}
              </Heading>
              <Text variant="heading2" color="text-subtler" className="text-center whitespace-pre-wrap">
                {`Notion, PDF 등 경험이 담긴 자료를 업로드하면 \n공고에 맞는 이력서로 만들어서 떠먹여 줄게요`}
              </Text>
            </Flex>
          </Flex>
        </Flex>
        <Flex direction="column" gap="4" align="center" className="w-100">
          <GoogleLoginButton redirectTo="/home" />
          <Text variant="label1" color="text-disabled-on" className="text-center">
            계속 진행함에 따라{' '}
            <Button asChild variant="text" size="sm">
              <Link href="https://available-snow-c5b.notion.site/3ac0173187fb80b583f4d497f1721bcc?source=copy_link" target="_blank" rel="noopener noreferrer">
                이용약관
              </Link>
            </Button>{' '}
            및{' '}
            <Button asChild variant="text" size="sm">
              <Link href="https://available-snow-c5b.notion.site/3ac0173187fb80a3af84fbb6bb20f150?source=copy_link" target="_blank" rel="noopener noreferrer">
                개인정보 처리방침
              </Link>
            </Button>
            에 동의합니다.
          </Text>
        </Flex>
      </Flex>
    </main>
  )
}
