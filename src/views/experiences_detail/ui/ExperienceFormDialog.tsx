'use client'
import { useState } from 'react'
import { toast } from 'sonner'
import { Flex } from '@radix-ui/themes'
import { useCreateExperience, useUpdateExperience } from '@entities/experience'
import { Button, Text } from '@shared/ui'
import { Dialog, DialogContent, DialogTitle } from '@shared/ui/dialog'
import { Input } from '@shared/ui/input'
import type { ProjectMeta } from '../lib/projectMeta'
import { FieldRow } from './FieldRow'

type ExperienceFormDialogProps = {
  onClose: () => void
  workspaceId: string
  projectId: string
  /** 역할/기간은 경험 단위로 저장되지 않아(백엔드 미지원) 프로젝트 값을 표시용 기본값으로 채운다. */
  projectMeta: ProjectMeta
} & ({ mode: 'create' } | { mode: 'edit'; experienceId: string; title: string })

/**
 * 경험 추가/수정 모달. (Figma: experience/writing "경험")
 * 부모가 열릴 때만 마운트하므로(`{isOpen && <ExperienceFormDialog />}`) 열 때마다 입력값이 초기화된다.
 */
export const ExperienceFormDialog = (props: ExperienceFormDialogProps) => {
  const { onClose, workspaceId, projectId, projectMeta } = props

  const [title, setTitle] = useState(props.mode === 'edit' ? props.title : '')
  // 역할/기간은 UI만 제공하고 저장하지 않는다. (Experience 스키마에 role/period 없음)
  const [role, setRole] = useState(projectMeta.role)
  const [period, setPeriod] = useState(projectMeta.period)

  const { mutate: createExperience, isPending: isCreating } = useCreateExperience(workspaceId, projectId)
  const { mutate: updateExperience, isPending: isUpdating } = useUpdateExperience(workspaceId, projectId)
  const isPending = isCreating || isUpdating

  const handleSubmit = () => {
    const trimmed = title.trim()
    if (!trimmed) {
      toast.warning('경험 제목을 입력해 주세요.', { id: 'experience-title-required', position: 'top-center' })
      return
    }

    if (props.mode === 'create') {
      createExperience(
        { projectId, title: trimmed, contents: { type: 'STAR', star: { situation: '', task: '', action: '', result: '' } } },
        {
          onSuccess: () => {
            toast.success('경험이 추가되었어요.', { id: 'experience-created', position: 'top-center' })
            onClose()
          },
          onError: () => toast.error('경험 추가에 실패했어요. 다시 시도해 주세요.', { id: 'experience-create-error', position: 'top-center' })
        }
      )
      return
    }

    updateExperience(
      { experienceId: props.experienceId, request: { title: trimmed } },
      {
        onSuccess: () => {
          toast.success('경험이 수정되었어요.', { id: 'experience-updated', position: 'top-center' })
          onClose()
        },
        onError: () => toast.error('경험 수정에 실패했어요. 다시 시도해 주세요.', { id: 'experience-update-error', position: 'top-center' })
      }
    )
  }

  return (
    <Dialog open onOpenChange={(next) => !next && onClose()}>
      <DialogContent className="w-150 gap-6">
        <DialogTitle>
          <Text variant="heading2" weight="semibold" color="text-basic">
            경험
          </Text>
        </DialogTitle>

        <Flex direction="column" className="gap-4">
          <FieldRow label="이름">
            <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="입력된 경험명" clearable={false} />
          </FieldRow>
          <Flex className="gap-5">
            <FieldRow label="역할" className="flex-1">
              <Input value={role} onChange={(e) => setRole(e.target.value)} placeholder="입력된 역할" clearable={false} />
            </FieldRow>
            <FieldRow label="기간" className="flex-1">
              <Input value={period} onChange={(e) => setPeriod(e.target.value)} placeholder="입력된 기간" clearable={false} />
            </FieldRow>
          </Flex>
        </Flex>

        <Flex className="gap-4">
          <Button variant="tertiary" size="lg" className="flex-1" onClick={() => onClose()} disabled={isPending}>
            취소
          </Button>
          <Button variant="primary" size="lg" className="flex-1" onClick={handleSubmit} disabled={isPending}>
            저장
          </Button>
        </Flex>
      </DialogContent>
    </Dialog>
  )
}
