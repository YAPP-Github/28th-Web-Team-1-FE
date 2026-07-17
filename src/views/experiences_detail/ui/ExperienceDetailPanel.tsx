'use client'
import { useState } from 'react'
import { useParams } from 'next/navigation'
import { toast } from 'sonner'
import { Flex } from '@radix-ui/themes'
import { ChevronsRight, Trash2 } from 'lucide-react'
import { useDeleteExperience, useExperience, useUpdateExperience } from '@entities/experience'
import { Button, Text } from '@shared/ui'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@shared/ui/alert_dialog'
import { Chip } from '@shared/ui/chip'
import { Divider } from '@shared/ui/divider'
import { Dialog, DialogClose, DialogContent, DialogTitle, DialogTrigger } from '@shared/ui/dialog'
import { Input } from '@shared/ui/input'
import { formatPeriod } from '@shared/lib'
import { StarEditor } from './StarEditor'
import { parsePeriodInput } from '../lib/parsePeriodInput'

interface ExperiencePeriod {
  startAt?: string | null
  endAt?: string | null
}
interface ExperienceDetailPanelProps {
  workspaceId: string
  experience: { experienceId: string; title: string; tags: string[]; role: string | null; period: ExperiencePeriod | null }
  onClose: () => void
}
export const ExperienceDetailPanel = ({ workspaceId, experience, onClose }: ExperienceDetailPanelProps) => {
  const { experienceId, title, tags, role, period } = experience

  return (
    <Flex direction="column" className="border-border-subtle bg-bg-gray-subtler h-screen w-148.5 shrink-0 overflow-y-auto border-l p-8">
      <button type="button" aria-label="상세 패널 닫기" onClick={() => onClose()} className="mb-5 w-fit">
        <ChevronsRight size={24} className="text-icon-gray-lighter" />
      </button>

      <Flex direction="column" className="gap-8">
        <Flex direction="column" className="group gap-3">
          <Flex align="center" justify="between" className="h-7.5">
            <Text variant="headline2" color="text-basic">
              {title}
            </Text>
            <Flex align="center" gap="2" className="hidden group-hover:flex">
              <EditExperienceButton experienceId={experienceId} workspaceId={workspaceId} />
              <DeleteExperienceButton workspaceId={workspaceId} experienceId={experienceId} onClose={onClose} />
            </Flex>
          </Flex>
          <Flex direction="column" className="gap-2.5">
            <Flex align="center" className="gap-5">
              <Text variant="label2" color="text-subtler" className="w-16 shrink-0">
                역할 및 기간
              </Text>
              <Flex align="center" className="h-full gap-2">
                <Text variant="label2" color="text-bolder">
                  {role || '-'}
                </Text>
                <Divider orientation="vertical" color="gray-20" />
                <Text variant="label2" color="text-bolder">
                  {formatPeriod(period?.startAt, period?.endAt) || '-'}
                </Text>
              </Flex>
            </Flex>
            <Flex align="center" className="gap-5">
              <Text variant="label2" color="text-subtler" className="w-16 shrink-0">
                관련 역량
              </Text>
              <Flex align="center" className="min-w-0 flex-1 flex-wrap gap-1">
                {tags.map((tag, index) => (
                  <Chip key={index} size="sm" variant="ghost">
                    {tag}
                  </Chip>
                ))}
              </Flex>
            </Flex>
          </Flex>
        </Flex>

        <Divider />

        <StarEditor workspaceId={workspaceId} experienceId={experienceId} />
      </Flex>
    </Flex>
  )
}

