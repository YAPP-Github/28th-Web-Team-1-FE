'use client'
import { useRef } from 'react'
import { Flex } from '@radix-ui/themes'
import { ProcessingView, Text } from '@shared/ui'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@shared/ui/dialog'

import type { useJdResumeFlow } from '../hooks/useJdResumeFlow'

/**
 * `useJdResumeFlow`의 모달 묶음. 이력서 생성 방식 모달 + JD 분석·PDF 추출 진행 모달.
 * @example
 * ```tsx
 * const { register, dialogProps } = useJdResumeFlow()
 * <JdResumeFlowDialogs {...dialogProps} />
 * ```
 */
export const JdResumeFlowDialogs = ({ method, progress }: ReturnType<typeof useJdResumeFlow>['dialogProps']) => {
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (file) method.onSelect({ method: 'import', file })
  }

  return (
    <>
      {/* 이력서 생성 방식 선택 모달*/}
      <Dialog open={method.isOpen} onOpenChange={method.onOpenChange}>
        <DialogContent aria-describedby={undefined} className="w-94.5 gap-10">
          <input ref={inputRef} type="file" accept=".pdf" className="hidden" onChange={handleFileChange} />
          <DialogHeader>
            <DialogTitle className="text-headline1 text-text-basic font-semibold">이력서 어떻게 만들까요?</DialogTitle>
          </DialogHeader>
          <Flex direction="column" gap="3">
            <MethodCard
              title="기존 내 이력서에서 추출하기"
              description={`파일을 업로드하면 AI가 분석하여\n채용 공고에 맞는 이력서를 생성합니다.`}
              thumbnail={<ResumeIcon />}
              onClick={() => inputRef.current?.click()}
            />
            <MethodCard
              title="처음부터 만들기"
              description={`빈 이력서에서 AI와 함께 채용 공고에 맞는\n경험을 선택하고 이력서를 만듭니다.`}
              thumbnail={<ResumePlusIcon />}
              onClick={() => method.onSelect({ method: 'scratch' })}
            />
          </Flex>
        </DialogContent>
      </Dialog>

      {/* 이력서 생성 프로그레스 모달*/}
      <Dialog open={progress.isOpen}>
        <DialogContent showCloseButton={false} className="w-150">
          <ProcessingView
            isComplete={progress.isComplete}
            steps={['채용 공고 읽는 중', '내 경험 분석 중', '지원 전략 생성 중']}
            title="채용공고를 분석하고 있어요"
            description="잠시만 기다려주세요"
            successTitle=""
            successDescription=""
          />
        </DialogContent>
      </Dialog>
    </>
  )
}

const MethodCard = ({ title, description, thumbnail, onClick }: { title: string; description: string; thumbnail: React.ReactNode; onClick: () => void }) => (
  <button type="button" onClick={onClick} className="bg-element-gray-lighter flex items-center justify-between gap-4 rounded-lg p-6 text-left">
    <Flex direction="column" gap="6px">
      <Text variant="headline2" weight="semibold" className="text-text-basic">
        {title}
      </Text>
      <Text variant="caption1" className="text-text-subtle break-keep whitespace-pre-line">
        {description}
      </Text>
    </Flex>
    {thumbnail}
  </button>
)

const ResumeIcon = () => (
  <span aria-hidden className="bg-element-gray-light relative h-15 w-12.5 shrink-0 overflow-clip rounded-[3.7px]">
    <span className="bg-primary-0 absolute top-3 left-1.5 h-1 w-6 rounded-full" />
    <span className="text-gray-95 absolute top-1.25 left-[7.64px] text-[8px] leading-[1.35] font-bold tracking-[-0.16px]">이력서</span>
    <span className="bg-primary-10 absolute top-1.75 left-9 size-2 rounded-full" />
    <span className="absolute top-5.5 left-[6.48px] flex flex-col gap-[5.55px]">
      {Array.from({ length: 4 }, (_, i) => (
        <span key={i} className="bg-primary-30 h-[3.24px] w-9.25 rounded-full" />
      ))}
    </span>
  </span>
)

const ResumePlusIcon = () => (
  <span aria-hidden className="bg-element-gray-light relative flex h-15 w-12.5 shrink-0 items-center justify-center rounded-[3.7px]">
    <span className="bg-gray-0 relative flex size-6.5 items-center justify-center rounded-full">
      <span className="bg-primary-30 absolute h-[2.8px] w-4.25 rounded-full" />
      <span className="bg-primary-30 absolute h-4.25 w-[2.8px] rounded-full" />
    </span>
  </span>
)
