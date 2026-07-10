'use client'

import { useState } from 'react'
import { ArrowRightIcon } from 'lucide-react'
import { motion, AnimatePresence } from 'motion/react'
import { Flex } from '@radix-ui/themes'
import { cn } from '@shared/lib/cn'
import { SelectedControl, SelectedControlItem } from '@shared/ui/selected_control'
import { Text, Button } from '@shared/ui'
import { RadioGroup, RadioGroupItem } from '@shared/ui/radio_group'
import { toast } from 'sonner'

type AnalysisPhase = 'INPUT' | 'SELECT_POSITION'

export const JDAnalysisForm = () => {
  const [phase, setPhase] = useState<AnalysisPhase>('INPUT')

  // Todo: 실제 API 연동 시 분석 결과(직무 개수)에 따라 다음 phase 분기
  const notifyMock = () => {
    toast('UI 확인용으로만 구현되어 있어요. 실제 API 연동은 아직 진행되지 않았습니다.', {
      position: 'top-center'
    })
  }

  const handleAnalyze = () => {
    setPhase('SELECT_POSITION')
    notifyMock()
  }

  const handleGenerate = () => {
    setPhase('INPUT')
    notifyMock()
  }

  return (
    <div className="flex min-h-105 w-full justify-center">
      <AnimatePresence mode="wait">
        {phase === 'INPUT' && (
          <motion.div key="input" exit={{ opacity: 0 }} animate={{ opacity: 1 }} className={'w-full'}>
            <JDInputStep onSubmit={handleAnalyze} />
          </motion.div>
        )}

        {phase === 'SELECT_POSITION' && (
          <motion.div key="select" exit={{ opacity: 0 }} animate={{ opacity: 1 }} className={'w-full'}>
            <JDSelectStep onSubmit={handleGenerate} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

const JDInputStep = ({ onSubmit }: { onSubmit: () => void }) => {
  // Todo: 백엔드 스키마에 따라 이름 변경 고려
  const [inputType, setInputType] = useState<'url' | 'text'>('url')
  const [inputValue, setInputValue] = useState('')
  const placeholder = inputType === 'url' ? 'https:// 채용 공고 링크를 입력하세요' : '채용 공고 원문을 복사해 붙여넣어 주세요. 회사명, 직무 요건, 우대사항이 포함될수록 분석 정확도가 높아져요.'

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    onSubmit()
  }

  return (
    <form onSubmit={handleSubmit} className="flex w-full justify-center">
      <Flex direction={'column'} gap={'4'} p={'4'} className="border-border-subtler h-fit w-full max-w-215 rounded-2xl border">
        <SelectedControl value={inputType} onValueChange={(value) => setInputType(value as 'url' | 'text')} className="w-55">
          <SelectedControlItem value="url">URL 붙여넣기</SelectedControlItem>
          <SelectedControlItem value="text">원문 붙여넣기</SelectedControlItem>
        </SelectedControl>

        <textarea
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder={placeholder}
          className={cn(
            'field-sizing-content',
            'max-h-24 min-h-0 w-full',
            'text-body1 text-text-basic',
            'resize-none overflow-y-auto outline-none',
            'placeholder:text-body1 placeholder:text-text-subtler'
          )}
        />

        <button type={'submit'} aria-label="JD 분석" className="bg-btn-primary-fill ml-auto w-fit rounded-lg p-3.5 text-white">
          <ArrowRightIcon size={20} />
        </button>
      </Flex>
    </form>
  )
}

const JDSelectStep = ({ onSubmit }: { onSubmit: () => void }) => {
  // Todo: 백엔드 스키마에 따라 변경 예정
  const [position, setPosition] = useState<string | null>(null)

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    onSubmit()
  }

  return (
    <form onSubmit={handleSubmit} className="flex w-full justify-center">
      <Flex direction={'column'} justify={'center'} gap={'8'} p={'8'} className={'bg-bg-gray-subtler w-full max-w-157 rounded-2xl'}>
        <Text as={'p'} variant={'heading2'}>
          어떤 직무에 맞는 이력서를 작성해볼까요?
        </Text>

        <RadioGroup className={'max-h-51.5 overflow-y-auto'} value={position} onValueChange={setPosition}>
          <RadioGroupItem value="default" id="r1">
            <Text as={'label'} variant={'label1'} htmlFor="r1">
              Default
            </Text>
          </RadioGroupItem>
          <RadioGroupItem value="comfortable" id="r2">
            <Text as={'label'} variant={'label1'} htmlFor="r2">
              Comfortable
            </Text>
          </RadioGroupItem>
          <RadioGroupItem value="compact" id="r3">
            <Text as={'label'} variant={'label1'} htmlFor="r3">
              Compact
            </Text>
          </RadioGroupItem>
        </RadioGroup>

        <Button type={'submit'} size={'xl'} className={'w-full'}>
          이력서 생성하러 가기
        </Button>
      </Flex>
    </form>
  )
}
