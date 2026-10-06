import { queryOptions } from '@tanstack/react-query'
import { type JdRecommendationTag } from '@shared/lib/gql/graphql'
import { jdAPI } from '../api/jd.api'

export const jdKeys = {
  all: ['jd'] as const,
  insight: (workspaceId: string, jdId: string) => [...jdKeys.all, 'insight', workspaceId, jdId] as const,
  meta: (workspaceId: string, jdId: string) => [...jdKeys.all, 'meta', workspaceId, jdId] as const,
  detail: (workspaceId: string, jdId: string) => [...jdKeys.all, 'detail', workspaceId, jdId] as const,
  recommendationTags: () => [...jdKeys.all, 'recommendationTags'] as const,
  recommendations: (tags: JdRecommendationTag[], size: number) => [...jdKeys.all, 'recommendations', tags, size] as const
}

/**
 * jd 도메인의 queryOptions 팩토리이다.
 * 키(`jdKeys`)와 짝을 이루며, 컴포넌트에서 `useQuery(jdQueries.insight(workspaceId, jdId))` 형태로 사용한다.
 * @example
 * ```ts
 * const { data } = useQuery(jdQueries.insight(workspaceId, jdId));
 * queryClient.invalidateQueries({ queryKey: jdKeys.all }); // 무효화는 키로
 * ```
 */
export const jdQueries = {
  /** 등록된 JD의 분석 인사이트(핵심/지원 전략)를 조회한다. */
  insight: (workspaceId: string, jdId: string) =>
    queryOptions({
      queryKey: jdKeys.insight(workspaceId, jdId),
      queryFn: () => jdAPI.getJdInsight({ workspaceId, jdId })
    }),
  /** JD의 기본 메타(기업명/포지션)를 조회한다. 이력서 헤더 등 공고 식별 표시에 쓴다. */
  meta: (workspaceId: string, jdId: string) =>
    queryOptions({
      queryKey: jdKeys.meta(workspaceId, jdId),
      queryFn: () => jdAPI.getJdMeta({ workspaceId, jdId })
    }),
  /** JD 원문 상세(팀 소개/업무내용/자격요건/우대경험/전형 절차)를 조회한다. 공고 원문 화면에 쓴다. */
  detail: (workspaceId: string, jdId: string) =>
    queryOptions({
      queryKey: jdKeys.detail(workspaceId, jdId),
      queryFn: () => jdAPI.getJdDetail({ workspaceId, jdId })
    }),
  /** 추천 공고 태그 목록(태그 코드 + 화면 표시명)을 조회한다. 홈 추천 공고 필터 칩에 쓴다. */
  recommendationTags: () =>
    queryOptions({
      queryKey: jdKeys.recommendationTags(),
      queryFn: jdAPI.getJdRecommendationTags
    }),
  /** 추천 공고 목록을 조회한다. `tags`가 비면 전체, 여러 개면 모두 포함한 공고만. */
  recommendations: (tags: JdRecommendationTag[], size: number) =>
    queryOptions({
      queryKey: jdKeys.recommendations(tags, size),
      queryFn: () => jdAPI.getJdRecommendations({ tags, size })
    })
}
