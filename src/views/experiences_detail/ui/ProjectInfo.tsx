'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Flex } from '@radix-ui/themes'
import { Trash2 } from 'lucide-react'
import { useDeleteProject, useUpdateProject, type Project } from '@entities/project'
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
import { MonthPicker } from '@shared/ui/month_picker'
import { formatDate, formatPeriod, monthToApiDate } from '@shared/lib'

interface ProjectInfoCardProps {
  workspaceId: string
  project: Project
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
          <EditProjectButton workspaceId={workspaceId} project={project} />
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

/** 프로젝트 삭제 모달. */
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

/** 프로젝트 수정 모달. */
const EditProjectButton = ({ workspaceId, project }: { workspaceId: string; project: Project }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [form, setForm] = useState({
    name: project.name,
    role: project.role ?? '',
    periodStart: formatDate(project.period?.startAt, 'YYYY.MM') || null,
    periodEnd: formatDate(project.period?.endAt, 'YYYY.MM') || null,
    summary: project.summary
  })
  const { mutate: updateProject, isPending } = useUpdateProject(workspaceId, project.projectId)

  const handleOpenChange = (next: boolean) => {
    if (next)
      setForm({
        name: project.name,
        role: project.role ?? '',
        periodStart: formatDate(project.period?.startAt, 'YYYY.MM') || null,
        periodEnd: formatDate(project.period?.endAt, 'YYYY.MM') || null,
        summary: project.summary
      })
    setIsOpen(next)
  }

  const setField = (key: 'name' | 'role' | 'summary') => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setForm((prev) => ({ ...prev, [key]: e.target.value }))

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const period =
      form.periodStart || form.periodEnd ? { startAt: form.periodStart ? monthToApiDate(form.periodStart, 'start') : null, endAt: form.periodEnd ? monthToApiDate(form.periodEnd, 'end') : null } : null
    updateProject(
      { name: form.name.trim(), role: form.role.trim(), summary: form.summary.trim(), period },
      {
        onSuccess: () => {
          toast.success('프로젝트가 수정되었어요.', { id: 'project-updated', position: 'top-center' })
          setIsOpen(false)
        },
        onError: (error) => toast.error(error.message, { id: 'project-update-error', position: 'top-center' })
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
            프로젝트
          </Text>
        </DialogTitle>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <Flex direction="column" className="gap-4">
            <Flex align="center" className="gap-4">
              <Text variant="label1" weight="semibold" color="text-basic" className="w-6.25 shrink-0">
                이름
              </Text>
              <div className="min-w-0 flex-1">
                <Input value={form.name} onChange={setField('name')} maxLength={20} placeholder="입력된 프로젝트 명" clearable={false} />
              </div>
            </Flex>
            <Flex className="gap-5">
              <Flex align="center" className="flex-1 gap-4">
                <Text variant="label1" weight="semibold" color="text-basic" className="w-6.25 shrink-0">
                  역할
                </Text>
                <div className="min-w-0 flex-1">
                  <Input value={form.role} onChange={setField('role')} maxLength={20} placeholder="입력된 역할" clearable={false} />
                </div>
              </Flex>
              <Flex align="center" className="flex-1 gap-4">
                <Text variant="label1" weight="semibold" color="text-basic" className="w-6.25 shrink-0">
                  기간
                </Text>
                <Flex align="center" className="min-w-0 flex-1 gap-2">
                  <MonthPicker value={form.periodStart} onChange={(month) => setForm((prev) => ({ ...prev, periodStart: month }))} placeholder="시작" className="min-w-0 flex-1" align="start" />
                  <span className="text-text-subtler">-</span>
                  <MonthPicker value={form.periodEnd} onChange={(month) => setForm((prev) => ({ ...prev, periodEnd: month }))} placeholder="종료" className="min-w-0 flex-1" align="end" />
                </Flex>
              </Flex>
            </Flex>
            <Flex align="start" className="gap-4">
              <Text variant="label1" weight="semibold" color="text-basic" className="w-6.25 shrink-0">
                설명
              </Text>
              <div className="min-w-0 flex-1">
                <Textarea maxLength={500} placeholder="텍스트를 입력해 주세요." value={form.summary} onChange={setField('summary')} className="min-h-19.25" />
              </div>
            </Flex>
          </Flex>
          <DialogFooter className="flex-col gap-4">
            <DialogClose asChild>
              <Button type="button" variant="tertiary" size="lg" className="flex-1" disabled={isPending}>
                취소
              </Button>
            </DialogClose>
            <Button type="submit" variant="primary" size="lg" className="flex-1" disabled={isPending}>
              저장
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