const DeleteExperienceButton = ({ workspaceId, experienceId, onClose }: { workspaceId: string; experienceId: string; onClose: () => void }) => {
  const { projectId } = useParams<{ projectId: string }>()
  const { mutate: deleteExperience } = useDeleteExperience(workspaceId, projectId)

  const handleDelete = () => {
    deleteExperience(experienceId, {
      onSuccess: () => {
        toast.success('경험이 삭제되었어요.', { id: 'experience-deleted', position: 'top-center' })
        onClose()
      },
      onError: () => toast.error('삭제에 실패했어요. 다시 시도해 주세요.', { id: 'experience-delete-error', position: 'top-center' })
    })
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="danger" size="icon-xs" aria-label="경험 삭제">
          <Trash2 size={12} />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>해당 경험을 삭제하시겠어요?</AlertDialogTitle>
          <AlertDialogDescription className="whitespace-pre-line">{'작성한 경험의 세부 내용이 모두 삭제되며,\n삭제된 내용은 복구할 수 없습니다.'}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel variant="tertiary">닫기</AlertDialogCancel>
          <AlertDialogAction variant="danger" onClick={handleDelete}>
            삭제
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

interface EditExperienceButtonProps {
  workspaceId: string
  experienceId: string
}
const EditExperienceButton = ({ workspaceId, experienceId }: EditExperienceButtonProps) => {
  const { projectId } = useParams<{ projectId: string }>()
  // 수정은 전체 스냅샷 전송이라 현재 경험(내용·태그 포함)을 읽어 편집한 필드와 함께 되돌려 보낸다.
  const { experience } = useExperience(workspaceId, experienceId)
  const { mutate: updateExperience, isPending } = useUpdateExperience(workspaceId, projectId)

  const [title, setTitle] = useState('')
  const [role, setRole] = useState('')
  const [period, setPeriod] = useState('')

  const handleOpenChange = (next: boolean) => {
    if (!next || !experience) return
    setTitle(experience.title)
    setRole(experience.role ?? '')
    setPeriod(formatPeriod(experience.period?.startAt, experience.period?.endAt))
  }

  const handleSubmit = () => {
    if (!experience) return
    const trimmed = title.trim()
    if (!trimmed) {
      toast.warning('경험 제목을 입력해 주세요.', { id: 'experience-title-required', position: 'top-center' })
      return
    }
    const trimmedRole = role.trim()
    updateExperience(
      {
        experienceId,
        request: {
          projectId,
          title: trimmed,
          tags: experience.tags,
          contents: experience.contents,
          role: trimmedRole || null,
          period: parsePeriodInput(period)
        }
      },
      {
        onSuccess: () => toast.success('경험이 수정되었어요.', { id: 'experience-updated', position: 'top-center' }),
        onError: () => toast.error('경험 수정에 실패했어요. 다시 시도해 주세요.', { id: 'experience-update-error', position: 'top-center' })
      }
    )
  }

  return (
    <Dialog onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="tertiary" size="xs" className="bg-btn-secondary-fill">
          수정하기
        </Button>
      </DialogTrigger>
      <DialogContent className="w-150 gap-6">
        <DialogTitle>
          <Text variant="heading2" weight="semibold" color="text-basic">
            경험
          </Text>
        </DialogTitle>

        <Flex direction="column" className="gap-4">
          <Flex align="center" className="gap-4">
            <Text variant="label1" weight="semibold" color="text-basic" className="w-6.25 shrink-0">
              이름
            </Text>
            <div className="min-w-0 flex-1">
              <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="입력된 경험명" clearable={false} />
            </div>
          </Flex>
          <Flex className="gap-5">
            <Flex align="center" className="flex-1 gap-4">
              <Text variant="label1" weight="semibold" color="text-basic" className="w-6.25 shrink-0">
                역할
              </Text>
              <div className="min-w-0 flex-1">
                <Input value={role} onChange={(e) => setRole(e.target.value)} placeholder="입력된 역할" clearable={false} />
              </div>
            </Flex>
            <Flex align="center" className="flex-1 gap-4">
              <Text variant="label1" weight="semibold" color="text-basic" className="w-6.25 shrink-0">
                기간
              </Text>
              <div className="min-w-0 flex-1">
                <Input value={period} onChange={(e) => setPeriod(e.target.value)} placeholder="입력된 기간" clearable={false} />
              </div>
            </Flex>
          </Flex>
        </Flex>

        <Flex className="gap-4">
          <DialogClose asChild>
            <Button variant="tertiary" size="lg" className="flex-1" disabled={isPending}>
              취소
            </Button>
          </DialogClose>
          <Button variant="primary" size="lg" className="flex-1" onClick={handleSubmit} disabled={isPending}>
            저장
          </Button>
        </Flex>
      </DialogContent>
    </Dialog>
  )
}
