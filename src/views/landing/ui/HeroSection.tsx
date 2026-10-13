'use client'
import { useGoogleLoginRedirect } from '@features/authenticate'
import Image from 'next/image'
import backgroundImage from '../assets/background.webp'
import landingLogo from '../assets/landing_logo.gif'
import resumeImage from '../assets/resume.webp'
import { ArrowRight } from 'lucide-react'
import { motion } from 'motion/react'
import { Flex } from '@radix-ui/themes'
import { Button, Heading, Text } from '@shared/ui'

const EASE_EXPO_OUT = [0.16, 1, 0.3, 1] as const

export const HeroSection = () => {
  const startLogin = useGoogleLoginRedirect()

  return (
    <section className="relative mt-6 overflow-hidden rounded-lg pt-14 sm:mt-10 sm:rounded-[40px] sm:pt-20">
      <Image src={backgroundImage} alt="" fill priority sizes="100vw" className="object-cover" />

      <Flex direction="column" align="center" className="relative mx-auto max-w-144.5 gap-3 px-4 text-center sm:gap-6">
        <motion.img
          src={landingLogo.src}
          alt="SCOOP"
          className="h-16 w-auto sm:h-34"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: EASE_EXPO_OUT }}
        />
        <Flex direction="column" align="center" className="sm:gpa-3 gap-1">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, ease: EASE_EXPO_OUT, delay: 0.21 }}>
            <Heading color="text-basic" className="text-headline2 sm:text-title1 text-balance whitespace-pre-wrap">
              {`경험이 담긴 자료를 업로드하면, \n이력서를 떠먹여 드려요`}
            </Heading>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, ease: EASE_EXPO_OUT, delay: 0.39 }}>
            <Text color="text-subtle" className="sm:text-heading2 block text-[10px] leading-normal font-medium whitespace-pre">
              {`Notion, PDF 등 경험이 담긴 자료를 업로드하면\nAI가 핵심 내용을 분석해 지원하는 채용공고에 맞는 이력서로 정리해 드려요.`}
            </Text>
          </motion.div>
        </Flex>
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, ease: EASE_EXPO_OUT, delay: 0.6 }}>
          <Button size="icon-xl" className="text-caption2 sm:text-headline1 h-fit w-fit gap-1 rounded-sm px-3 py-1.5 sm:gap-2 sm:rounded-xl sm:px-8 sm:py-4" onClick={() => startLogin()}>
            무료로 시작하기
            <ArrowRight data-icon="inline-end" className="size-3 transition-transform duration-300 group-hover/button:translate-x-1 sm:size-6" />
          </Button>
        </motion.div>
      </Flex>

      <motion.div
        className="relative mx-auto mt-8 w-160 max-w-full px-20 sm:mt-12 sm:px-0"
        initial={{ opacity: 0, y: 32, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 1.25, ease: EASE_EXPO_OUT, delay: 0.74 }}
      >
        <Image src={resumeImage} alt="SCOOP으로 생성한 이력서 미리보기" sizes="(min-width: 768px) 480px, 90vw" className="h-auto w-full" priority />
      </motion.div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-60 bg-linear-to-t from-white/60 to-white/0 sm:h-120.25" aria-hidden />
    </section>
  )
}
