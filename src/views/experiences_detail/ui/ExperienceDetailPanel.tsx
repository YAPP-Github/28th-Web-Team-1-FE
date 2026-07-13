'use client'
import { useState } from 'react'
import { Flex } from '@radix-ui/themes'
import { ChevronsLeft } from 'lucide-react'
import { Text } from '@shared/ui'
import { Chip } from '@shared/ui/chip'
import { Divider } from '@shared/ui/divider'
import { Textarea } from '@shared/ui/textarea'
import type { Experience } from './ExperienceDetailPage'

const STAR_FIELDS = [
  { key: 'situation', label: 'Situation', sublabel: '상황' },
  { key: 'task', label: 'Task', sublabel: '과업' },
  { key: 'action', label: 'Action', sublabel: '행동' },
  { key: 'result', label: 'Result', sublabel: '결과' }
] as const

type StarKey = (typeof STAR_FIELDS)[number]['key']

interface ExperienceDetailPanelProps {
  experience: Experience
  onClose: () => void
}
export const ExperienceDetailPanel = ({ experience, onClose }: ExperienceDetailPanelProps) => {
  const [values, setValues] = useState<Record<StarKey, string>>({ situation: '', task: '', action: '', result: '' })

  const handleChange = (key: StarKey) => (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValues((prev) => ({ ...prev, [key]: e.target.value }))
  }

  return (
    <Flex direction="column" className="border-border-subtle bg-bg-gray-subtler h-screen w-148.5 shrink-0 overflow-y-auto border-l p-8">
      <button type="button" aria-label="상세 패널 닫기" onClick={() => onClose()} className="mb-5 w-fit">
        <ChevronsLeft size={24} className="text-icon-gray-lighter" />
      </button>

      <Flex direction="column" className="gap-8">
        <Flex direction="column" className="gap-3">
          <Text variant="headline2" color="text-basic">
            {experience.title}
          </Text>
          <Flex direction="column" className="gap-2.5">
            <Flex align="center" className="gap-5">
              <Text variant="label2" color="text-subtler" className="w-16 shrink-0">
                역할 및 기간
              </Text>
              <Flex align="center" className="h-full gap-2">
                <Text variant="label2" color="text-bolder">
                  {experience.role}
                </Text>
                <Divider orientation="vertical" color="gray-20" />
                <Text variant="label2" color="text-bolder">
                  {experience.period}
                </Text>
              </Flex>
            </Flex>
            <Flex align="center" className="gap-5">
              <Text variant="label2" color="text-subtler" className="w-16 shrink-0">
                관련 역량
              </Text>
              <Flex align="center" className="min-w-0 flex-1 flex-wrap gap-1">
                {experience.keywords.map((keyword, index) => (
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
      </Flex>
    </Flex>
  )
}
