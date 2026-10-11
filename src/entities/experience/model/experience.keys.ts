import { infiniteQueryOptions, queryOptions } from '@tanstack/react-query'
import { experienceAPI } from '../api/experience.api'

/** 프로젝트 안에서 경험 목록을 조회할 때의 탭 파라미터. AI 추천 탭은 `questionRoomId`가 필수다. */
export type ProjectExperienceListParams = { jdId: string } & ({ tab: 'AI_RECOMMENDATION'; questionRoomId: string } | { tab: 'MANUAL' })

export const experienceKeys = {
  all: ['experience'] as const,
  lists: () => [...experienceKeys.all, 'list'] as const,
  list: (workspaceId: string) => [...experienceKeys.lists(), workspaceId] as const,
  matches: () => [...experienceKeys.all, 'matched'] as const,
  matched: (workspaceId: string, jdId: string) => [...experienceKeys.matches(), workspaceId, jdId] as const,
  listByProject: (workspaceId: string, projectId: string, params?: ProjectExperienceListParams) =>
    [...experienceKeys.lists(), workspaceId, 'project', projectId, params?.tab ?? null, params && 'questionRoomId' in params ? params.questionRoomId : null] as const,
  details: () => [...experienceKeys.all, 'detail'] as const,
  detail: (workspaceId: string, experienceId: string) => [...experienceKeys.details(), workspaceId, experienceId] as const,
  searches: () => [...experienceKeys.all, 'search'] as const,
  search: (workspaceId: string, keyword: string) => [...experienceKeys.searches(), workspaceId, keyword] as const,
  questionRooms: () => [...experienceKeys.all, 'question-room'] as const,
  questionRoomList: (workspaceId: string, jdId: string) => [...experienceKeys.questionRooms(), workspaceId, jdId] as const,
  questionRoomDetail: (workspaceId: string, questionRoomId: string) => [...experienceKeys.questionRooms(), workspaceId, questionRoomId] as const
}

export const experienceQueries = {
  /** 경험정리 메인 페이지의 경험 목록을 커서 기반으로 조회한다. */
  list: (workspaceId: string, size = 20) =>
    infiniteQueryOptions({
      queryKey: experienceKeys.list(workspaceId),
      queryFn: ({ pageParam }) => experienceAPI.getExperiences({ workspaceId, size, cursor: pageParam }),
      initialPageParam: null as string | null,
      getNextPageParam: (lastPage) => (lastPage.experiences.cursor.hasNext ? lastPage.experiences.cursor.nextCursor : null)
    }),

  /** JD 기준으로 매칭된 경험 목록을 조회한다. 각 경험에 matchRate와 상위 5개 recommendedReason이 채워진다. */
  matched: (workspaceId: string, jdId: string, size = 20) =>
    infiniteQueryOptions({
      queryKey: experienceKeys.matched(workspaceId, jdId),
      queryFn: ({ pageParam }) => experienceAPI.getMatchedExperiences({ workspaceId, jdId, size, cursor: pageParam }),
      initialPageParam: null as string | null,
      getNextPageParam: (lastPage) => (lastPage.experiences.cursor.hasNext ? lastPage.experiences.cursor.nextCursor : null)
    }),
  /** 경험 상세 페이지의 특정 프로젝트에 속한 경험 목록을 커서 기반으로 조회한다. 탭 파라미터를 주면 탭별로 조회한다. */
  listByProject: (workspaceId: string, projectId: string, params?: ProjectExperienceListParams) =>
    infiniteQueryOptions({
      queryKey: experienceKeys.listByProject(workspaceId, projectId, params),
      queryFn: ({ pageParam }) => experienceAPI.getProjectExperiences({ workspaceId, projectId, size: 20, cursor: pageParam, ...params }),
      initialPageParam: null as string | null,
      getNextPageParam: (lastPage) => (lastPage.experiences.cursor.hasNext ? lastPage.experiences.cursor.nextCursor : null)
    }),

  /** 경험 상세 패널에서 여는 경험 단건(제목·태그·STAR 상세)을 조회한다. */
  detail: (workspaceId: string, experienceId: string) =>
    queryOptions({
      queryKey: experienceKeys.detail(workspaceId, experienceId),
      queryFn: () => experienceAPI.getExperience({ workspaceId, experienceId })
    }),

  /** 키워드(경험 이름·태그)로 경험을 검색한다. 검색창 드롭다운용으로 상위 `size`개만 조회한다. */
  search: (workspaceId: string, keyword: string, size = 10) =>
    queryOptions({
      queryKey: experienceKeys.search(workspaceId, keyword),
      queryFn: () => experienceAPI.getSearchExperiences({ workspaceId, keyword, size })
    }),

  /**
   * JD별 경험 질문 카드 목록(0~5개)을 조회한다.
   * 최초 조회는 JD 기반 AI 생성이라 느릴 수 있으며, 이후에는 저장된 목록을 그대로 반환한다.
   */
  questionRooms: (workspaceId: string, jdId: string) =>
    queryOptions({
      queryKey: experienceKeys.questionRoomList(workspaceId, jdId),
      queryFn: () => experienceAPI.getExperienceQuestionRooms({ workspaceId, jdId })
    }),

  /** 경험 질문 대화방 단건(질문 카드)을 조회한다. 목록 카드의 questionRoomId로 상세 진입 시 사용한다. */
  questionRoom: (workspaceId: string, questionRoomId: string) =>
    queryOptions({
      queryKey: experienceKeys.questionRoomDetail(workspaceId, questionRoomId),
      queryFn: () => experienceAPI.getExperienceQuestionRoom({ workspaceId, questionRoomId })
    })
}
