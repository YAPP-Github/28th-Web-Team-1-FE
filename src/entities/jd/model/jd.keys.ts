import { queryOptions } from '@tanstack/react-query'
import { jdAPI } from '../api/jd.api'

export const jdKeys = {
  all: ['jd'] as const,
  insight: (workspaceId: string, jdId: string) => [...jdKeys.all, 'insight', workspaceId, jdId] as const
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
    })
}
