'use client'
import { useEffect, useRef, useState } from 'react'
import { useParams } from 'next/navigation'
import { toast } from 'sonner'
import { Flex } from '@radix-ui/themes'
import { useExperience, useUpdateExperience } from '@entities/experience'
import { Text } from '@shared/ui'
import { Textarea } from '@shared/ui/textarea'

const STAR_FIELDS = [
  { key: 'situation', label: 'Situation', sublabel: '상황' },
  { key: 'task', label: 'Task', sublabel: '과업' },
  { key: 'action', label: 'Action', sublabel: '행동' },
  { key: 'result', label: 'Result', sublabel: '결과' }
] as const

type StarKey = (typeof STAR_FIELDS)[number]['key']

const EMPTY_STAR: Record<StarKey, string> = { situation: '', task: '', action: '', result: '' }

// TODO : 자동저장 디바운스 지연 시간은 논의 필요 -> 일단 8초
const AUTOSAVE_DELAY_MS = 8000

interface StarEditorProps {
  workspaceId: string
  experienceId: string
}
export const StarEditor = ({ workspaceId, experienceId }: StarEditorProps) => {
  const { projectId } = useParams<{ projectId: string }>()
  const { experience } = useExperience(workspaceId, experienceId)
  const { mutate: updateExperience } = useUpdateExperience(workspaceId, projectId)

  const [values, setValues] = useState<Record<StarKey, string>>(EMPTY_STAR)

  // 단건 조회가 도착하면(비동기) STAR 입력값을 한 번 채운다. (렌더 중 상태 조정 패턴)
  const [syncedId, setSyncedId] = useState<string | null>(null)
  if (experience && syncedId !== experience.experienceId) {
    const star = experience.contents?.star
    setValues(star ? { situation: star.situation ?? '', task: star.task ?? '', action: star.action ?? '', result: star.result ?? '' } : EMPTY_STAR)
    setSyncedId(experience.experienceId)
  }

  const valuesRef = useRef(values)
  // 수정은 전체 스냅샷 전송이라 STAR 외 필드(제목·태그·역할·기간)는 현재 경험 값을 그대로 되돌려 보낸다.
  const experienceRef = useRef(experience)
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const save = () => {
    const current = experienceRef.current
    if (!current) return
    updateExperience(
      {
        experienceId,
        request: {
          projectId,
          title: current.title,
          tags: current.tags,
          contents: { type: 'STAR', star: valuesRef.current },
          role: current.role ?? null,
          period: current.period ?? null
        }
      },
      { onError: () => toast.error('저장에 실패했어요. 다시 시도해 주세요.', { id: 'experience-star-save-error', position: 'top-center' }) }
    )
  }

  // 렌더 중 ref 쓰기는 금지되므로, 최신 값·flush 핸들러는 매 렌더 후 effect에서 갱신한다.
  // flush: 언마운트(패널 닫기·경험 전환) 시 디바운스 대기 중인 편집이 남아 있으면 유실 없이 즉시 저장한다.
  const flushRef = useRef<() => void>(() => {})
  useEffect(() => {
    valuesRef.current = values
    experienceRef.current = experience
    flushRef.current = () => {
      if (!saveTimer.current) return
      clearTimeout(saveTimer.current)
      saveTimer.current = null
      save()
    }
  })
  useEffect(() => () => flushRef.current(), [])

  const handleChange = (key: StarKey) => (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value
    setValues((prev) => ({ ...prev, [key]: value }))
    if (saveTimer.current) clearTimeout(saveTimer.current)
    saveTimer.current = setTimeout(() => {
      saveTimer.current = null
      save()
    }, AUTOSAVE_DELAY_MS)
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
