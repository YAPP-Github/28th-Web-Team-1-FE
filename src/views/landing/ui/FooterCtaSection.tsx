'use client'
import Link from 'next/link'
import { ArrowRight, Sparkle } from 'lucide-react'
import { motion } from 'motion/react'
import { Flex } from '@radix-ui/themes'
import { Button, Heading } from '@shared/ui'
import { useMobileBlockDialog } from '../lib/useMobileBlockDialog'
import { MobileBlockDialog } from './MobileBlockDialog'

export const FooterCtaSection = () => {
  const { isOpen, setIsOpen, handleClick } = useMobileBlockDialog()

  return (
    <section className="py-14 md:py-24">
      <Flex direction="row" align="center" justify="between" gap="8" className="bg-primary-50 relative mx-auto overflow-hidden rounded-sm p-4 md:rounded-4xl md:px-14 md:py-14">
        <Flex direction="column" className="relative z-10 min-w-0 flex-1 gap-0.5 text-left md:gap-2">
          <Heading variant="title2" color="text-bolder-inverse" className="md:text-title2 text-[13px] font-semibold break-keep">
            이력서 작성, 더 이상 혼자 고민하지 마세요
          </Heading>
          <span className="md:text-heading2 text-[9px] break-keep text-white">SCOOP이 채용공고에 맞는 맞춤 이력서를 5분 만에 만들어 드려요.</span>
          <Button
            asChild
            variant="secondary"
            size="icon-xl"
            className="text-text-basic md:text-headline1 mt-4 h-fit w-fit rounded-sm bg-white px-3 py-1.5 text-[8px] font-normal md:mt-8 md:gap-2 md:rounded-xl md:px-8 md:py-4 md:font-semibold"
          >
            <Link href="/login" onClick={handleClick}>
              이력서 만들기
              <ArrowRight data-icon="inline-end" className="text-icon-gray size-3 transition-transform duration-300 group-hover/button:translate-x-1 md:size-5" />
            </Link>
          </Button>
        </Flex>

        <div className="relative h-13.5 w-32.5 shrink-0 md:h-40.75 md:w-100">
          <div className="relative h-27 w-65 origin-top-left scale-50 md:h-40.75 md:w-100 md:scale-100">
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
        </div>
      </Flex>
      <MobileBlockDialog isOpen={isOpen} onOpenChange={setIsOpen} />
    </section>
  )
}
