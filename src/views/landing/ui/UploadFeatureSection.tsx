'use client'
import { Check, FilePlus2 } from 'lucide-react'
import { motion } from 'motion/react'
import { Flex } from '@radix-ui/themes'
import { cn } from '@shared/lib/cn'

const EASE_EXPO_OUT = [0.16, 1, 0.3, 1] as const

const RESUME_CARDS = [
  { label: '이력서 A', rotate: '-rotate-[20deg]', offsetY: 'top-4 md:top-8', z: 'z-10' },
  { label: '이력서 B', rotate: '-rotate-[9deg]', offsetY: 'top-8 md:top-16', z: 'z-20' },
  { label: '이력서 C', rotate: 'rotate-0', offsetY: 'top-0.5 md:top-1', z: 'z-10' },
  { label: '이력서 D', rotate: 'rotate-[14deg]', offsetY: 'top-9 md:top-18', z: 'z-20' },
  { label: '이력서 E', rotate: 'rotate-[24deg]', offsetY: 'top-0', z: 'z-10' }
]

export const UploadFeatureSection = () => {
  return (
    <section className="relative scroll-mt-20 overflow-hidden bg-white pt-16 pb-10 md:scroll-mt-26.5 md:pt-24 md:pb-16">
      <Flex direction={{ initial: 'column', md: 'row' }} justify="center" className="mx-auto max-w-308.5 gap-4 md:gap-8">
        <motion.div
          className="border-primary-20 shadow-3 flex min-w-0 flex-1 flex-col gap-3 rounded-3xl border-2 bg-white p-6 md:gap-5 md:rounded-4xl md:p-9.5"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 1.05, ease: EASE_EXPO_OUT }}
        >
          <Flex align="center" className="gap-4 md:gap-8">
            <div className="bg-primary-5 text-primary-50 flex size-14 shrink-0 items-center justify-center rounded-2xl md:size-20 md:rounded-[23px]">
              <FilePlus2 size={32} className="size-6 md:size-8" />
            </div>
            <h3 className="text-text-basic text-[22px] leading-[1.3] font-bold tracking-tight md:text-[36px]">pdf 업로드</h3>
          </Flex>
          <p className="text-text-subtle text-[15px] leading-[1.6] tracking-[-0.01em] md:text-[24px]">
            이미 만들어둔 이력서를 등록해 두면, 기본 정보와 경력을 불러 와서 이력서 초안을 만들 때 활용해요.
          </p>
        </motion.div>
        <motion.div
          className="border-primary-20 shadow-3 flex min-w-0 flex-1 flex-col gap-3 rounded-3xl border-2 bg-white p-6 md:gap-5 md:rounded-4xl md:p-9.5"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 1.05, ease: EASE_EXPO_OUT, delay: 0.21 }}
        >
          <Flex align="center" className="gap-4 md:gap-8">
            <div className="bg-primary-5 flex size-14 shrink-0 items-center justify-center rounded-2xl md:size-20 md:rounded-[23px]">
              <img src="/landing/notion-mark.png" alt="" className="h-6 w-auto md:h-9" />
            </div>
            <h3 className="text-text-basic text-[22px] leading-[1.3] font-bold tracking-tight md:text-[36px]">노션 연동</h3>
          </Flex>
          <p className="text-text-subtle text-[15px] leading-[1.6] tracking-[-0.01em] md:text-[24px]">Notion을 연결하면 정리해 둔 경험을 내 이력서에 맞는 형태로 만들어 드려요.</p>
        </motion.div>
      </Flex>

      <div className="relative mt-4 flex flex-col items-center overflow-hidden pt-16 pb-16 md:pt-32 md:pb-24">
        <div className="bg-primary-30 absolute top-0 left-1/2 h-200 w-[160%] max-w-400 -translate-x-1/2 rounded-full sm:h-260 md:h-350" aria-hidden />

        <motion.img
          src="/landing/upload-arrows.svg"
          alt=""
          className="relative mt-2 block h-8 w-56 sm:h-11 sm:w-80 md:h-15 md:w-107"
          aria-hidden
          initial={{ opacity: 0, y: -8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.9, ease: EASE_EXPO_OUT }}
        />

        <div className="relative mx-auto mt-6 h-44 w-full max-w-250 sm:h-56 md:mt-8 md:h-80">
          {RESUME_CARDS.map((card, index) => (
            <motion.div
              key={card.label}
              className={cn(
                'shadow-2 absolute h-34 w-28 rounded-xl border border-white bg-white px-4 py-4 sm:h-44 sm:w-36 sm:rounded-2xl sm:px-6.5 sm:py-6 md:h-65 md:w-54',
                card.rotate,
                card.offsetY,
                card.z
              )}
              style={{ left: `${index * 18}%` }}
              initial={{ opacity: 0, y: 32, scale: 0.9 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.9, ease: EASE_EXPO_OUT, delay: 0.26 + index * 0.14 }}
            >
              <Flex align="center" justify="between">
                <div className="relative">
                  <span className="bg-primary-5 absolute inset-x-0 bottom-0.5 h-1.5 rounded-full md:h-2.5" aria-hidden />
                  <p className="text-text-subtler relative text-[13px] leading-[1.35] font-bold tracking-[-0.02em] md:text-[24px]">{card.label}</p>
                </div>
                <span className="bg-primary-10 size-4.5 shrink-0 rounded-full md:size-7.5" aria-hidden />
              </Flex>
              <Flex direction="column" className="mt-4 gap-2.5 md:mt-8 md:gap-5">
                <div className="bg-primary-10 h-2 w-full rounded-full md:h-3.5" />
                <div className="bg-primary-10 h-2 w-full rounded-full md:h-3.5" />
                <div className="bg-primary-10 h-2 w-full rounded-full md:h-3.5" />
                <div className="bg-primary-10 h-2 w-full rounded-full md:h-3.5" />
              </Flex>
            </motion.div>
          ))}
        </div>

        <Flex align="center" className="relative mt-6 gap-3 md:mt-8 md:gap-4" direction="column">
          <motion.div
            className="flex size-8 items-center justify-center rounded-full bg-white md:size-10"
            initial={{ opacity: 0, scale: 0.4 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ type: 'spring', stiffness: 260, damping: 17, delay: 0.26 + RESUME_CARDS.length * 0.14 }}
          >
            <Check className="text-primary-50 size-4.5 md:size-5.5" size={22} />
          </motion.div>
          <motion.p
            className="text-[22px] leading-[1.3] font-bold tracking-tight text-white md:text-[40px]"
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.9, ease: EASE_EXPO_OUT, delay: 0.44 + RESUME_CARDS.length * 0.14 }}
          >
            이력서 자동 생성 완료
          </motion.p>
        </Flex>
      </div>
    </section>
  )
}
