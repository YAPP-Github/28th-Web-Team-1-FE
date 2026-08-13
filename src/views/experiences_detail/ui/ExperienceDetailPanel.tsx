'use client'
import { Suspense, useState } from 'react'
import { useParams } from 'next/navigation'
import { toast } from 'sonner'
import { Flex, Skeleton } from '@radix-ui/themes'
import { ErrorBoundary } from '@sentry/nextjs'
import { cn } from '@shared/lib/cn'
import { ChevronsRight, Trash2 } from 'lucide-react'
import { useDeleteExperience, useExperienceSuspense, useUpdateExperience, type ExperienceDetail } from '@entities/experience'
import { Button, ErrorFallback, Text } from '@shared/ui'
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
import { MonthRangePicker } from '@shared/ui/month_range_picker'
import { formatDate, formatPeriod, monthToApiDate } from '@shared/lib'
import { StarEditor } from './StarEditor'

interface ExperienceDetailPanelProps {
  workspaceId: string
  experienceId: string
  onClose: () => void
  className?: string
}
export const ExperienceDetailPanel = ({ workspaceId, experienceId, onClose, className }: ExperienceDetailPanelProps) => {
  return (
    <Flex direction="column" className={cn('border-border-subtle bg-bg-gray-subtler h-screen w-148.5 shrink-0 overflow-y-auto border-l p-8', className)}>
      <button type="button" aria-label="상세 패널 닫기" onClick={() => onClose()} className="mb-5 w-fit">
        <ChevronsRight size={24} className="text-icon-gray-lighter" />
      </button>

      <ErrorBoundary fallback={<ErrorFallback title="경험을 불러오지 못했어요." description="잠시 후 다시 시도해 주세요." className="flex-1" />}>
        <Suspense fallback={<ExperienceDetailPanelSkeleton />}>
          <ExperienceDetailPanelContent workspaceId={workspaceId} experienceId={experienceId} onClose={onClose} />
        </Suspense>
      </ErrorBoundary>
    </Flex>
  )
}

const STAR_FIELD_LABELS = [
  { key: 'situation', label: 'Situation', sublabel: '상황' },
  { key: 'task', label: 'Task', sublabel: '과업' },
  { key: 'action', label: 'Action', sublabel: '행동' },
  { key: 'result', label: 'Result', sublabel: '결과' }
] as const

