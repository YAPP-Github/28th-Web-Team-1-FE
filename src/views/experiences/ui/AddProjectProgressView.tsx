'use client'
import { useEffect, useState } from 'react'
import { Check } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { Flex } from '@radix-ui/themes'
import { cn } from '@shared/lib/cn'
import { DialogTitle, DialogDescription } from '@shared/ui/dialog'

const STEPS = ['경험 불러오는 중', '핵심 내용 분석하는 중', 'STAR 구조로 정리 중']

const FAKE_PROGRESS_CEIL = 97
const FAKE_TICK_MS = 400
const FAKE_DECAY = 0.1
const FAKE_MAX_STEP = 4.4

interface AddProjectProgressViewProps {
  isComplete: boolean
  onCancel: () => void
}
export const AddProjectProgressView = ({ isComplete, onCancel }: AddProjectProgressViewProps) => {
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

  // 완료되면 실제 진행률과 무관하게 100%로 표시한다.
  const displayProgress = isComplete ? 100 : Math.round(progress)
  // 진행률을 단계 수로 나눠, 몫을 넘긴 단계까지 체크 처리한다. (100%에서 마지막 단계 체크)
  const completedSteps = Math.floor((displayProgress / 100) * STEPS.length)

  if (isSuccess) return <SuccessView />

  return (
    <Flex direction="column" align="center" className="gap-8 px-16 py-10">
      <ProgressRing value={displayProgress} />
      <Flex direction="column" align="center" className="gap-1">
        <DialogDescription className="text-body1 text-text-subtler">잠시만 기다려주세요!</DialogDescription>
        <DialogTitle className="text-title3 text-text-basic font-bold">경험을 가져오는 중이에요.</DialogTitle>
      </Flex>
      <Flex direction="column" className="gap-2">
        {STEPS.map((step, index) => {
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
      <button type="button" onClick={() => onCancel()} className="text-caption1 text-text-disabled-on hover:text-text-basic transition-colors">
        불러오기 취소
      </button>
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

const SuccessView = () => {
  return (
    <Flex direction="column" align="center" className="gap-10 py-10">
      <span className="bg-element-primary ring-element-primary-lighter flex size-15 items-center justify-center rounded-full ring-10">
        <Check size={33.75} className="text-icon-inverse" strokeWidth={2.81} />
      </span>
      <Flex direction="column" align="center" className="gap-1">
        <DialogDescription className="text-body1 text-text-subtler">정리된 경험을 확인하고 이력서에 활용해 보세요.</DialogDescription>
        <DialogTitle className="text-title3 text-text-basic font-bold">경험을 성공적으로 가져왔어요!</DialogTitle>
      </Flex>
    </Flex>
  )
}
