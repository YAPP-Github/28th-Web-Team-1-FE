'use client'
import { useSuspenseInfiniteQuery, useSuspenseQuery, keepPreviousData, useQuery } from '@tanstack/react-query'
import { experienceQueries, type ProjectExperienceListParams } from './experience.keys'

/**
 * 특정 프로젝트에 속한 경험 목록을 Suspense로 조회한다. (경험 상세 페이지 "경험 목록")
 * AI 추천 탭이면 `params`에 `{ tab: 'AI_RECOMMENDATION', jdId, questionRoomId }`, 직접 작성 탭이면 `{ tab: 'MANUAL', jdId }`를 넘긴다.
 * @param workspaceId 라우트에서 확정된 워크스페이스 ID
 * @param projectId 라우트 `[id]`에서 온 프로젝트 ID
 * @param params 탭별 조회 파라미터(없으면 탭 구분 없이 전체 조회)
 * @example
 * ```tsx
 * const { experiences } = useProjectExperiences(workspaceId, projectId)
 * ```
 */
export const useProjectExperiences = (workspaceId: string, projectId: string, params?: ProjectExperienceListParams) => {
  const { data, ...rest } = useSuspenseInfiniteQuery({
    ...experienceQueries.listByProject(workspaceId, projectId, params),
    select: (data) => data.pages.flatMap((page) => page.experiences.experiences)
  })
  return { experiences: data, ...rest }
}

/**
 * 경험 단건(제목·태그·STAR 상세)을 비-Suspense로 조회한다. 상세 패널이 열릴 때만 호출된다.
 * @param workspaceId 라우트에서 확정된 워크스페이스 ID
 * @param experienceId 선택된 경험 ID (없으면 요청하지 않음)
 * @example
 * ```tsx
 * const { experience, isPending } = useExperience(workspaceId, experienceId)
 * ```
 */
/**
 * 경험 단건(제목·태그·역할·기간·STAR 상세)을 Suspense로 조회한다.
 * 데이터가 도착할 때까지 상위 Suspense 경계가 fallback을 보여주므로 첫 렌더부터 값이 보장된다.
 * (상세 패널이 한 번 조회해 헤더·수정·STAR 에디터에 내려주는 용도)
 * @param workspaceId 라우트에서 확정된 워크스페이스 ID
 * @param experienceId 조회할 경험 ID
 * @example
 * ```tsx
 * const { experience } = useExperienceSuspense(workspaceId, experienceId)
 * ```
 */
export const useExperienceSuspense = (workspaceId: string, experienceId: string) => {
  const { data, ...rest } = useSuspenseQuery(experienceQueries.detail(workspaceId, experienceId))
  return { experience: data.experience, ...rest }
}

/**
 * 키워드로 경험을 검색한다. 키워드가 비어 있으면 요청하지 않는다.
 * 타이핑 중 깜빡임을 줄이려 이전 결과를 유지한다.
 * @param workspaceId 라우트 `[workspaceId]`에서 온 워크스페이스 ID
 * @param keyword 검색어(호출부에서 디바운스한 값을 넘기는 것을 권장)
 * @example
 * ```tsx
 * const { results } = useSearchExperiences(workspaceId, useDebounce(keyword, 300))
 * ```
 */
export const useSearchExperiences = (workspaceId: string, keyword: string) => {
  const trimmed = keyword.trim()

  const { data, ...rest } = useQuery({
    ...experienceQueries.search(workspaceId, trimmed),
    enabled: Boolean(workspaceId) && trimmed.length > 0,
    placeholderData: keepPreviousData,
    select: (data) => data.searchExperiences.experiences
  })
  return { results: data ?? [], ...rest }
}

export const useExperienceList = (workspaceId: string) => {
  const { data, ...rest } = useSuspenseInfiniteQuery({
    ...experienceQueries.list(workspaceId),
    select: (data) => data.pages.flatMap((page) => page.experiences.experiences)
  })
  return { experiences: data, ...rest }
}

/**
 * JD 기준으로 매칭된 경험 목록을 Suspense로 조회한다.
 * 각 경험에 해당 JD 기준 matchRate와 상위 5개의 recommendedReason이 함께 채워진다.
 * @param workspaceId 라우트 `[workspaceId]`에서 온 워크스페이스 ID
 * @param jdId 매칭 기준이 될 JD ID
 */
export const useMatchedExperiences = (workspaceId: string, jdId: string) => {
  const { data, ...rest } = useSuspenseInfiniteQuery({
    ...experienceQueries.matched(workspaceId, jdId),
    select: (data) => data.pages.flatMap((page) => page.experiences.experiences)
  })
  return { experiences: data, ...rest }
}

/**
 * JD별 경험 질문 카드 목록(0~5개)을 조회한다.
 * 최초 조회는 JD 기반 AI 생성이라 느릴 수 있고, 이후에는 저장된 목록이 반환된다.
 * useSuspenseQuery는 enabled를 지원하지 않으므로 JD가 없으면 이 훅을 호출하지 말고 호출부에서 빈 상태를 렌더한다.
 * AI가 질문을 만들지 못하면 빈 배열이므로 로딩·빈 상태를 호출부에서 처리한다.
 * @param workspaceId 라우트 `[workspaceId]`에서 온 워크스페이스 ID
 * @param jdId 질문을 만들 기준이 될 JD ID
 * @example
 * ```tsx
 * const { questionRooms } = useExperienceQuestionRooms(workspaceId, jdId)
 * ```
 */
export const useExperienceQuestionRooms = (workspaceId: string, jdId: string) => {
  const { data, ...rest } = useSuspenseQuery({
    ...experienceQueries.questionRooms(workspaceId, jdId)
  })
  return { questionRooms: data?.experienceQuestionRooms ?? [], ...rest }
}

/**
 * 경험 질문 대화방 단건(질문 카드 + 전체 메시지)을 Suspense로 조회한다.
 * useSuspenseQuery는 enabled를 지원하지 않으므로 questionRoomId가 있을 때만 이 훅을 호출해야 한다.
 * @param workspaceId 라우트 `[workspaceId]`에서 온 워크스페이스 ID
 * @param questionRoomId 조회할 질문 대화방 ID (`experienceQuestionRooms`의 questionRoomId)
 * @example
 * ```tsx
 * const { room, messages } = useExperienceQuestionRoom(workspaceId, questionRoomId)
 * ```
 */
export const useExperienceQuestionRoom = (workspaceId: string, questionRoomId: string) => {
  const { data, ...rest } = useSuspenseQuery({
    ...experienceQueries.questionRoom(workspaceId, questionRoomId)
  })
  return { room: data?.experienceQuestionRoom.room, messages: data?.experienceQuestionRoom.messages ?? [], ...rest }
}
