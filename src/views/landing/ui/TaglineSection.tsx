'use client'
import { motion } from 'motion/react'
import { ScoopIcon } from '@shared/icon'

const EASE_EXPO_OUT = [0.16, 1, 0.3, 1] as const

export const TaglineSection = () => {
  return (
    <section className="flex flex-col gap-8 overflow-hidden bg-white pt-12 pb-14 sm:gap-30 sm:py-70">
      <motion.p
        className="text-primary-20 font-elms text-[25px] leading-[1.1] tracking-[-0.02em] min-[640px]:text-[40px] sm:text-[64px]"
        initial={{ opacity: 0, x: -40 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ duration: 1.25, ease: EASE_EXPO_OUT }}
      >
        Scoop Your Experience •••
      </motion.p>
      <motion.div
        className="flex items-center justify-end gap-2 sm:gap-4"
        initial={{ opacity: 0, x: 40 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ duration: 1.25, ease: EASE_EXPO_OUT, delay: 0.18 }}
      >
        <ScoopIcon size={240} className="text-primary-20 h-auto w-17 shrink-0 min-[640px]:w-36 sm:w-60" />
        <p className="text-primary-20 font-elms text-[25px] leading-[1.1] tracking-[-0.02em] min-[640px]:text-[40px] sm:text-[64px]">Scoop Your Career</p>
      </motion.div>
    </section>
  )
}
