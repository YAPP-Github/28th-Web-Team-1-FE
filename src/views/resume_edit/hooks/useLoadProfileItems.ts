import { useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import * as amplitude from '@amplitude/unified'
import { AMPLITUDE_EVENTS } from '@shared/config'
import { profileQueries, type Profile } from '@entities/profile'
import { useWorkspaceId } from '@entities/user'
import type { ProfileSectionPayload } from '../model/profileToSectionPayloads'

type ProfileLoadSectionName = 'education' | 'career_activity' | 'language' | 'certificate' | 'award' | 'skill'

/**
 * 워크스페이스 프로필을 조회해 편집 섹션의 아이템으로 불러오는 공용 훅.
 *
 * 버튼 클릭 시 프로필을 가져와 `selectPayloads`로 해당 카테고리 아이템 payload 배열로 변환한 뒤
 * `addItem`으로 모두 추가한다. 로딩 상태와 빈 목록·실패 토스트까지 캡슐화하므로, 각 섹션은
 * 카테고리별 변환 함수(`toCareerPayloads` 등)만 골라 넘기면 된다.
 *
 * @param addItem `useSectionItems`가 주는 아이템 추가 함수. 섹션마다 같은 필드 배열을 쓰되
 *   훅이 중복으로 `useFieldArray`를 등록하지 않도록 호출부에서 주입받는다.
 * @param selectPayloads 프로필 → 아이템 payload 배열 변환 함수(카테고리별).
 * @param sectionName 불러오기 성공 시 `profile_loaded` 이벤트에 실을 섹션명.
 * @example
 * ```tsx
 * const { addItem } = useSectionItems(sectionIndex)
 * const { loadProfileItems, isLoading } = useLoadProfileItems(addItem, toCareerPayloads, 'career_activity')
 * <LoadProfileButton disabled={isLoading} onClick={loadProfileItems} />
 * ```
 */
export const useLoadProfileItems = (addItem: (payload: ProfileSectionPayload) => void, selectPayloads: (profile: Profile) => ProfileSectionPayload[], sectionName: ProfileLoadSectionName) => {
  const workspaceId = useWorkspaceId()
  const queryClient = useQueryClient()
  const [isLoading, setIsLoading] = useState(false)

  const loadProfileItems = async () => {
    setIsLoading(true)
    try {
      const { profile } = await queryClient.fetchQuery(profileQueries.detail(workspaceId))
      const payloads = selectPayloads(profile)

      if (payloads.length === 0) {
        toast('불러올 정보가 없어요.')
        return
      }

      payloads.forEach((payload) => addItem(payload))
      amplitude.track(AMPLITUDE_EVENTS.PROFILE_DATA_IMPORTED, { section_name: sectionName })
    } catch {
      toast.error('내 정보를 불러오지 못했어요. 잠시 후 다시 시도해주세요.')
    } finally {
      setIsLoading(false)
    }
  }

  return { loadProfileItems, isLoading }
}
