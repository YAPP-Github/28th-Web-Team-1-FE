'use client'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { motion } from 'motion/react'
import { Flex } from '@radix-ui/themes'
import { Button, Heading, Text } from '@shared/ui'
import { useMobileBlockDialog } from '../lib/useMobileBlockDialog'
import { PcOnlyDialog } from './PcOnlyDialog'

const EASE_EXPO_OUT = [0.16, 1, 0.3, 1] as const

export const HeroSection = () => {
  const { isOpen, setIsOpen, handleClick } = useMobileBlockDialog()

  return (
    <section className="relative mt-6 overflow-hidden rounded-lg pt-14 md:mt-10 md:rounded-[40px] md:pt-20">
      <Image src="/landing/background.webp" alt="" fill priority sizes="100vw" className="object-cover" />

      <Flex direction="column" align="center" className="relative mx-auto max-w-144.5 gap-3 px-4 text-center md:gap-6">
        <motion.img
          src="/landing/lading_logo.gif"
          alt="SCOOP"
          className="h-16 w-auto md:h-34"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: EASE_EXPO_OUT }}
        />
        <Flex direction="column" align="center" className="md:gpa-3 gap-1">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, ease: EASE_EXPO_OUT, delay: 0.21 }}>
            <Heading color="text-basic" className="text-headline2 md:text-title1 text-balance whitespace-pre-wrap">
              {`경험이 담긴 자료를 업로드하면, \n이력서를 떠먹여 드려요`}
            </Heading>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, ease: EASE_EXPO_OUT, delay: 0.39 }}>
            <Text color="text-subtle" className="md:text-heading2 block text-[9px] leading-normal whitespace-pre">
              {`Notion, PDF 등 경험이 담긴 자료를 업로드하면\nAI가 핵심 내용을 분석해 지원하는 채용공고에 맞는 이력서로 정리해 드려요.`}
            </Text>
          </motion.div>
        </Flex>
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, ease: EASE_EXPO_OUT, delay: 0.6 }}>
          <Button asChild size="icon-xl" className="text-caption2 md:text-headline1 h-fit w-fit gap-1 rounded-sm px-3 py-1.5 md:gap-2 md:rounded-xl md:px-8 md:py-4">
            <Link href="/login" onClick={handleClick}>
              무료로 시작하기
              <ArrowRight data-icon="inline-end" className="size-3 transition-transform duration-300 group-hover/button:translate-x-1 md:size-6" />
            </Link>
          </Button>
        </motion.div>
      </Flex>

      <motion.div
        className="relative mx-auto mt-8 w-160 max-w-full px-20 md:mt-12 md:px-0"
        initial={{ opacity: 0, y: 32, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 1.25, ease: EASE_EXPO_OUT, delay: 0.74 }}
      >
        <Image src="/landing/resume.webp" alt="SCOOP으로 생성한 이력서 미리보기" width={2924} height={4278} sizes="(min-width: 768px) 480px, 90vw" className="h-auto w-full" priority />
      </motion.div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-60 bg-linear-to-t from-white/60 to-white/0 md:h-120.25" aria-hidden />
      <PcOnlyDialog isOpen={isOpen} onOpenChange={setIsOpen} />
    </section>
  )
}
