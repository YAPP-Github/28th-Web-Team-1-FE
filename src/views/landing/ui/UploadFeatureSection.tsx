'use client'
import { Check, FilePlus2 } from 'lucide-react'
import { motion } from 'motion/react'
import uploadArrows from '../assets/upload-arrows.svg'
import { Flex } from '@radix-ui/themes'
import { cn } from '@shared/lib/cn'
import { NotionIcon } from '@/src/shared/icon'

const EASE_EXPO_OUT = [0.16, 1, 0.3, 1] as const

const RESUME_CARDS = [
  { label: '이력서 A', rotate: '-rotate-[20deg]', offsetY: 'top-4 sm:top-8', z: 'z-10' },
  { label: '이력서 B', rotate: '-rotate-[9deg]', offsetY: 'top-8 sm:top-16', z: 'z-20' },
  { label: '이력서 C', rotate: 'rotate-0', offsetY: 'top-0.5 sm:top-1', z: 'z-10' },
  { label: '이력서 D', rotate: 'rotate-[14deg]', offsetY: 'top-9 sm:top-18', z: 'z-20' },
  { label: '이력서 E', rotate: 'rotate-[24deg]', offsetY: 'top-0', z: 'z-10' }
]

export const UploadFeatureSection = () => {
  return (
    <section className="relative isolate bg-white pb-10 sm:pt-24 sm:pb-16">
      <div className="absolute top-0 bottom-0 left-1/2 -z-10 w-screen -translate-x-1/2 overflow-hidden" aria-hidden>
        <div className="bg-primary-30 absolute inset-x-0 top-20 h-260 rounded-t-[50%_150px] sm:top-80 sm:h-470 sm:rounded-full" />
      </div>

      <Flex direction="row" justify="center" className="mx-auto max-w-308.5 gap-2 px-4 sm:gap-8 sm:px-0">
        <motion.div
          className="border-primary-20 shadow-3 flex min-w-0 flex-1 flex-col gap-3 rounded-sm border bg-white p-2.5 sm:gap-5 sm:rounded-4xl sm:border-2 sm:p-9.5"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 1.05, ease: EASE_EXPO_OUT }}
        >
          <Flex align="center" className="gap-1.5 sm:gap-8">
            <div className="bg-primary-5 text-icon-gray flex size-6 shrink-0 items-center justify-center rounded-[6px] sm:size-20 sm:rounded-[23px]">
              <FilePlus2 size={32} className="size-3 sm:size-8" />
            </div>
            <h3 className="text-text-basic text-label1 sm:text-display3">pdf 업로드</h3>
          </Flex>
          <p className="text-text-subtle text-[10px] leading-[1.6] tracking-[-0.01em] sm:text-[24px]">
            이미 만들어둔 이력서를 등록해 두면, 기본 정보와 경력을 불러 와서 이력서 초안을 만들 때 활용해요.
          </p>
        </motion.div>
        <motion.div
          className="border-primary-20 shadow-3 flex min-w-0 flex-1 flex-col gap-3 rounded-sm border bg-white p-2.5 sm:gap-5 sm:rounded-4xl sm:border-2 sm:p-9.5"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 1.05, ease: EASE_EXPO_OUT, delay: 0.21 }}
        >
          <Flex align="center" className="gap-1.5 sm:gap-8">
            <div className="bg-primary-5 flex size-6 shrink-0 items-center justify-center rounded-[6px] sm:size-20 sm:rounded-[23px]">
              <NotionIcon className="size-3 sm:size-9" />
            </div>
            <h3 className="text-text-basic text-label1 sm:text-display3">노션 연동</h3>
          </Flex>
          <p className="text-text-subtle text-[10px] leading-[1.6] tracking-[-0.01em] sm:text-[24px]">Notion을 연결하면 정리해 둔 경험을 내 이력서에 맞는 형태로 만들어 드려요.</p>
        </motion.div>
      </Flex>

      <div className="relative mt-4 flex flex-col items-center sm:pt-32 sm:pb-24">
        <motion.img
          src={uploadArrows.src}
          alt=""
          className="relative block h-4 w-32 sm:mt-2 sm:h-15 sm:w-107"
          aria-hidden
          initial={{ opacity: 0, y: -8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.9, ease: EASE_EXPO_OUT }}
        />

        <div className="relative mx-auto h-44 w-full max-w-250 sm:mt-8 sm:h-80">
          {RESUME_CARDS.map((card, index) => (
            <motion.div
              key={card.label}
              className={cn('shadow-2 absolute h-34 w-28 scale-60 rounded-xl border border-white bg-white px-4 py-4 sm:h-65 sm:w-54 sm:scale-100', card.rotate, card.offsetY, card.z)}
              style={{ left: `${index * 14 + 8}%` }}
              initial={{ opacity: 0, y: 32, scale: 0.9 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.9, ease: EASE_EXPO_OUT, delay: 0.26 + index * 0.14 }}
            >
              <Flex align="center" justify="between">
                <div className="relative">
                  <span className="bg-primary-5 absolute inset-x-0 bottom-0.5 h-1.5 rounded-full sm:h-2.5" aria-hidden />
                  <p className="text-text-subtler relative text-[13px] leading-[1.35] font-bold tracking-[-0.02em] sm:text-[24px]">{card.label}</p>
                </div>
                <span className="bg-primary-10 size-4.5 shrink-0 rounded-full sm:size-7.5" aria-hidden />
              </Flex>
              <Flex direction="column" className="mt-4 gap-2.5 sm:mt-8 sm:gap-5">
                <div className="bg-primary-10 h-2 w-full rounded-full sm:h-3.5" />
                <div className="bg-primary-10 h-2 w-full rounded-full sm:h-3.5" />
                <div className="bg-primary-10 h-2 w-full rounded-full sm:h-3.5" />
                <div className="bg-primary-10 h-2 w-full rounded-full sm:h-3.5" />
              </Flex>
            </motion.div>
          ))}
        </div>

        <Flex align="center" className="relative gap-1.5 sm:mt-8 sm:gap-4" direction="column">
          <motion.div
            className="flex size-3.5 items-center justify-center rounded-full bg-white sm:size-10"
            initial={{ opacity: 0, scale: 0.4 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ type: 'spring', stiffness: 260, damping: 17, delay: 0.26 + RESUME_CARDS.length * 0.14 }}
          >
            <Check className="text-primary-30 size-2 sm:size-5.5" size={22} strokeWidth={4} />
          </motion.div>
          <motion.p
            className="sm:text-display2 text-label1 text-white"
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
