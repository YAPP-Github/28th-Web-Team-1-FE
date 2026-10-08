'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import * as amplitude from '@amplitude/unified'
import { AMPLITUDE_EVENTS } from '@shared/config'
import { useWorkspaceId } from '@entities/user'
import { useRegisterJd, type JdRegisterInput, type JdCandidate } from '@entities/jd'
import { useImportResume } from '@entities/resume'

type ResumeCreateChoice = { method: 'import'; file: File } | { method: 'scratch' }

// 식별된 유니온 기반 JD분석 플로우 타입
type Flow =
  | { step: 'INPUT' }
  | { step: 'SELECT_METHOD'; input: JdRegisterInput }
  | { step: 'PROCESSING'; choice: ResumeCreateChoice }
  | { step: 'SELECT_POSITION'; choice: ResumeCreateChoice; candidates: JdCandidate[] }

/**
 * JD 입력 → 이력서 생성 방식 선택 → (JD 분석 + PDF 추출, 로딩 한 번) → 이력서 화면 이동.
 * 분석 결과가 후보 목록이면 `flow.candidates`(SELECT_POSITION 단계)에 담기고, 후보를 `handleSelectPosition`으로 넘기면 고른 방식으로 바로 진행한다.
 * @example
 * ```tsx
 * const { flow, handleRegister, handleSelectPosition, handleReset, isPending, dialogProps } = useJdResumeFlow()
 * handleRegister({ sourceUrl })
 * <JdResumeFlowDialogs {...dialogProps} />
 * ```
 */
export const useJdResumeFlow = () => {
  const router = useRouter()
  const workspaceId = useWorkspaceId()
  const { mutate: registerJd, isPending } = useRegisterJd(workspaceId)
  const { mutate: importResume, isSuccess: isImportSuccess } = useImportResume(workspaceId)
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
        // 후보 목록 응답에서는 아직 jd_id가 없어 보내지 않는다.
        amplitude.track(AMPLITUDE_EVENTS.JD_URL_ENTERED, { jd_id: jd.jdId })

        if (choice.method === 'scratch') return router.push(`/resumes/create?jdId=${jd.jdId}`)
        importResume({ file: choice.file, targetJdId: jd.jdId }, { onSuccess: (res) => router.push(`/resumes/edit/${res.resumeId}`), onError: fail })
      },
      onError: fail
    })
  }

  return {
    flow,
    handleRegister: (input: JdRegisterInput) => setFlow({ step: 'SELECT_METHOD', input }),
    handleSelectPosition: (input: JdRegisterInput) => flow.step === 'SELECT_POSITION' && createResumeFromJd(input, flow.choice),
    handleReset: reset,
    isPending,
    dialogProps: {
      progress: { isOpen: flow.step === 'PROCESSING', isComplete: isImportSuccess },
      method: {
        isOpen: flow.step === 'SELECT_METHOD',
        onOpenChange: (open: boolean) => !open && reset(),
        onSelect: (choice: ResumeCreateChoice) => flow.step === 'SELECT_METHOD' && createResumeFromJd(flow.input, choice)
      }
    }
  }
}
