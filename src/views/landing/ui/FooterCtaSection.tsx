'use client'
import Link from 'next/link'
import { ArrowRight, Sparkle } from 'lucide-react'
import { motion } from 'motion/react'
import { Flex } from '@radix-ui/themes'
import { Button, Heading, Text } from '@shared/ui'
import { usePcOnlyDialog } from '../lib/usePcOnlyDialog'
import { PcOnlyDialog } from './PcOnlyDialog'

export const FooterCtaSection = () => {
  const { isOpen, setIsOpen, handleClick } = usePcOnlyDialog()

  return (
    <section className="py-14 md:py-24">
      <Flex
        direction={{ initial: 'column', md: 'row' }}
        align="center"
        justify="between"
        gap="8"
        className="bg-primary-50 relative mx-auto overflow-hidden rounded-3xl px-6 py-10 md:rounded-4xl md:px-14 md:py-14"
      >
        <Flex direction="column" gap="2" align={{ initial: 'center', md: 'start' }} className="relative z-10 text-center md:text-left">
          <Heading variant="title2" color="text-bolder-inverse" className="break-keep">
            이력서 작성, 더 이상 혼자 고민하지 마세요
          </Heading>
          <Text variant="heading2" className="break-keep text-white">
            SCOOP이 채용공고에 맞는 맞춤 이력서를 5분 만에 만들어 드려요.
          </Text>
          <Button asChild variant="secondary" size="xl" className="text-text-basic mt-6 w-fit bg-white px-8 md:mt-8">
            <Link href="/login" onClick={handleClick}>
              이력서 만들기
              <ArrowRight size={20} data-icon="inline-end" className="transition-transform duration-300 group-hover/button:translate-x-1" />
            </Link>
          </Button>
        </Flex>

        <div className="relative h-27 w-65 shrink-0 md:h-40.75 md:w-100">
          <Flex align="center" justify="center" className="h-49 w-44 md:h-75.75 md:w-67.5">
            <motion.div
              className="mt-4 rotate-[13.21deg] md:mt-8"
              initial={{ opacity: 0, scale: 0.85, y: 24 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{ type: 'spring', stiffness: 260, damping: 20 }}
            >
              <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}>
                <div className="shadow-2 h-42 w-35 rounded-xl border border-white bg-white px-4 pt-4 pb-6 md:h-65 md:w-54 md:rounded-2xl md:px-6.5 md:pt-6 md:pb-10">
                  <Flex align="center" justify="between">
                    <div className="relative">
                      <span className="bg-primary-5 absolute inset-x-0 bottom-0.5 h-1.5 rounded-full md:h-2.5" aria-hidden />
                      <p className="text-text-subtler relative text-[16px] leading-[1.35] font-bold tracking-[-0.02em] md:text-[24px]">이력서 A</p>
                    </div>
                    <span className="bg-primary-10 size-5 shrink-0 rounded-full md:size-7.5" aria-hidden />
                  </Flex>
                  <Flex direction="column" className="mt-3 gap-3 md:mt-4 md:gap-5">
                    <div className="bg-primary-10 h-2.5 w-full rounded-full md:h-3.5" />
                    <div className="bg-primary-10 h-2.5 w-full rounded-full md:h-3.5" />
                    <div className="bg-primary-10 h-2.5 w-full rounded-full md:h-3.5" />
                    <div className="bg-primary-10 h-2.5 w-full rounded-full md:h-3.5" />
                  </Flex>
                </div>
              </motion.div>
            </motion.div>
          </Flex>

          <motion.div
            className="absolute top-8 left-53 md:top-13 md:left-82"
            animate={{ opacity: [0.8, 1, 0.8], scale: [0.95, 1, 0.95] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          >
            <Sparkle className="size-6.5 text-white md:size-10.25" fill="currentColor" />
          </motion.div>
          <motion.div
            className="absolute top-3 left-61 md:top-5 md:left-94"
            animate={{ opacity: [1, 0.8, 1], scale: [1, 0.95, 1] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
          >
            <Sparkle className="size-4 text-white md:size-6.25" fill="currentColor" />
          </motion.div>

          <motion.span
            className="bg-primary-30 shadow-3 absolute top-19 left-34 rounded-full px-2.5 py-1 text-sm font-semibold whitespace-nowrap text-white md:top-29.5 md:left-53 md:px-3.5 md:py-1.5 md:text-xl"
            initial={{ opacity: 0, scale: 0.6 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ type: 'spring', stiffness: 300, damping: 16, delay: 0.3 }}
          >
            90% 매칭
          </motion.span>
        </div>
      </Flex>
      <PcOnlyDialog isOpen={isOpen} onOpenChange={setIsOpen} />
    </section>
  )
}
