import Link from 'next/link'
import { ArrowRight, Sparkle } from 'lucide-react'
import { Flex } from '@radix-ui/themes'
import { Button, Heading, Text } from '@shared/ui'

export const FooterCtaSection = () => {
  return (
    <section className="py-24">
      <Flex align="center" justify="between" className="bg-primary-50 relative mx-auto overflow-hidden rounded-4xl px-14 py-14">
        <Flex direction="column" gap="2" className="relative z-10">
          <Heading variant="title2" color="text-bolder-inverse">
            이력서 작성, 더 이상 혼자 고민하지 마세요
          </Heading>
          <Text variant="heading2" className="text-white">
            SCOOP이 채용공고에 맞는 맞춤 이력서를 5분 만에 만들어 드려요.
          </Text>
          <Button asChild variant="secondary" size="xl" className="text-text-basic mt-8 w-fit bg-white px-8">
            <Link href="/login">
              이력서 만들기
              <ArrowRight size={20} data-icon="inline-end" />
            </Link>
          </Button>
        </Flex>

        <div className="relative h-[163px] w-100 shrink-0">
          <Flex align="center" justify="center" className="h-[303px] w-67.5">
            <div className="mt-8 rotate-[13.21deg]">
              <div className="shadow-2 h-65 w-54 rounded-2xl border border-white bg-white px-6.5 pt-6 pb-10">
                <Flex align="center" justify="between">
                  <div className="relative">
                    <span className="bg-primary-5 absolute inset-x-0 bottom-0.5 h-2.5 rounded-full" aria-hidden />
                    <p className="text-text-subtler relative text-[24px] leading-[1.35] font-bold tracking-[-0.02em]">이력서 A</p>
                  </div>
                  <span className="bg-primary-10 size-[30px] shrink-0 rounded-full" aria-hidden />
                </Flex>
                <Flex direction="column" className="mt-4 gap-5">
                  <div className="bg-primary-10 h-3.5 w-full rounded-full" />
                  <div className="bg-primary-10 h-3.5 w-full rounded-full" />
                  <div className="bg-primary-10 h-3.5 w-full rounded-full" />
                  <div className="bg-primary-10 h-3.5 w-full rounded-full" />
                </Flex>
              </div>
            </div>
          </Flex>

          <Sparkle className="absolute top-13 left-82 text-white" size={41} fill="currentColor" />
          <Sparkle className="absolute top-5 left-94 text-white" size={25} fill="currentColor" />

          <span className="bg-primary-30 shadow-3 absolute top-[118px] left-53 rounded-full px-3.5 py-1.5 text-xl font-semibold whitespace-nowrap text-white">90% 매칭</span>
        </div>
      </Flex>
    </section>
  )
}
