'use client'
import { useState } from 'react'
import { useParams } from 'next/navigation'
import { toast } from 'sonner'
import { Flex } from '@radix-ui/themes'
import { useUpdateExperience, type ExperienceDetail } from '@entities/experience'
import { Text } from '@shared/ui'
import { Textarea } from '@shared/ui/textarea'
import { useAutosave } from '@shared/hooks/useAutosave'

const STAR_FIELDS = [
  { key: 'situation', label: 'Situation', sublabel: '상황' },
  { key: 'task', label: 'Task', sublabel: '과업' },
  { key: 'action', label: 'Action', sublabel: '행동' },
  { key: 'result', label: 'Result', sublabel: '결과' }
] as const

type StarKey = (typeof STAR_FIELDS)[number]['key']

// TODO : 자동저장 디바운스 지연 시간은 논의 필요 -> 일단 8초
const AUTOSAVE_DELAY_MS = 8000

interface StarEditorProps {
  workspaceId: string
  experience: ExperienceDetail
}
export const StarEditor = ({ workspaceId, experience }: StarEditorProps) => {
  const { projectId } = useParams<{ projectId: string }>()
  const { mutate: updateExperience } = useUpdateExperience(workspaceId, projectId)

  const star = experience.contents?.star
  const [values, setValues] = useState<Record<StarKey, string>>({
    situation: star?.situation ?? '',
    task: star?.task ?? '',
    action: star?.action ?? '',
    result: star?.result ?? ''
  })

  const save = () => {
    updateExperience(
      {
        experienceId: experience.experienceId,
        request: {
          projectId,
          title: experience.title,
          tags: experience.tags,
          contents: { type: 'STAR', star: values },
          role: experience.role ?? null,
          period: experience.period ?? null
        }
      },
      { onError: () => toast.error('저장에 실패했어요. 다시 시도해 주세요.', { id: 'experience-star-save-error', position: 'top-center' }) }
    )
  }
  const handleAutoSave = useAutosave(save, AUTOSAVE_DELAY_MS)

  const handleChange = (key: StarKey) => (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValues((prev) => ({ ...prev, [key]: e.target.value }))
    handleAutoSave()
  }

  return (
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
  )
}
