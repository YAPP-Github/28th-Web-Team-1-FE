'use client'
import { useEffect, useState } from 'react'
import { Check } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { Flex } from '@radix-ui/themes'
import { cn } from '@shared/lib/cn'
import { DialogTitle, DialogDescription } from '@shared/ui/dialog'

const FAKE_PROGRESS_CEIL = 97
const FAKE_TICK_MS = 400
const FAKE_DECAY = 0.1
const FAKE_MAX_STEP = 4.4

interface ProcessingViewProps {
  isComplete: boolean
  steps: string[]
  title: string
  description: string
  successTitle: string
  successDescription: string
  onCancel?: () => void
}
/**
 * 진행률 링 + 단계 체크리스트 + 성공 화면으로 구성된 "AI 처리 중" 뷰이다.
 * `isComplete` 전까지 가짜 진행률을 채우고, 완료되면 100%를 거쳐 성공 화면으로 전환한다.
 *
 * ⚠️ **Dialog 의존성**: 내부에서 제목/설명을 `DialogTitle`·`DialogDescription`(Radix Dialog 프리미티브)으로 렌더하므로,
 * 반드시 `Dialog`(`Dialog.Root`) 컨텍스트 **안**에서 사용해야 한다. 컨텍스트 밖에서 렌더하면
 * `\`DialogTitle\` must be used within \`Dialog\`` 런타임 에러가 발생한다.
 *
 * @example 모달로 사용
 * ```tsx
 * <Dialog open={isOpen}>
 *   <DialogContent showCloseButton={false}>
 *     <ProcessingView isComplete={isDone} steps={STEPS} title="..." description="..." successTitle="..." successDescription="..." />
 *   </DialogContent>
 * </Dialog>
 * ```
 */
export const ProcessingView = ({ isComplete, steps, title, description, successTitle, successDescription, onCancel }: ProcessingViewProps) => {
  const [progress, setProgress] = useState(0)
  const [isSuccess, setIsSuccess] = useState(false)

  // 완료 신호 전까지 진행률을 상한선까지만 채우고, 실제 응답을 기다린다.
  useEffect(() => {
    if (isComplete) return
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= FAKE_PROGRESS_CEIL) return prev
        const remaining = FAKE_PROGRESS_CEIL - prev
        const step = Math.min(remaining * FAKE_DECAY, FAKE_MAX_STEP) * (0.7 + Math.random() * 0.6)
        return Math.min(prev + step, FAKE_PROGRESS_CEIL)
      })
    }, FAKE_TICK_MS)
    return () => clearInterval(timer)
  }, [isComplete])

  useEffect(() => {
    if (!isComplete) return
    // 완료되면 잠시 뒤 성공 화면으로 전환한다.
    const timer = setTimeout(() => setIsSuccess(true), 700)
    return () => clearTimeout(timer)
  }, [isComplete])

  useEffect(() => {
    if (!isSuccess || !onCancel) return
    // 성공 화면을 3초간 보여준 뒤 자동으로 닫는다.
    const timer = setTimeout(() => onCancel(), 3000)
    return () => clearTimeout(timer)
  }, [isSuccess, onCancel])

  // 완료되면 실제 진행률과 무관하게 100%로 표시한다.
  const displayProgress = isComplete ? 100 : Math.round(progress)
  // 진행률을 단계 수로 나눠, 몫을 넘긴 단계까지 체크 처리한다. (100%에서 마지막 단계 체크)
  const completedSteps = Math.floor((displayProgress / 100) * steps.length)

  if (isSuccess) return <SuccessView title={successTitle} description={successDescription} />

  return (
    <Flex direction="column" align="center" className="gap-8 px-16 py-10">
      <ProgressRing value={displayProgress} />
      <Flex direction="column" align="center" className="gap-1">
        <DialogDescription className="text-body1 text-text-subtler">{description}</DialogDescription>
        <DialogTitle className="text-title3 text-text-basic font-bold">{title}</DialogTitle>
      </Flex>
      <Flex direction="column" className="gap-2">
        {steps.map((step, index) => {
          const isChecked = index < completedSteps
          return (
            <Flex key={step} align="center" className="bg-element-gray-lighter gap-1.5 rounded-sm px-2.5 py-2">
              <span className={cn('flex size-4.5 shrink-0 items-center justify-center rounded-full transition-colors', isChecked ? 'bg-element-primary' : 'bg-element-gray-light')}>
                {isChecked && <Check size={10.12} className="text-white" strokeWidth={1.84} />}
              </span>
              <span className={cn('text-label1 font-semibold transition-colors', isChecked ? 'text-text-basic' : 'text-text-disabled-on')}>{step}</span>
            </Flex>
          )
        })}
      </Flex>
      {onCancel && (
        <button type="button" onClick={onCancel} className="text-caption1 text-text-disabled-on hover:text-text-basic transition-colors">
          취소
        </button>
      )}
    </Flex>
  )
}

const ProgressRing = ({ value }: { value: number }) => {
  const size = 110
  const stroke = 11
  const radius = (size - stroke) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference * (1 - value / 100)

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" strokeWidth={stroke} className="stroke-element-primary-lighter" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="stroke-element-primary transition-[stroke-dashoffset] duration-300 ease-linear"
        />
      </svg>
      <span className="text-title3 text-text-basic absolute inset-0 flex items-center justify-center font-bold">
        <RollingNumber value={value} />
      </span>
    </div>
  )
}

// 값이 바뀔 때 자릿수마다 위로 롤링되는 숫자 카운터
const RollingNumber = ({ value }: { value: number }) => {
  const chars = `${value}%`.split('')

  return (
    <span className="inline-flex tabular-nums">
      {chars.map((char, index) => {
        if (!/\d/.test(char)) {
          return (
            <span key={`static-${index}`} className="inline-block">
              {char}
            </span>
          )
        }
        return (
          <span key={`digit-${index}`} className="relative inline-block h-[1.2em] w-[0.62em] overflow-hidden">
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.span
                key={char}
                initial={{ y: '70%', opacity: 0 }}
                animate={{ y: '0%', opacity: 1 }}
                exit={{ y: '-70%', opacity: 0 }}
                transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
                className="absolute inset-0 flex items-center justify-center"
              >
                {char}
              </motion.span>
            </AnimatePresence>
          </span>
        )
      })}
    </span>
  )
}

const SuccessView = ({ title, description }: { title: string; description: string }) => {
  return (
    <Flex direction="column" align="center" className="gap-10 py-10">
      <motion.span
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 500, damping: 18, delay: 0.05 }}
        className="bg-element-primary ring-element-primary-lighter relative flex size-15 items-center justify-center rounded-full ring-10"
      >
        <motion.span
          initial={{ scale: 1, opacity: 0.6 }}
          animate={{ scale: 1.6, opacity: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut', delay: 0.15 }}
          className="bg-element-primary-lighter absolute inset-0 rounded-full"
        />
        <motion.span initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', stiffness: 600, damping: 20, delay: 0.22 }}>
          <Check size={33.75} className="text-icon-inverse" strokeWidth={2.81} />
        </motion.span>
      </motion.span>
      <Flex direction="column" align="center" className="gap-1">
        <DialogDescription className="text-body1 text-text-subtler">{description}</DialogDescription>
        <DialogTitle className="text-title3 text-text-basic font-bold">{title}</DialogTitle>
      </Flex>
    </Flex>
  )
}
