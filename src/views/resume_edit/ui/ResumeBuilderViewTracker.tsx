'use client'
import { useEffect, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import * as amplitude from '@amplitude/unified'
import { useProjectList } from '@entities/project'
import { useResumeCounts } from '@entities/resume'
import { useWorkspaceId } from '@entities/user'
import { AMPLITUDE_EVENTS } from '@shared/config'

/**
 * 빌더 진입 이벤트를 1회 보낸다.
 * 새 이력서는 생성 플로우가 붙인 `?create_method=`로 구분하고, 보낸 뒤 URL에서 지워 새로고침은 revisit으로 잡는다.
 * 재진입은 생성 방식·순번을 알 수 없어 null로 보낸다(resume_id로 new 이벤트와 조인).
 */
export const ResumeBuilderViewTracker = ({ resumeId }: { resumeId: string }) => {
  const router = useRouter()
  const workspaceId = useWorkspaceId()
  const createMethod = useSearchParams().get('create_method')
  const { projects } = useProjectList(workspaceId)
  const { counts } = useResumeCounts(workspaceId)

  const hasTrackedRef = useRef(false)
  useEffect(() => {
    if (hasTrackedRef.current) return
    hasTrackedRef.current = true

    const isNew = createMethod !== null
    amplitude.track(AMPLITUDE_EVENTS.RESUME_BUILDER_VIEWED, {
      resume_id: resumeId,
      create_method: createMethod,
      visit_type: isNew ? 'new' : 'revisit',
      resume_sequence: isNew ? Object.values(counts).reduce((sum, count) => sum + count, 0) : null,
      has_experience: projects.length > 0
    })
    if (isNew) router.replace(`/resumes/edit/${resumeId}`)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return null
}
