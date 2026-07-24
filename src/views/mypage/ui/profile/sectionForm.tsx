'use client'
import { useForm, type DefaultValues, type FieldValues } from 'react-hook-form'
import { toast } from 'sonner'
import { Flex } from '@radix-ui/themes'
import { Plus, Trash2 } from 'lucide-react'
import { Button, Divider, Spacing, Text } from '@shared/ui'
import { useUpdateProfile } from '@entities/profile'
import { useWorkspaceId } from '@entities/user'
import type { UpdateProfileRequest } from '@shared/lib/gql/graphql'

/**
 * 마이페이지 섹션 편집 폼 공통 훅.
 * 섹션 값으로 폼을 seed하고, 저장 시 `toRequest`(전체 스냅샷에 자기 섹션만 덮어쓴 요청)를 보낸다.
 * 저장 성공 시 방금 값을 새 기준선으로 삼아(reset) `isDirty`를 초기화한다.
 */
export const useProfileSectionForm = <T extends FieldValues>(seed: T, toRequest: (values: T) => UpdateProfileRequest) => {
  const workspaceId = useWorkspaceId()
  const { mutate, isPending } = useUpdateProfile(workspaceId)
  const methods = useForm<T>({ defaultValues: seed as DefaultValues<T> })

  const onSubmit = methods.handleSubmit((values) => {
    mutate(toRequest(values), {
      onSuccess: () => {
        toast.success('저장되었어요.', { id: 'profile-save', position: 'top-center' })
        methods.reset(values)
      },
      onError: () => toast.error('저장에 실패했어요. 다시 시도해 주세요.', { id: 'profile-save-error', position: 'top-center' })
    })
  })

  return { control: methods.control, onSubmit, isPending, isDirty: methods.formState.isDirty }
}

/** 섹션 하단 전체폭 저장 버튼. */
export const SaveButton = ({ disabled }: { disabled: boolean }) => (
  <Button type="submit" variant="primary" size="lg" fullWidth disabled={disabled}>
    저장하기
  </Button>
)

/** 반복 섹션 항목 헤더(제목 + 삭제 버튼 + 구분선). */
export const RepeatableItemHeader = ({ title, onRemove }: { title: string; onRemove: () => void }) => (
  <Flex direction="column">
    <Flex justify="between" align="center">
      <Text variant="headline2" color="text-primary-basic">
        {title}
      </Text>
      <Button type="button" variant="tertiary" size="icon-xs" onClick={onRemove} aria-label={`${title} 삭제`}>
        <Trash2 />
      </Button>
    </Flex>
    <Spacing size={12} />
    <Divider />
    <Spacing size={16} />
  </Flex>
)

/** 반복 섹션 하단 "추가" 링크 버튼. */
export const AddItemButton = ({ label, onClick }: { label: string; onClick: () => void }) => (
  <Flex justify="center">
    <Button type="button" variant="text" size="sm" onClick={onClick}>
      {label}
      <Plus size={16} data-icon="inline-end" />
    </Button>
  </Flex>
)