// 실제 패널 레이아웃(제목/역할·기간/태그 + STAR 입력 영역)을 그대로 따르는 스켈레톤.
const ExperienceDetailPanelSkeleton = () => (
  <Flex direction="column" gap="8">
    <Flex direction="column" gap="3" className="py-2">
      <Flex align="center" className="h-7.5">
        <Skeleton>
          <Text variant="headline2">경험 제목이 표시되는 영역</Text>
        </Skeleton>
      </Flex>
      <Flex direction="column" gap="10px">
        <Flex align="center" gap="5">
          <Text variant="label2" color="text-subtler" className="w-16 shrink-0">
            역할 및 기간
          </Text>
          <Skeleton>
            <Text variant="label2">백엔드 개발자 · 2024.01 - 2024.06</Text>
          </Skeleton>
        </Flex>
        <Flex align="center" gap="5">
          <Text variant="label2" color="text-subtler" className="w-16 shrink-0">
            관련 역량
          </Text>
          <Flex align="center" gap="1" className="min-w-0 flex-1 flex-wrap">
            {['React', 'TypeScript'].map((tag) => (
              <Skeleton key={tag}>
                <Chip size="sm" variant="ghost">
                  {tag}
                </Chip>
              </Skeleton>
            ))}
          </Flex>
        </Flex>
      </Flex>
    </Flex>

    <Divider />

    <Flex direction="column" className="gap-4">
      {STAR_FIELD_LABELS.map((field) => (
        <Flex key={field.key} className="gap-4">
          <Flex direction="column" className="w-18.5 shrink-0">
            <Text variant="label1" weight="semibold" color="text-basic">
              {field.label}
            </Text>
            <Text variant="label2" color="text-subtler">
              {field.sublabel}
            </Text>
          </Flex>
          <Skeleton className="min-w-0 flex-1">
            <div className="min-h-30 w-full rounded-lg" />
          </Skeleton>
        </Flex>
      ))}
    </Flex>
  </Flex>
)

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
          <Flex align="start" gap="5">
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

      <StarEditor key={experience.experienceId} workspaceId={workspaceId} experience={experience} />
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
      onError: () => toast.error('삭제에 실패했어요.\n잠시 후 다시 시도해 주세요.', { id: 'experience-delete-error', position: 'top-center' })
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
    periodStart: formatDate(experience.period?.startAt, 'YYYY.MM') || null,
    periodEnd: formatDate(experience.period?.endAt, 'YYYY.MM') || null
  })

  const handleOpenChange = (next: boolean) => {
    if (next)
      setForm({
        title: experience.title,
        role: experience.role ?? '',
        periodStart: formatDate(experience.period?.startAt, 'YYYY.MM') || null,
        periodEnd: formatDate(experience.period?.endAt, 'YYYY.MM') || null
      })
    setIsOpen(next)
  }

  const setField = (key: 'title' | 'role') => (e: React.ChangeEvent<HTMLInputElement>) => setForm((prev) => ({ ...prev, [key]: e.target.value }))

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = form.title.trim()
    if (!trimmed) {
      toast.warning('경험 제목을 입력해 주세요.', { id: 'experience-title-required', position: 'top-center' })
      return
    }
    const trimmedRole = form.role.trim()
    const period =
      form.periodStart || form.periodEnd ? { startAt: form.periodStart ? monthToApiDate(form.periodStart, 'start') : null, endAt: form.periodEnd ? monthToApiDate(form.periodEnd, 'end') : null } : null
    updateExperience(
      {
        experienceId: experience.experienceId,
        request: {
          projectId,
          title: trimmed,
          tags: experience.tags,
          contents: experience.contents,
          role: trimmedRole || null,
          period
        }
      },
      {
        onSuccess: () => {
          toast.success('경험이 수정되었어요.', { id: 'experience-updated', position: 'top-center' })
          setIsOpen(false)
        },
        onError: () => toast.error('경험 수정에 실패했어요.\n입력한 내용은 그대로 있으니 다시 시도해 주세요.', { id: 'experience-update-error', position: 'top-center' })
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
      <DialogContent className="w-160 gap-6">
        <DialogTitle>
          <Text variant="heading2" weight="semibold" color="text-basic">
            경험
          </Text>
        </DialogTitle>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <Flex direction="column" gap="4">
            <Flex align="center" gap="4">
              <Text variant="label1" weight="semibold" color="text-basic" className="w-6.25 shrink-0">
                이름
              </Text>
              <div className="min-w-0 flex-1">
                <Input value={form.title} onChange={setField('title')} maxLength={20} placeholder="입력된 경험명" clearable={false} />
              </div>
            </Flex>
            <Flex gap="5">
              <Flex align="center" gap="4" className="flex-1">
                <Text variant="label1" weight="semibold" color="text-basic" className="w-6.25 shrink-0">
                  역할
                </Text>
                <div className="min-w-0 flex-1">
                  <Input value={form.role} onChange={setField('role')} maxLength={20} placeholder="입력된 역할" clearable={false} />
                </div>
              </Flex>
              <Flex align="center" gap="4" className="flex-1">
                <Text variant="label1" weight="semibold" color="text-basic" className="w-6.25 shrink-0">
                  기간
                </Text>
                <MonthRangePicker
                  start={form.periodStart}
                  end={form.periodEnd}
                  onChangeStart={(month) => setForm((prev) => ({ ...prev, periodStart: month }))}
                  onChangeEnd={(month) => setForm((prev) => ({ ...prev, periodEnd: month }))}
                  className="min-w-0 flex-1"
                />
              </Flex>
            </Flex>
          </Flex>

          <Flex gap="4">
            <DialogClose asChild>
              <Button type="button" variant="tertiary" size="lg" className="flex-1" disabled={isPending}>
                취소
              </Button>
            </DialogClose>
            <Button type="submit" variant="primary" size="lg" className="flex-1" disabled={isPending}>
              저장
            </Button>
          </Flex>
        </form>
      </DialogContent>
    </Dialog>
  )
}
