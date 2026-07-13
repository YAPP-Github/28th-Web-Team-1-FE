'use client'
import { useState } from 'react'
import { Trash2 } from 'lucide-react'
import { Flex } from '@radix-ui/themes'
import { cn } from '@shared/lib/cn'
import { Button, Text } from '@shared/ui'
import { Chip } from '@shared/ui/chip'
import { AddExperienceDialog } from './AddExperienceDialog'
import { ExperienceDetailPanel } from './ExperienceDetailPanel'

// TODO : 실제 프로젝트/경험 데이터 연동 예정 (라우트 params의 id로 조회)
const PROJECT = {
  title: '프로젝트명',
  period: '2025.05-2025.08',
  role: '기획',
  description: `이 프로젝트는 영국에서 최초로 시작되어 일년에 한바퀴를 돌면서 받는 사람에게 행운을 주었고 지금은 당신에게로 옮겨진 이 편지는 4일 안에 당신 곁을 떠나야 합니다.`
}

const EXPERIENCES: Experience[] = Array.from({ length: 8 }, (_, index) => ({
  id: index,
  title: '경험1',
  role: '역할',
  period: '2025.00 - 2025.00',
  keywords: ['역량 키워드', '역량 키워드', '역량 키워드', '역량 키워드']
}))

export const ExperienceDetailPage = () => {
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const selectedExperience = EXPERIENCES.find((experience) => experience.id === selectedId) ?? null

  return (
    <Flex className="h-screen">
      <Flex direction="column" className="h-full flex-1 overflow-y-auto p-8">
        <Flex direction="column" className={cn('w-full gap-8', selectedExperience ? 'max-w-full' : 'max-w-[795px]')}>
          {/* 페이지 헤더 */}
          <Flex direction="column" className="gap-2">
            <Text variant="heading2" color="text-basic">
              경험정리
            </Text>
            <Text variant="body1" color="text-subtler">
              경험을 정리해서 이력서 소재로 활용해요.
            </Text>
          </Flex>

          {/* 프로젝트 정보 */}
          <Flex direction="column" className="gap-1">
            <Text variant="headline1" color="text-basic" className="py-2 pr-2">
              {PROJECT.title}
            </Text>
            <Flex direction="column" className="gap-4 py-2">
              <Flex className="gap-5">
                <Flex align="center" className="flex-1 gap-4">
                  <Text variant="label1" color="text-basic" className="shrink-0">
                    기간
                  </Text>
                  <Text variant="body2" color="text-basic">
                    {PROJECT.period}
                  </Text>
                </Flex>
                <Flex align="center" className="flex-1 gap-4">
                  <Text variant="label1" color="text-basic" className="shrink-0">
                    역할
                  </Text>
                  <Text variant="body2" color="text-basic">
                    {PROJECT.role}
                  </Text>
                </Flex>
              </Flex>
              <Flex className="gap-4">
                <Text variant="label1" color="text-basic" className="shrink-0">
                  설명
                </Text>
                <Text variant="body2" color="text-basic" className="flex-1">
                  {PROJECT.description}
                </Text>
              </Flex>
            </Flex>
          </Flex>

          {/* 경험 목록 */}
          <Flex direction="column" className="gap-3">
            <Flex align="center" justify="between">
              <Text variant="headline1" color="text-basic">
                경험 목록
              </Text>
              <AddExperienceDialog />
            </Flex>
            <div className={cn('grid w-full gap-4', selectedExperience ? 'grid-cols-1' : 'grid-cols-2')}>
              {EXPERIENCES.map((experience) => (
                <ExperienceListCard
                  key={experience.id}
                  experience={experience}
                  selected={selectedId === experience.id}
                  onSelect={() => setSelectedId((prev) => (prev === experience.id ? null : experience.id))}
                  onEdit={() => setSelectedId(experience.id)}
                />
              ))}
            </div>
          </Flex>
        </Flex>
      </Flex>

      {selectedExperience && <ExperienceDetailPanel key={selectedExperience.id} experience={selectedExperience} onClose={() => setSelectedId(null)} />}
    </Flex>
  )
}

export interface Experience {
  id: number
  title: string
  role: string
  period: string
  keywords: string[]
}

interface ExperienceListCardProps {
  experience: Experience
  selected?: boolean
  onSelect?: () => void
  onEdit?: () => void
  onDelete?: () => void
}

/** 경험 상세 페이지 "경험 목록"의 개별 경험 카드 (Figma: experience/list, default/hovered/pressed) */
const ExperienceListCard = ({ experience, selected = false, onSelect, onEdit, onDelete }: ExperienceListCardProps) => {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      onSelect?.()
    }
  }

  return (
    <div
      role="button"
      tabIndex={0}
      aria-pressed={selected}
      onClick={() => onSelect?.()}
      onKeyDown={handleKeyDown}
      className={cn(
        'group flex cursor-pointer flex-col gap-3 rounded-lg border p-4 text-left transition-colors',
        selected
          ? 'bg-element-primary-lighter border-border-primary shadow-1'
          : 'bg-element-white border-border-subtler shadow-1 hover:bg-element-gray-lighter hover:border-transparent hover:shadow-none'
      )}
    >
      <Flex align="center" justify="between" className="h-7.5">
        <Text variant="headline2" color="text-basic">
          {experience.title}
        </Text>
        {!selected && (
          <Flex align="center" className="hidden gap-2 group-hover:flex">
            <Button
              variant="tertiary"
              size="xs"
              className="bg-btn-secondary-fill"
              onClick={(e) => {
                e.stopPropagation()
                onEdit?.()
              }}
            >
              수정하기
            </Button>
            <Button
              variant="danger"
              size="icon-xs"
              onClick={(e) => {
                e.stopPropagation()
                onDelete?.()
              }}
            >
              <Trash2 size={12} />
            </Button>
          </Flex>
        )}
      </Flex>
      <Flex direction="column" className="gap-3">
        <Flex align="center" className="gap-5">
          <Text variant="label2" color="text-subtler" className="w-16 shrink-0">
            역할 및 기간
          </Text>
          <Flex align="center" className="gap-2">
            <Text variant="label2" color="text-bolder">
              {experience.role}
            </Text>
            <span className="bg-border-subtle h-3 w-px shrink-0 rounded-full" />
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
              <Chip key={index} size="sm" className={cn('group-hover:bg-element-white', selected && 'bg-element-white')}>
                {keyword}
              </Chip>
            ))}
          </Flex>
        </Flex>
      </Flex>
    </div>
  )
}
