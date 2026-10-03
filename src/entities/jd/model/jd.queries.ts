'use client'
import { useSuspenseQuery } from '@tanstack/react-query'
import { type JdRecommendationTag } from '@shared/lib/gql/graphql'
import { jdQueries } from './jd.keys'

/**
 * 등록된 JD의 분석 인사이트(핵심/지원 전략)를 Suspense로 조회한다.
 * 로딩은 상위 `Suspense`, 실패는 상위 `ErrorBoundary`가 처리한다.
 * @param workspaceId 라우트 `[workspaceId]`에서 온 워크스페이스 ID
 * @param jdId `registerJd` 결과로 받은 JD ID(`?jdId=`)
 * @example
 * ```tsx
 * const { insight } = useJdInsight(workspaceId, jdId)
 * insight?.keyPoints // 핵심
 * insight?.strategy  // 지원 전략
 * ```
 */
export const useJdInsight = (workspaceId: string, jdId: string) => {
  const { data, ...rest } = useSuspenseQuery({
    ...jdQueries.insight(workspaceId, jdId),
    select: (data) => data.jdInsight
  })
  return { insight: data, ...rest }
}

/**
 * 등록된 JD의 기본 메타(기업명/포지션)를 Suspense로 조회한다.
 * 로딩은 상위 `Suspense`, 실패는 상위 `ErrorBoundary`가 처리한다.
 * @param workspaceId 라우트 `[workspaceId]`에서 온 워크스페이스 ID
 * @param jdId `registerJd` 결과로 받은 JD ID(`?jdId=`)
 * @example
 * ```tsx
 * const { jd } = useJdMeta(workspaceId, jdId)
 * jd?.companyName    // 기업명
 * jd?.positionTitle  // 포지션
 * ```
 */
export const useJdMeta = (workspaceId: string, jdId: string) => {
  const { data, ...rest } = useSuspenseQuery({
    ...jdQueries.meta(workspaceId, jdId),
    select: (data) => data.jd
  })
  return { jd: data, ...rest }
}

/**
 * JD 원문 상세(팀 소개/업무내용/자격요건/우대경험/전형 절차)를 Suspense로 조회한다.
 * 로딩은 상위 `Suspense`, 실패는 상위 `ErrorBoundary`가 처리한다.
 * @param workspaceId 라우트 `[workspaceId]`에서 온 워크스페이스 ID
 * @param jdId 이력서가 맞춤 대상으로 삼은 JD ID(`resume.targetJd.jdId`)
 * @example
 * ```tsx
 * const { jd } = useJdDetail(workspaceId, jdId)
 * jd?.responsibilities   // 업무내용
 * jd?.requiredExperiences // 자격요건
 * ```
 */
export const useJdDetail = (workspaceId: string, jdId: string) => {
  const { data, ...rest } = useSuspenseQuery({
    ...jdQueries.detail(workspaceId, jdId),
    select: (data) => data.jd
  })
  return { jd: data, ...rest }
}

/**
 * 추천 공고 태그 목록(태그 코드 + 화면 표시명)을 Suspense로 조회한다.
 * 로딩은 상위 `Suspense`, 실패는 상위 `ErrorBoundary`가 처리한다.
 * @example
 * ```tsx
 * const { tags } = useJdRecommendationTags()
 * tags[0] // { tag: 'POPULAR', name: '인기 공고' }
 * ```
 */
export const useJdRecommendationTags = () => {
  const { data, ...rest } = useSuspenseQuery({
    ...jdQueries.recommendationTags(),
    select: (data) => data.jdRecommendationTags
  })
  return { tags: data, ...rest }
}

/**
 * 추천 공고 목록을 Suspense로 조회한다. `tags`가 비면 전체, 여러 개면 모두 포함한 공고만 온다.
 * 로딩은 상위 `Suspense`, 실패는 상위 `ErrorBoundary`가 처리한다.
 * @param tags 필터할 추천 태그 목록
 * @param size 조회 개수 (서버 최대 30)
 * @example
 * ```tsx
 * const { recommendations } = useJdRecommendations(['POPULAR'], 6)
 * ```
 */
export const useJdRecommendations = (tags: JdRecommendationTag[], size: number) => {
  const { data, ...rest } = useSuspenseQuery({
    ...jdQueries.recommendations(tags, size),
    select: (data) => data.jdRecommendations.recommendations
  })
  return { recommendations: data, ...rest }
}
