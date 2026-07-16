'use client'
import { Flex } from '@radix-ui/themes'
import { cn } from '@shared/lib/cn'
import { Text } from '@shared/ui'
import { Chip } from '@shared/ui/chip'
import type { ProjectMeta } from '../lib/projectMeta'

interface ExperienceListCardProps {
  title: string
  keywords: string[]
  /** 카드에 표시할 역할·기간 (경험 단위 값이 없어 프로젝트 값을 공통 표시) */
  projectMeta: ProjectMeta
  selected?: boolean
  onSelect?: () => void
}

export const ExperienceListCard = ({ title, keywords, projectMeta, selected = false, onSelect }: ExperienceListCardProps) => {
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
        'group flex cursor-pointer flex-col gap-3 rounded-lg p-4 text-left ring transition-colors ring-inset',
        selected ? 'bg-element-primary-lighter ring-border-primary shadow-1' : 'bg-element-white ring-border-subtler shadow-1 hover:bg-element-gray-lighter hover:shadow-none hover:ring-transparent'
      )}
    >
      <Text variant="headline2" color="text-basic">
        {title}
      </Text>
      <Flex direction="column" gap="3">
        <Flex align="center" gap="4">
          <Text variant="label2" color="text-subtler" className="w-16 shrink-0">
            역할 및 기간
          </Text>
          <Flex align="center" gap="6px">
            <Text variant="label2" color="text-bolder">
              {projectMeta.role || '-'}
            </Text>
            <span className="bg-border-subtle h-3 w-px shrink-0 rounded-full" />
            <Text variant="label2" color="text-bolder">
              {projectMeta.period || '-'}
            </Text>
          </Flex>
        </Flex>
        <Flex align="center" gap="5">
          <Text variant="label2" color="text-subtler" className="w-16 shrink-0">
            관련 역량
          </Text>
          <Flex align="center" gap="1" className="min-w-0 flex-1 flex-wrap">
            {keywords.map((keyword, index) => (
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
