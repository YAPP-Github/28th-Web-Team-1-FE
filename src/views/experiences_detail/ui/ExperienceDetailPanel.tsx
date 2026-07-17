'use client'
import { Suspense, useState } from 'react'
import { useParams } from 'next/navigation'
import { toast } from 'sonner'
import { Flex } from '@radix-ui/themes'
import { ChevronsRight, Trash2 } from 'lucide-react'
import { useDeleteExperience, useExperienceSuspense, useUpdateExperience, type ExperienceDetail } from '@entities/experience'
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
import { formatPeriod, parsePeriodInput } from '@shared/lib'
import { StarEditor } from './StarEditor'

interface ExperienceDetailPanelProps {
  workspaceId: string
  experienceId: string
  onClose: () => void
}
export const ExperienceDetailPanel = ({ workspaceId, experienceId, onClose }: ExperienceDetailPanelProps) => {
  return (
    <Flex direction="column" className="border-border-subtle bg-bg-gray-subtler h-screen w-148.5 shrink-0 overflow-y-auto border-l p-8">
      <button type="button" aria-label="상세 패널 닫기" onClick={() => onClose()} className="mb-5 w-fit">
        <ChevronsRight size={24} className="text-icon-gray-lighter" />
      </button>

      <Suspense
        fallback={
          <Flex align="center" justify="center" className="h-screen">
            <Text variant="headline2" color="text-basic">
              로딩중
            </Text>
          </Flex>
        }
      >
        <ExperienceDetailPanelContent workspaceId={workspaceId} experienceId={experienceId} onClose={onClose} />
      </Suspense>
    </Flex>
  )
}

const ExperienceDetailPanelContent = ({ workspaceId, experienceId, onClose }: { workspaceId: string; experienceId: string; onClose: () => void }) => {
  const { experience } = useExperienceSuspense(workspaceId, experienceId)
  if (!experience) return null

  return (
    <Flex direction="column" gap="8">
      <Flex direction="column" gap="3" className="group hover:bg-white-50 py-2">
        <Flex align="center" justify="between" className="h-7.5">
          <Text variant="headline2" color="text-basic">
            {experience.title}
          </Text>
          <Flex align="center" gap="2" className="hidden group-hover:flex">
            <EditExperienceButton experience={experience} workspaceId={workspaceId} />
            <DeleteExperienceButton experienceId={experience.experienceId} workspaceId={workspaceId} onClose={onClose} />
          </Flex>
        </Flex>
        <Flex direction="column" gap="10px">
          <Flex align="center" gap="5">
            <Text variant="label2" color="text-subtler" className="w-16 shrink-0">
              역할 및 기간
            </Text>
            <Flex align="center" gap="2" className="h-full">
              <Text variant="label2" color="text-bolder">
                {experience.role || '-'}
              </Text>
              <Divider orientation="vertical" color="gray-20" />
              <Text variant="label2" color="text-bolder">
                {formatPeriod(experience.period?.startAt, experience.period?.endAt) || '-'}
              </Text>
            </Flex>
          </Flex>
          <Flex align="center" gap="5">
            <Text variant="label2" color="text-subtler" className="w-16 shrink-0">
              관련 역량
            </Text>
            <Flex align="center" gap="1" className="min-w-0 flex-1 flex-wrap">
              {experience.tags.map((tag, index) => (
                <Chip key={index} size="sm" variant="ghost">
                  {tag}
                </Chip>
              ))}
            </Flex>
          </Flex>
        </Flex>
      </Flex>

      <Divider />

      <StarEditor workspaceId={workspaceId} experience={experience} />
    </Flex>
  )
}

// 경험 삭제 버튼 + 다이얼로그
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

// 경험 수정 버튼 + 다이얼로그
const EditExperienceButton = ({ workspaceId, experience }: { workspaceId: string; experience: ExperienceDetail }) => {
  const { projectId } = useParams<{ projectId: string }>()
  const { mutate: updateExperience, isPending } = useUpdateExperience(workspaceId, projectId)

  const [isOpen, setIsOpen] = useState(false)
  const [form, setForm] = useState({
    title: experience.title,
    role: experience.role ?? '',
    period: formatPeriod(experience.period?.startAt, experience.period?.endAt)
  })

  const handleOpenChange = (next: boolean) => {
    if (next)
      setForm({
        title: experience.title,
        role: experience.role ?? '',
        period: formatPeriod(experience.period?.startAt, experience.period?.endAt)
      })
    setIsOpen(next)
  }

  const setField = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => setForm((prev) => ({ ...prev, [key]: e.target.value }))

  const handleSubmit = () => {
    const trimmed = form.title.trim()
    if (!trimmed) {
      toast.warning('경험 제목을 입력해 주세요.', { id: 'experience-title-required', position: 'top-center' })
      return
    }
    const trimmedRole = form.role.trim()
    updateExperience(
      {
        experienceId: experience.experienceId,
        request: {
          projectId,
          title: trimmed,
          tags: experience.tags,
          contents: experience.contents,
          role: trimmedRole || null,
          period: parsePeriodInput(form.period)
        }
      },
      {
        onSuccess: () => {
          toast.success('경험이 수정되었어요.', { id: 'experience-updated', position: 'top-center' })
          setIsOpen(false)
        },
        onError: () => toast.error('경험 수정에 실패했어요. 다시 시도해 주세요.', { id: 'experience-update-error', position: 'top-center' })
      }
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
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

        <Flex direction="column" gap="4">
          <Flex align="center" gap="4">
            <Text variant="label1" weight="semibold" color="text-basic" className="w-6.25 shrink-0">
              이름
            </Text>
            <div className="min-w-0 flex-1">
              <Input value={form.title} onChange={setField('title')} placeholder="입력된 경험명" clearable={false} />
            </div>
          </Flex>
          <Flex gap="5">
            <Flex align="center" gap="4" className="flex-1">
              <Text variant="label1" weight="semibold" color="text-basic" className="w-6.25 shrink-0">
                역할
              </Text>
              <div className="min-w-0 flex-1">
                <Input value={form.role} onChange={setField('role')} placeholder="입력된 역할" clearable={false} />
              </div>
            </Flex>
            <Flex align="center" gap="4" className="flex-1">
              <Text variant="label1" weight="semibold" color="text-basic" className="w-6.25 shrink-0">
                기간
              </Text>
              <div className="min-w-0 flex-1">
                <Input value={form.period} onChange={setField('period')} placeholder="입력된 기간" clearable={false} />
              </div>
            </Flex>
          </Flex>
        </Flex>

        <Flex gap="4">
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
