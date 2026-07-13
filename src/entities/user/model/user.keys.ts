import { queryOptions } from '@tanstack/react-query'
import { userAPI } from '@entities/user'

export const userKeys = {
  all: ['user'] as const,
  me: () => [...userKeys.all, 'me'] as const
}

/**
 * user 도메인의 queryOptions 팩토리이다.
 * 키(`userKeys`)와 짝을 이루며, 컴포넌트에서 `useQuery(userQueries.me())` 형태로 사용한다.
 * @example
 * ```ts
 * const { data } = useQuery(userQueries.me());
 * queryClient.invalidateQueries({ queryKey: userKeys.all }); // 무효화는 키로
 * ```
 */
export const userQueries = {
  me: () =>
    queryOptions({
      queryKey: userKeys.me(),
      queryFn: userAPI.getMe
    })
}
