import { useForm, type DefaultValues, type FieldValues } from 'react-hook-form'
import { toast } from 'sonner'
import { useUpdateProfile } from '@entities/profile'
import { useWorkspaceId } from '@entities/user'
import type { UpdateProfileRequest } from '@shared/lib/gql/graphql'

import * as amplitude from '@amplitude/unified'
import { AMPLITUDE_EVENTS } from '@shared/config'

/** react-hook-form의 dirtyFields는 폼 값과 같은 모양으로, 바뀐 필드의 리프에만 `true`를 담는다. 그 리프 개수를 센다. */
const countDirtyFields = (dirtyFields: unknown): number => {
  if (dirtyFields === true) return 1
  if (!dirtyFields || typeof dirtyFields !== 'object') return 0
  return Object.values(dirtyFields).reduce((sum: number, value) => sum + countDirtyFields(value), 0)
}

/**
 * 마이페이지 섹션 편집 폼 공통 훅.
 * 저장 성공 시 방금 값을 새 기준선으로 삼아(reset) `isDirty`를 초기화한다.
 */
export const useProfileSectionForm = <T extends FieldValues>(seed: T, toRequest: (values: T) => UpdateProfileRequest) => {
  const workspaceId = useWorkspaceId()
  const { mutate, isPending } = useUpdateProfile(workspaceId)
  const methods = useForm<T>({ defaultValues: seed as DefaultValues<T> })

  const onSubmit = methods.handleSubmit((values) => {
    const updatedFieldCount = countDirtyFields(methods.formState.dirtyFields)

    mutate(toRequest(values), {
      onSuccess: () => {
        toast.success('저장되었어요', { id: 'profile-save', position: 'top-center' })
        amplitude.track(AMPLITUDE_EVENTS.ACCOUNT_INFO_UPDATED, { updated_field_count: updatedFieldCount })
        methods.reset(values)
      },
      onError: () => toast.error('저장에 실패했어요.\n입력한 내용은 그대로 있으니 다시 시도해 주세요.', { id: 'profile-save-error', position: 'top-center' })
    })
  })

  return { control: methods.control, onSubmit, isPending, isDirty: methods.formState.isDirty }
}
