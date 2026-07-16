'use client'
import { useState } from 'react'
import { toast } from 'sonner'
import { Flex } from '@radix-ui/themes'
import { ChevronsLeft, Trash2 } from 'lucide-react'
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
import { Textarea } from '@shared/ui/textarea'
import type { ProjectMeta } from '../lib/projectMeta'
import { ExperienceFormDialog } from './ExperienceFormDialog'

const STAR_FIELDS = [
  { key: 'situation', label: 'Situation', sublabel: '상황' },
  { key: 'task', label: 'Task', sublabel: '과업' },
  { key: 'action', label: 'Action', sublabel: '행동' },
  { key: 'result', label: 'Result', sublabel: '결과' }
] as const

type StarKey = (typeof STAR_FIELDS)[number]['key']

const EMPTY_STAR: Record<StarKey, string> = { situation: '', task: '', action: '', result: '' }

interface ExperienceDetailPanelProps {
  workspaceId: string
  projectId: string
  experienceId: string
  title: string
  /** 경험 단위 값이 없어 프로젝트 값을 공통 표시 */
  projectMeta: ProjectMeta
  keywords: string[]
  onClose: () => void
}

/** 경험 카드를 누르면 열리는 상세 패널. STAR 상세를 조회·수정한다. (Figma: experience/detail) */
export const ExperienceDetailPanel = ({ workspaceId, projectId, experienceId, title, projectMeta, keywords, onClose }: ExperienceDetailPanelProps) => {
  const { experience } = useExperience(workspaceId, experienceId)
  const { mutate: updateExperience, isPending } = useUpdateExperience(workspaceId, projectId)

  const [isEditOpen, setIsEditOpen] = useState(false)
  const [values, setValues] = useState<Record<StarKey, string>>(EMPTY_STAR)

  // 단건 조회가 도착하면(비동기) STAR 입력값을 한 번 채운다. (렌더 중 상태 조정 패턴)
  const [syncedId, setSyncedId] = useState<string | null>(null)
  if (experience && syncedId !== experience.experienceId) {
    const star = experience.contents?.star
    setValues(star ? { situation: star.situation ?? '', task: star.task ?? '', action: star.action ?? '', result: star.result ?? '' } : EMPTY_STAR)
    setSyncedId(experience.experienceId)
  }

  const handleChange = (key: StarKey) => (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValues((prev) => ({ ...prev, [key]: e.target.value }))
  }

  const handleSave = () => {
    updateExperience(
      { experienceId, request: { contents: { type: 'STAR', star: values } } },
      {
        onSuccess: () => toast.success('경험이 저장되었어요.', { id: 'experience-star-saved', position: 'top-center' }),
        onError: () => toast.error('저장에 실패했어요. 다시 시도해 주세요.', { id: 'experience-star-save-error', position: 'top-center' })
      }
    )
  }

  return (
    <Flex direction="column" className="border-border-subtle bg-bg-gray-subtler h-screen w-148.5 shrink-0 overflow-y-auto border-l p-8">
      <button type="button" aria-label="상세 패널 닫기" onClick={() => onClose()} className="mb-5 w-fit">
        <ChevronsLeft size={24} className="text-icon-gray-lighter" />
      </button>

      <Flex direction="column" className="gap-8">
        <Flex direction="column" className="group gap-3">
          <Flex align="center" justify="between" className="h-7.5">
            <Text variant="headline2" color="text-basic">
              {title}
            </Text>
            <Flex align="center" gap="2" className="hidden group-hover:flex">
              <Button variant="tertiary" size="xs" className="bg-btn-secondary-fill" onClick={() => setIsEditOpen(true)}>
                수정하기
              </Button>
              <DeleteExperienceButton workspaceId={workspaceId} projectId={projectId} experienceId={experienceId} onDeleted={onClose} />
            </Flex>
          </Flex>
          <Flex direction="column" className="gap-2.5">
            <Flex align="center" className="gap-5">
              <Text variant="label2" color="text-subtler" className="w-16 shrink-0">
                역할 및 기간
              </Text>
              <Flex align="center" className="h-full gap-2">
                <Text variant="label2" color="text-bolder">
                  {projectMeta.role || '-'}
                </Text>
                <Divider orientation="vertical" color="gray-20" />
                <Text variant="label2" color="text-bolder">
                  {projectMeta.period || '-'}
                </Text>
              </Flex>
            </Flex>
            <Flex align="center" className="gap-5">
              <Text variant="label2" color="text-subtler" className="w-16 shrink-0">
                관련 역량
              </Text>
              <Flex align="center" className="min-w-0 flex-1 flex-wrap gap-1">
                {keywords.map((keyword, index) => (
                  <Chip key={index} size="sm" variant="ghost">
                    {keyword}
                  </Chip>
                ))}
              </Flex>
            </Flex>
          </Flex>
        </Flex>

        <Divider />

        {/* STAR 입력 */}
        <Flex direction="column" className="gap-4">
          {STAR_FIELDS.map((field) => (
            <Flex key={field.key} className="gap-4">
              <Flex direction="column" className="w-18.5 shrink-0">
                <Text variant="label1" weight="semibold" color="text-basic">
                  {field.label}
                </Text>
                <Text variant="label2" color="text-subtler">
                  {field.sublabel}
                </Text>
              </Flex>
              <div className="min-w-0 flex-1">
                <Textarea maxLength={600} placeholder="텍스트를 입력해 주세요." value={values[field.key]} onChange={handleChange(field.key)} />
              </div>
            </Flex>
          ))}
        </Flex>

        <Button variant="primary" size="lg" className="w-full" onClick={handleSave} disabled={isPending}>
          저장
        </Button>
      </Flex>

      {isEditOpen && (
        <ExperienceFormDialog mode="edit" experienceId={experienceId} title={title} onClose={() => setIsEditOpen(false)} workspaceId={workspaceId} projectId={projectId} projectMeta={projectMeta} />
      )}
    </Flex>
  )
}

const DeleteExperienceButton = ({ workspaceId, projectId, experienceId, onDeleted }: { workspaceId: string; projectId: string; experienceId: string; onDeleted: () => void }) => {
  const { mutate: deleteExperience } = useDeleteExperience(workspaceId, projectId)

  const handleDelete = () => {
    deleteExperience(experienceId, {
      onSuccess: () => {
        toast.success('경험이 삭제되었어요.', { id: 'experience-deleted', position: 'top-center' })
        onDeleted()
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
