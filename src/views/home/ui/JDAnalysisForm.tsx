'use client'

import { useState } from 'react'
import { ArrowRightIcon, ChevronLeft } from 'lucide-react'
import { motion, AnimatePresence } from 'motion/react'
import { Flex } from '@radix-ui/themes'
import { cn } from '@shared/lib/cn'
import { SelectedControl, SelectedControlItem } from '@shared/ui/selected_control'
import { Text, Button } from '@shared/ui'
import { RadioGroup, RadioGroupItem } from '@shared/ui/radio_group'
import { useWorkspaceId } from '@entities/user'
import { useRegisterJd, type JdRegisterInput, type JdCandidate } from '@entities/jd'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

type AnalysisPhase = 'INPUT' | 'SELECT_POSITION'

export const JDAnalysisForm = () => {
  const router = useRouter()
  const [phase, setPhase] = useState<AnalysisPhase>('INPUT')
  const [candidates, setCandidates] = useState<JdCandidate[]>([])

  const workspaceId = useWorkspaceId()
  const { mutate: registerJd, isPending } = useRegisterJd(workspaceId)

  const handleRegister = (request: JdRegisterInput) => {
    registerJd(request, {
      onSuccess: (res) => {
        if (res.jd) {
          router.push(`/home/resume/create?jdId=${res.jd.jdId}`)
        } else if (res.candidates?.length) {
          setCandidates(res.candidates)
          setPhase('SELECT_POSITION')
        } else {
          toast('분석 결과를 찾지 못했어요. 다른 공고로 시도해 주세요.', {
            position: 'top-center'
          })
        }
      },
      onError: (err) => {
        // Todo: graphQL 에러 처리 필요
        toast(err.message, {
          position: 'top-center'
        })
      }
    })
  }

  const handleReset = () => {
    setCandidates([])
    setPhase('INPUT')
  }

  return (
    <div className="flex min-h-105 w-full justify-center">
      <AnimatePresence mode="wait">
        {phase === 'INPUT' && (
          <motion.div key="input" exit={{ opacity: 0 }} animate={{ opacity: 1 }} className={'w-full'}>
            <JDInputStep onSubmit={handleRegister} isPending={isPending} />
          </motion.div>
        )}

        {phase === 'SELECT_POSITION' && (
          <motion.div key="select" exit={{ opacity: 0 }} animate={{ opacity: 1 }} className={'w-full'}>
            <JDSelectStep candidates={candidates} onSubmit={handleRegister} onBack={handleReset} isPending={isPending} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

const JDInputStep = ({ onSubmit, isPending }: { onSubmit: (request: JdRegisterInput) => void; isPending: boolean }) => {
  const [inputType, setInputType] = useState<'url' | 'text'>('url')
  const [inputValue, setInputValue] = useState('')
  const placeholder = inputType === 'url' ? 'https:// 채용 공고 링크를 입력하세요' : '채용 공고 원문을 복사해 붙여넣어 주세요. 회사명, 직무 요건, 우대사항이 포함될수록 분석 정확도가 높아져요.'

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!inputValue.trim() || isPending) return
    onSubmit(inputType === 'url' ? { sourceUrl: inputValue.trim() } : { body: inputValue.trim() })
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
        <Button variant={'primary'} size={'icon-lg'} type={'submit'} aria-label="JD 분석" disabled={isPending || !inputValue.trim()} className="ml-auto">
          <ArrowRightIcon size={20} />
        </Button>
      </Flex>
    </form>
  )
}

const JDSelectStep = ({ candidates, onSubmit, onBack, isPending }: { candidates: JdCandidate[]; onSubmit: (request: JdRegisterInput) => void; onBack: () => void; isPending: boolean }) => {
  const [selected, setSelected] = useState<string | null>(null)

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (selected === null || isPending) return
    onSubmit({ body: candidates[Number(selected)].body })
  }

  return (
    <form onSubmit={handleSubmit} className="flex w-full justify-center">
      <Flex direction={'column'} justify={'center'} gap={'8'} p={'8'} className={'bg-bg-gray-subtler w-full max-w-157 rounded-2xl'}>
        <Flex gap={'2'}>
          <button type={'button'} onClick={onBack} disabled={isPending}>
            <ChevronLeft size={24} />
          </button>
          <Text as={'p'} variant={'heading2'}>
            어떤 직무에 맞는 이력서를 작성해볼까요?
          </Text>
        </Flex>

        <RadioGroup className={'max-h-51.5 overflow-y-auto'} value={selected} onValueChange={setSelected}>
          {candidates.map((candidate, index) => (
            <RadioGroupItem key={index} value={String(index)} id={`candidate-${index}`}>
              <Text as={'label'} variant={'label1'} htmlFor={`candidate-${index}`}>
                {candidate.title}
              </Text>
            </RadioGroupItem>
          ))}
        </RadioGroup>

        <Button type={'submit'} size={'xl'} disabled={selected === null || isPending} fullWidth>
          이력서 생성하러 가기
        </Button>
      </Flex>
    </form>
  )
}
