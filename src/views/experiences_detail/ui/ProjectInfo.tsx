'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Flex } from '@radix-ui/themes'
import { Trash2 } from 'lucide-react'
import { useDeleteProject, useUpdateProject } from '@entities/project'
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
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogTitle, DialogTrigger } from '@shared/ui/dialog'
import { Input } from '@shared/ui/input'
import { Textarea } from '@shared/ui/textarea'
import { formatPeriod } from '@shared/lib'

interface ProjectInfoCardProps {
  workspaceId: string
  project: {
    projectId: string
    name: string
    role: string | null
    summary: string
    period: { startAt?: string | null; endAt?: string | null } | null
  }
}
export const ProjectInfo = ({ workspaceId, project }: ProjectInfoCardProps) => {
  const { projectId, name, role, summary } = project
  const periodText = formatPeriod(project.period?.startAt, project.period?.endAt)

  return (
    <div className="group hover:bg-btn-tertiary-fill flex flex-col gap-3 py-2 transition-colors">
      <Flex align="center" justify="between" className="h-7.5">
        <Text variant="headline1" color="text-basic">
          {name}
        </Text>
        <Flex align="center" gap="2" className="hidden pr-2 group-hover:flex">
          <EditProjectButton workspaceId={workspaceId} projectId={projectId} initial={{ name, role: role ?? '', period: periodText, summary }} />
          <DeleteProjectButton workspaceId={workspaceId} projectId={projectId} />
        </Flex>
      </Flex>
      <Flex direction="column" gap="4">
        <Flex gap="5">
          <Flex align="center" gap="4" className="flex-1">
            <Text variant="label1" color="text-basic" className="w-6.25 shrink-0">
              역할
            </Text>
            <Text variant="body2" color="text-basic">
              {role || '-'}
            </Text>
          </Flex>
          <Flex align="center" gap="4" className="flex-1">
            <Text variant="label1" color="text-basic" className="w-6.25 shrink-0">
              기간
            </Text>
            <Text variant="body2" color="text-basic">
              {periodText || '-'}
            </Text>
          </Flex>
        </Flex>
        <Flex gap="4">
          <Text variant="label1" color="text-basic" className="w-6.25 shrink-0">
            설명
          </Text>
          <Text variant="body2" color="text-basic" className="flex-1">
            {summary}
          </Text>
        </Flex>
      </Flex>
    </div>
  )
}

const DeleteProjectButton = ({ workspaceId, projectId }: { workspaceId: string; projectId: string }) => {
  const router = useRouter()
  const { mutate: deleteProject } = useDeleteProject(workspaceId)

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="danger" size="icon-xs" aria-label="프로젝트 삭제">
          <Trash2 size={12} />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>해당 프로젝트를 삭제하시겠어요?</AlertDialogTitle>
          <AlertDialogDescription className="whitespace-pre-line">{'작성한 프로젝트의 세부 내용이 모두 삭제되며,\n삭제된 내용은 복구할 수 없습니다.'}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel variant="tertiary">닫기</AlertDialogCancel>
          <AlertDialogAction variant="danger" onClick={() => deleteProject(projectId, { onSuccess: () => router.push('/experiences') })}>
            삭제
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

interface ProjectInitialValues {
  name: string
  role: string
  period: string
  summary: string
}
interface EditProjectButtonProps {
  workspaceId: string
  projectId: string
  initial: ProjectInitialValues
}

/** "2025.05 - 2025.08" / "2025.05" 텍스트를 PeriodInput으로 변환한다. 비어 있으면 null. */
const parsePeriodInput = (value: string): { startAt: string | null; endAt: string | null } | null => {
  const trimmed = value.trim()
  if (!trimmed) return null
  const [start, end] = trimmed.split(/\s*[-~]\s*/)
  return { startAt: start || null, endAt: end || null }
}

/** 프로젝트 수정 모달. */
const EditProjectButton = ({ workspaceId, projectId, initial }: EditProjectButtonProps) => {
  const [name, setName] = useState(initial.name)
  const [role, setRole] = useState(initial.role)
  const [period, setPeriod] = useState(initial.period)
  const [summary, setSummary] = useState(initial.summary)

  const { mutate: updateProject, isPending } = useUpdateProject(workspaceId, projectId)

  const handleSubmit = () => {
    updateProject(
      { name: name.trim(), role: role.trim(), summary: summary.trim(), period: parsePeriodInput(period) },
      {
        onSuccess: () => {
          toast.success('프로젝트가 수정되었어요.', { id: 'project-updated', position: 'top-center' })
        },
        onError: () => toast.error('프로젝트 수정에 실패했어요. 다시 시도해 주세요.', { id: 'project-update-error', position: 'top-center' })
      }
    )
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="tertiary" size="xs" className="bg-btn-secondary-fill">
          수정하기
        </Button>
      </DialogTrigger>
      <DialogContent className="w-150 gap-6">
        <DialogTitle>
          <Text variant="heading2" weight="semibold" color="text-basic">
            프로젝트
          </Text>
        </DialogTitle>

        <Flex direction="column" className="gap-4">
          <Flex align="center" className="gap-4">
            <Text variant="label1" weight="semibold" color="text-basic" className="w-6.25 shrink-0">
              이름
            </Text>
            <div className="min-w-0 flex-1">
              <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="입력된 프로젝트 명" clearable={false} />
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
          <Flex align="start" className="gap-4">
            <Text variant="label1" weight="semibold" color="text-basic" className="w-6.25 shrink-0">
              설명
            </Text>
            <div className="min-w-0 flex-1">
              <Textarea maxLength={2000} placeholder="텍스트를 입력해 주세요." value={summary} onChange={(e) => setSummary(e.target.value)} className="min-h-19.25" />
            </div>
          </Flex>
        </Flex>
        <DialogFooter className="flex-col gap-4">
          <DialogClose asChild>
            <Button variant="tertiary" size="lg" className="flex-1" disabled={isPending}>
              취소
            </Button>
          </DialogClose>
          <Button variant="primary" size="lg" className="flex-1" onClick={handleSubmit} disabled={isPending}>
            저장
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
