'use client'
import { useEffect } from 'react'
import { useParams } from 'next/navigation'
import { useInfiniteQuery } from '@tanstack/react-query'
import { resumeQueries } from '@entities/resume'
import { useWorkspaceId } from '@entities/user'
import type { ResumeQuery } from '@shared/lib/gql/graphql'

import * as amplitude from '@amplitude/unified'
import { AMPLITUDE_EVENTS } from '@shared/config'

/**
 * 온보딩에서 수집한 프로필 정보(기본정보·학력·경력·수상·어학·자격증·스킬) 중 하나라도 채워진 채로 이력서가 시작됐는지.
 * CORE_SKILL·EXPERIENCE는 제외
 */
const isProfilePrefilled = (resume: ResumeQuery['resume']) => resume.sections.some((section) => section.type !== 'CORE_SKILL' && section.type !== 'EXPERIENCE' && section.items.length > 0)

/** 이력서 목록을 생성순(오름차순)으로 정렬했을 때 대상 이력서가 몇 번째인지 찾음 */
const getResumeSequence = (resumes: Array<{ resumeId: string; createdAt: string }>, resumeId: string) => {
  const index = [...resumes].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()).findIndex((resume) => resume.resumeId === resumeId)
  return index >= 0 ? index + 1 : null
}

/**
 * ResumeEditPage 진입 시 Amplitude `resume_draft_viewed` 이벤트 전송을 담당하는 훅.
 * `workspaceId`·`resumeId`는 각각 워크스페이스 컨텍스트와 라우트 파라미터(`app/(with_sidebar)/resumes/edit/[id]`)에서 직접 읽는다.
 * @example
 * ```tsx
 * useResumeDraftViewedTracking(resume)
 * ```
 */
export const useResumeDraftViewedTracking = (resume: ResumeQuery['resume']) => {
  const workspaceId = useWorkspaceId()
  const { id: resumeId } = useParams<{ id: string }>()

  // 찾는 resumeId가 나타날 때까지 페이지를 이어서 불러온다.
  const { data, fetchNextPage, hasNextPage, isFetching } = useInfiniteQuery(resumeQueries.list(workspaceId, null, 30))
  const resumes = data?.pages.flatMap((page) => page.resumes.resumes) ?? []
  const isFound = resumes.some((r) => r.resumeId === resumeId)

  useEffect(() => {
    if (!isFound && hasNextPage && !isFetching) fetchNextPage()
  }, [isFound, hasNextPage, isFetching, fetchNextPage])

  const resumeSequence = getResumeSequence(resumes, resumeId)

  useEffect(() => {
    if (resumeSequence === null) return
    amplitude.track(AMPLITUDE_EVENTS.RESUME_DRAFT_VIEWED, {
      jd_id: resume.targetJd?.jdId ?? null,
      prefilled: isProfilePrefilled(resume),
      resume_sequence: resumeSequence
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resumeSequence])
}
