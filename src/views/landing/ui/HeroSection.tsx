import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Flex } from '@radix-ui/themes'
import { Button, Heading, Text } from '@shared/ui'

export const HeroSection = () => {
  return (
    <section className="relative overflow-hidden pt-20 pb-28">
      <Image src="/landing/background.png" alt="" fill priority sizes="100vw" className="object-cover" />

      <Flex direction="column" align="center" gap="6" className="relative mx-auto max-w-[578px] text-center">
        <Text variant="title1" weight="bold" className="font-elms text-text-basic tracking-[-0.02em]">
          SCOOP
        </Text>
        <Heading variant="title1" color="text-basic" className="text-balance">
          경험이 담긴 자료를 업로드하면, 이력서를 떠먹여 드려요
        </Heading>
        <Text variant="headline2" color="text-subtle" className="text-balance">
          Notion, PDF 등 경험이 담긴 자료를 업로드하면 AI가 핵심 내용을 분석해 지원하는 채용공고에 맞는 이력서로 정리해 드려요.
        </Text>
        <Button asChild size="lg" className="rounded-full">
          <Link href="/login">
            무료로 시작하기
            <ArrowRight data-icon="inline-end" />
          </Link>
        </Button>
      </Flex>

      <div className="relative mx-auto mt-16 w-[480px] max-w-full">
        <Image src="/landing/resume.png" alt="SCOOP으로 생성한 이력서 미리보기" width={2924} height={4278} sizes="480px" className="h-auto w-full" priority />
      </div>
    </section>
  )
}
