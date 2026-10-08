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

/**
 * JD 입력 → 이력서 생성 방식 선택 → (JD 분석 + PDF 추출, 로딩 한 번) → 이력서 화면 이동.
 * 분석 결과가 후보 목록이면 `candidates`에 담기고, 후보로 다시 `register`하면 고른 방식으로 바로 진행한다.
 * @example
 * ```tsx
 * const { register, reset, candidates, isPending, dialogProps } = useJdResumeFlow()
 * register({ sourceUrl })
 * <JdResumeFlowDialogs {...dialogProps} />
 * ```
 */
export const useJdResumeFlow = () => {
  const router = useRouter()
  const workspaceId = useWorkspaceId()
  const { mutate: registerJd, isPending } = useRegisterJd(workspaceId)
  const { mutate: importResume, isSuccess: isImportSuccess } = useImportResume(workspaceId)

  // 방식 선택을 기다리는 JD 입력. 있으면 방식 모달이 열린다.
  const [input, setInput] = useState<JdRegisterInput | null>(null)
  const [candidates, setCandidates] = useState<JdCandidate[]>([])
  // 진행 모달. 방식 선택부터 화면 이동까지 한 번만 띄운다.
  const [isWaiting, setIsWaiting] = useState(false)
  // 후보 재등록 때 방식을 다시 묻지 않으려고 기억한다.
  const [choice, setChoice] = useState<ResumeCreateChoice | null>(null)

  const stop = () => {
    setChoice(null)
    setInput(null)
    setIsWaiting(false)
  }

  const run = (next: JdRegisterInput, chosen: ResumeCreateChoice) => {
    setChoice(chosen)
    setIsWaiting(true)
    registerJd(next, {
      onSuccess: ({ jd, candidates }) => {
        if (!jd) {
          if (!candidates?.length) return stop()
          setIsWaiting(false)
          return setCandidates(candidates)
        }
        // 후보 목록 응답에서는 아직 jd_id가 없어 보내지 않는다.
        amplitude.track(AMPLITUDE_EVENTS.JD_URL_ENTERED, { jd_id: jd.jdId })

        if (chosen.method === 'scratch') return router.push(`/resumes/create?jdId=${jd.jdId}`)

        importResume(
          { file: chosen.file, targetJdId: jd.jdId },
          {
            onSuccess: (res) => router.push(`/resumes/edit/${res.resumeId}`),
            onError: (error) => {
              toast.error(error.message, { position: 'top-center' })
              stop()
            }
          }
        )
      },
      onError: (error) => {
        toast.error(error.message, { position: 'top-center' })
        stop()
      }
    })
  }

  const choose = (chosen: ResumeCreateChoice) => {
    if (!input) return
    setInput(null)
    run(input, chosen)
  }

  return {
    register: (next: JdRegisterInput) => (choice ? run(next, choice) : setInput(next)),
    // 후보 선택에서 뒤로 가기: 고른 방식까지 버린다.
    reset: () => {
      stop()
      setCandidates([])
    },
    candidates,
    isPending,
    dialogProps: {
      progress: { isOpen: isWaiting, isComplete: isImportSuccess },
      method: {
        isOpen: input !== null,
        onOpenChange: (open: boolean) => !open && stop(),
        onSelect: choose
      }
    }
  }
}
