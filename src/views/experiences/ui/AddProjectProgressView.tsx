'use client'
import { useEffect, useState } from 'react'
import { Check } from 'lucide-react'
import { Flex } from '@radix-ui/themes'
import { cn } from '@shared/lib/cn'
import { DialogTitle, DialogDescription } from '@shared/ui/dialog'

const STEPS = ['경험 불러오는 중', '핵심 내용 분석하는 중', 'STAR 구조로 정리 중']

// 백엔드 완료 신호가 오기 전까지 프론트에서 임의로 채우는 진행률 상한
const FAKE_PROGRESS_CEIL = 90
const FAKE_STEP_MIN = 2
const FAKE_STEP_RANGE = 8

interface AddProjectProgressViewProps {
  /** 백엔드 완료 신호. true가 되면 100%로 채운 뒤 성공 화면으로 전환한다. */
  isComplete: boolean
  onCancel: () => void
}

export const AddProjectProgressView = ({ isComplete, onCancel }: AddProjectProgressViewProps) => {
  const [progress, setProgress] = useState(0)
  const [isSuccess, setIsSuccess] = useState(false)

  // 완료 신호 전까지 진행률을 상한선까지 임의로 채운다.
  useEffect(() => {
    if (isComplete) return
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= FAKE_PROGRESS_CEIL) return prev
        const next = prev + Math.random() * FAKE_STEP_RANGE + FAKE_STEP_MIN
        return Math.min(next, FAKE_PROGRESS_CEIL)
      })
    }, 400)
    return () => clearInterval(timer)
  }, [isComplete])

  // 백엔드 완료 → 100%를 채운 뒤 성공 화면으로 전환한다.
  // TODO : 실제로는 백엔드 단건 조회(polling)로 완료 여부를 받도록 교체. 지금은 임의 타이머로 완료 처리한다.
  useEffect(() => {
    if (!isComplete) return
    const timer = setTimeout(() => setIsSuccess(true), 700)
    return () => clearTimeout(timer)
  }, [isComplete])

  if (isSuccess) return <SuccessView />

  // 완료 신호가 오면 실제 진행률과 무관하게 100%로 표시한다.
  const displayProgress = isComplete ? 100 : Math.round(progress)
  // 진행률을 단계 수로 나눠, 몫을 넘긴 단계까지 체크 처리한다. (100%에서 마지막 단계 체크)
  const completedSteps = Math.floor((displayProgress / 100) * STEPS.length)

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
          className="stroke-element-primary transition-[stroke-dashoffset] duration-500 ease-out"
        />
      </svg>
      <span className="text-title3 text-text-basic absolute inset-0 flex items-center justify-center font-bold">{value}%</span>
    </div>
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
