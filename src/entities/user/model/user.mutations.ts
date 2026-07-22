'use client'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { userAPI } from '../api/user.api'
import { userKeys } from './user.keys'

/**
 * 회원탈퇴 뮤테이션. 성공하면 서버가 access/refresh 토큰 쿠키를 만료시켜 응답하므로,
 * 이제 유효하지 않은 유저 캐시를 지운다. 리다이렉트 등 화면 전환은 호출부가 `onSuccess`로 결정한다.
 * @example
 * ```tsx
 * const { mutate: withdraw } = useWithdraw()
 * withdraw(undefined, { onSuccess: () => router.replace('/') })
 * ```
 */
export const useWithdraw = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: userAPI.withdraw,
    onSuccess: () => queryClient.removeQueries({ queryKey: userKeys.all })
  })
}
