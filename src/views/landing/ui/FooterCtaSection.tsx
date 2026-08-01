import Link from 'next/link'
import { ArrowRight, Sparkle } from 'lucide-react'
import { Flex } from '@radix-ui/themes'
import { Button, Heading, Text } from '@shared/ui'

export const FooterCtaSection = () => {
  return (
    <section className="px-16 py-24">
      <Flex align="center" justify="between" className="bg-primary-50 relative mx-auto max-w-[1245px] overflow-hidden rounded-2xl px-16 py-16">
        <Flex direction="column" gap="4" className="relative z-10">
          <Heading variant="title2" color="text-bolder-inverse">
            이력서 작성, 더 이상 혼자 고민하지 마세요
          </Heading>
          <Text variant="headline2" color="primary-10">
            SCOOP이 채용공고에 맞는 맞춤 이력서를 5분 만에 만들어 드려요.
          </Text>
          {/* TODO : 시작하기 라우트 연결 필요 */}
          <Button asChild variant="secondary" size="lg" className="mt-4 w-fit rounded-full bg-white">
            <Link href="/login">
              이력서 만들기
              <ArrowRight data-icon="inline-end" />
            </Link>
          </Button>
        </Flex>

        <div className="relative h-[180px] w-[140px] shrink-0 rotate-6">
          <Sparkle className="absolute -top-6 right-4 text-white" size={20} fill="currentColor" />
          <Sparkle className="absolute top-10 -right-2 text-white" size={14} fill="currentColor" />
          <div className="shadow-3 h-full w-full rounded-xl bg-white p-4">
            <Flex align="center" justify="between">
              <Text variant="caption2" color="text-subtler" weight="semibold">
                이력서 A
              </Text>
              <span className="bg-primary-10 size-3 rounded-full" aria-hidden />
            </Flex>
            <Flex direction="column" gap="2" className="mt-4">
              <div className="bg-bg-gray-subtle h-1.5 w-full rounded-full" />
              <div className="bg-bg-gray-subtle h-1.5 w-full rounded-full" />
              <div className="bg-bg-gray-subtle h-1.5 w-3/4 rounded-full" />
            </Flex>
          </div>
          <span className="bg-primary-10 text-primary-basic absolute -bottom-3 left-1/2 -translate-x-1/2 rounded-full px-2.5 py-1 text-xs font-semibold whitespace-nowrap">90% 매칭</span>
        </div>
      </Flex>
    </section>
  )
}
