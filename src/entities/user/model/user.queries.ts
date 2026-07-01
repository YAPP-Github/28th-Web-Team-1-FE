import { queryOptions } from '@tanstack/react-query'
import { userAPI } from '../api/user.api'
import { userKeys } from './user.keys'

/**
 * 내 사용자 정보(`me`) 조회용 queryOptions를 만드는 함수이다.
 * `useQuery(myUserQuery())` 형태로 사용한다.
 * @returns TanStack Query `queryOptions`
 * @example
 * ```ts
 * const { data } = useQuery(myUserQuery());
 * ```
 */
export const myUserQuery = () =>
  queryOptions({
    queryKey: userKeys.me(),
    queryFn: userAPI.getMe
  })
