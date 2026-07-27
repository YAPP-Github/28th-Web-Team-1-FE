'use client'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { type PolishProfileTextRequest, type UpdateProfileRequest } from '@shared/lib/gql/graphql'
import { profileAPI } from '../api/profile.api'
import { profileKeys } from './profile.keys'

/**
 * 이력서 기본 정보 프로필을 수정한다. (전체 스냅샷 — 섹션 리스트는 전체 교체)
 * 성공 시 프로필 캐시를 무효화해 이후 조회가 갱신되도록 한다.
 * @param workspaceId 현재 워크스페이스 ID
 * @example
 * ```tsx
 * const { mutate } = useUpdateProfile(workspaceId)
 * mutate(request, { onSuccess: () => onDone() })
 * ```
 */
export const useUpdateProfile = (workspaceId: string) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (request: UpdateProfileRequest) => {
      const { updateProfile } = await profileAPI.updateProfile({ workspaceId, request })
      return updateProfile
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: profileKeys.detail(workspaceId) })
  })
}

/**
 * 프로필 텍스트를 AI로 다듬는다. 항목(kind)별 1콜, 결과 문자열만 반환(저장하지 않음).
 * 저장이 아니라 '제안 생성'이라 캐시 무효화가 없다 — 결과는 편집 폼에 로컬 반영 후 별도 저장(useUpdateResume)한다.
 * `request.jdId`로 지원 전략을 반영하려면 `workspaceId`를 함께 넘긴다.
 * @example
 * ```tsx
 * const { mutateAsync: polish } = usePolishProfileText()
 * const polished = await polish({ request: { kind: 'CORE_COMPETENCY', text }, workspaceId })
 * ```
 */
export const usePolishProfileText = () => {
  return useMutation({
    mutationFn: async (variables: { request: PolishProfileTextRequest; workspaceId?: string | null }) => {
      const { polishProfileText } = await profileAPI.polishProfileText(variables)
      return polishProfileText
    }
  })
}

/**
 * 프로필 정보(경력/프로젝트/스킬)를 바탕으로 핵심역량을 AI로 생성한다. 결과만 반환해 편집 폼에 로컬 반영 후 별도 저장하며, 이력서(`resumeId`)에는 생성 성공 여부만 기록한다.
 * `jdId`를 주면 해당 JD 내용을 반영해 생성하고 `strategy`도 함께 반환한다.
 * @example
 * ```tsx
 * const { mutateAsync: generate } = useGenerateCoreCompetency()
 * const { coreCompetency, strategy } = await generate({ workspaceId, resumeId, jdId })
 * ```
 */
export const useGenerateCoreCompetency = () => {
  return useMutation({
    mutationKey: profileKeys.generateCoreCompetency(),
    mutationFn: async (variables: { workspaceId: string; resumeId: string; jdId?: string | null }) => {
      const { generateCoreCompetency } = await profileAPI.generateCoreCompetency(variables)
      return generateCoreCompetency
    }
  })
}
