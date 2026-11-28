'use client'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { ConsentType, MeQuery } from '@shared/lib/gql/graphql'
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

/**
 * 가입 동의(필수 2 + 선택 2)를 저장한다. 성공 시 `me`를 다시 받아 가입 동의 시트가 닫힌다.
 * @example
 * ```tsx
 * const { mutate } = useAgreeSignupConsents()
 * mutate({ terms: true, privacy: true, research: false, marketingEmail: false })
 * ```
 */
export const useAgreeSignupConsents = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: userAPI.agreeSignupConsents,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: userKeys.me() })
  })
}

/**
 * 선택 동의(리서치·광고성 정보 수신)를 변경한다. 보낸 항목만 바뀌고 `null`은 미변경.
 * `me` 캐시를 먼저 바꿔 두고(낙관적 업데이트), 실패하면 되돌린다. 끝나면 `me`를 다시 받는다.
 * @example
 * ```tsx
 * const { mutate } = useUpdateOptionalConsents()
 * mutate({ marketingEmail: true, source: 'MYPAGE' })
 * ```
 */
export const useUpdateOptionalConsents = () => {
  const queryClient = useQueryClient()
  const queryKey = userKeys.me()

  return useMutation({
    mutationFn: userAPI.updateOptionalConsents,
    onMutate: async (request) => {
      await queryClient.cancelQueries({ queryKey })
      const previous = queryClient.getQueryData<MeQuery>(queryKey)

      const changes = new Map<ConsentType, boolean>()
      if (typeof request.research === 'boolean') changes.set('RESEARCH', request.research)
      if (typeof request.marketingEmail === 'boolean') changes.set('MARKETING_EMAIL', request.marketingEmail)

      queryClient.setQueryData<MeQuery>(queryKey, (old) =>
        old ? { ...old, me: { ...old.me, consents: old.me.consents.map((consent) => (changes.has(consent.type) ? { ...consent, agreed: changes.get(consent.type)! } : consent)) } } : old
      )

      return { previous }
    },
    onError: (_error, _request, context) => {
      if (context?.previous) queryClient.setQueryData(queryKey, context.previous)
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey })
  })
}

/**
 * 기존 가입자 동의 시트를 노출했다고 기록한다. 다음 방문부터 `consentSheetRequired`가 false가 된다.
 * 열려 있는 시트가 사라지지 않도록 `me`를 무효화하지 않는다.
 */
export const useMarkConsentSheetShown = () => useMutation({ mutationFn: userAPI.markConsentSheetShown })
