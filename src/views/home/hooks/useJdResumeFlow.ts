'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import * as amplitude from '@amplitude/unified'
import { AMPLITUDE_EVENTS } from '@shared/config'
import { useMe, useWorkspaceId } from '@entities/user'
import { useRegisterJd, type JdRegisterInput, type JdCandidate } from '@entities/jd'
import { useCreateResume, useImportResume } from '@entities/resume'
import { buildResumeInput } from '../model/buildResumeInput'

type ResumeCreateChoice = { method: 'import'; file: File } | { method: 'scratch' }

// 식별된 유니온 기반 JD분석 플로우 타입
type Flow =
  | { step: 'INPUT' }
  | { step: 'SELECT_METHOD'; input: JdRegisterInput }
  | { step: 'PROCESSING'; choice: ResumeCreateChoice }
  | { step: 'SELECT_POSITION'; choice: ResumeCreateChoice; candidates: JdCandidate[] }

/**
 * JD 입력 → 이력서 생성 방식 선택 → (JD 분석 + PDF 추출, 로딩 한 번) → 이력서 화면 이동.
 * Amplitude 이벤트를 `entrySource`와 함께 보낸다.
 * 분석 결과가 후보 목록이면 `flow.candidates`(SELECT_POSITION 단계)에 담기고, 후보를 `handleSelectPosition`으로 넘기면 고른 방식으로 바로 진행한다.
 * @example
 * ```tsx
 * const { flow, handleRegister, handleSelectPosition, handleReset, isPending, dialogProps } = useJdResumeFlow('home_input')
 * handleRegister({ sourceUrl })
 * <JdResumeFlowDialogs {...dialogProps} />
 * ```
 */
export const useJdResumeFlow = (entrySource: 'home_input' | 'recommended_posting') => {
  const router = useRouter()
  const workspaceId = useWorkspaceId()
  const { me } = useMe()
  const { mutate: registerJd } = useRegisterJd(workspaceId)
  const { mutate: importResume, isSuccess: isImportSuccess } = useImportResume(workspaceId)
  const { mutate: createResume, isSuccess: isCreateSuccess } = useCreateResume(workspaceId)

  const [flow, setFlow] = useState<Flow>({ step: 'INPUT' })

  const reset = () => setFlow({ step: 'INPUT' })

  const fail = (error: Error) => {
    toast.error(error.message, { position: 'top-center' })
    reset()
  }

  const createResumeFromJd = (input: JdRegisterInput, choice: ResumeCreateChoice) => {
    setFlow({ step: 'PROCESSING', choice })
    registerJd(input, {
      onSuccess: ({ jd, candidates }) => {
        if (!jd) return setFlow(candidates?.length ? { step: 'SELECT_POSITION', choice, candidates } : { step: 'INPUT' })
        amplitude.track(AMPLITUDE_EVENTS.JD_URL_ENTERED, { jd_id: jd.jdId })

        const onCreated = ({ resumeId }: { resumeId: string }) => {
          const createMethod = choice.method === 'import' ? 'import_pdf' : 'from_scratch'
          amplitude.track(AMPLITUDE_EVENTS.RESUME_CREATE_METHOD_SELECTED, { resume_id: resumeId, create_method: createMethod })
          // 빌더가 새 이력서 진입(visit_type: new)임을 알 수 있도록 생성 방식을 실어 보낸다.
          router.push(`/resumes/edit/${resumeId}?create_method=${createMethod}`)
        }

        // 기존 내 이력서에서 추출하기
        if (choice.method === 'import') return importResume({ file: choice.file, targetJdId: jd.jdId }, { onSuccess: onCreated, onError: fail })
        // 처음부터 만들기
        else if (choice.method === 'scratch') return createResume(buildResumeInput(jd.jdId, me), { onSuccess: onCreated, onError: fail })
      },
      onError: fail
    })
  }

  return {
    flow,
    handleRegister: (input: JdRegisterInput) => {
      amplitude.track(AMPLITUDE_EVENTS.RESUME_CREATE_METHOD_VIEWED, { entry_source: entrySource })
      setFlow({ step: 'SELECT_METHOD', input })
    },
    handleSelectPosition: (input: JdRegisterInput) => flow.step === 'SELECT_POSITION' && createResumeFromJd(input, flow.choice),
    handleReset: reset,
    isPending: flow.step === 'PROCESSING',
    dialogProps: {
      progress: { isOpen: flow.step === 'PROCESSING', isComplete: isImportSuccess || isCreateSuccess },
      method: {
        isOpen: flow.step === 'SELECT_METHOD',
        onOpenChange: (open: boolean) => !open && reset(),
        onSelect: (choice: ResumeCreateChoice) => {
          if (flow.step !== 'SELECT_METHOD') return
          createResumeFromJd(flow.input, choice)
        }
      }
    }
  }
}
