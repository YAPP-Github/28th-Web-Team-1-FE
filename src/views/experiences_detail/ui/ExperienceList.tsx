'use client'
import { Flex } from '@radix-ui/themes'
import { cn, formatPeriod } from '@shared/lib'
import { Text, Button } from '@shared/ui'
import { Chip } from '@shared/ui/chip'
import { useState } from 'react'
import { useParams } from 'next/navigation'
import { toast } from 'sonner'
import { Plus } from 'lucide-react'
import { useCreateExperience } from '@entities/experience'
import { useWorkspaceId } from '@entities/user'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@shared/ui/dialog'
import { Textarea } from '@/src/shared/ui/textarea'

interface ExperiencePeriod {
  startAt?: string | null
  endAt?: string | null
}
interface ExperienceListItem {
  experienceId: string
  title: string
  tags: string[]
  role: string | null
  period: ExperiencePeriod | null
}
interface ExperienceListProps {
  experiences: ExperienceListItem[]
  expanded: boolean
  selectedId: string | null
  onSelect: (experienceId: string) => void
}
export const ExperienceList = ({ experiences, expanded, selectedId, onSelect }: ExperienceListProps) => {
  return (
    <Flex direction="column" gap="3">
      <Flex align="center" justify="between">
        <Text variant="headline1" color="text-basic">
          경험 목록
        </Text>
        <AddExperienceButton />
      </Flex>
      {experiences.length === 0 ? (
        <Flex direction="column" align="center" justify="center" className="border-border-subtle h-32 rounded-lg border border-dashed px-6 py-5" gap="3">
          <Text variant="headline2" color="text-basic">
            아직 작성된 경험이 없어요.
          </Text>
          <Text variant="body2" color="text-subtler">
            경험을 추가하면 AI가 STAR 구조로 정리해 이력서 소재로 활용할 수 있어요.
          </Text>
        </Flex>
      ) : (
        <div className={cn('grid w-full gap-4', expanded ? 'grid-cols-1' : 'grid-cols-2')}>
          {experiences.map((experience) => (
            <ExperienceListCard key={experience.experienceId} experience={experience} selected={selectedId === experience.experienceId} onClick={() => onSelect(experience.experienceId)} />
          ))}
        </div>
      )}
    </Flex>
  )
}

const AddExperienceButton = () => {
  const workspaceId = useWorkspaceId()
  const { projectId } = useParams<{ projectId: string }>()

  const [isOpen, setIsOpen] = useState(false)
  const [content, setContent] = useState('')
  const { mutate: createExperience, isPending } = useCreateExperience(workspaceId, projectId)

  const handleOpenChange = (next: boolean) => {
    if (next) setContent('')
    setIsOpen(next)
  }

  const handleSubmit = () => {
    const trimmed = content.trim()
    if (!trimmed) {
      toast.warning('경험 내용을 입력해 주세요.', { id: 'experience-content-required', position: 'top-center' })
      return
    }
    createExperience(
      { projectId, title: trimmed, contents: { type: 'FREE', free: { content: content } } },
      {
        onSuccess: () => {
          toast.success('경험이 추가되었어요.', { id: 'experience-created', position: 'top-center' })
          setIsOpen(false)
        },
        onError: () => toast.error('경험 추가에 실패했어요. 다시 시도해 주세요.', { id: 'experience-create-error', position: 'top-center' })
      }
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="primary" size="sm">
          <Plus size={16} data-icon="inline-start" />
          경험 추가하기
        </Button>
      </DialogTrigger>
      <DialogContent className="w-200 gap-6">
        <DialogHeader>
          <DialogTitle>
            <Text variant="heading2" weight="semibold" color="text-basic">
              직접 정리하기
            </Text>
          </DialogTitle>
          <DialogDescription className="text-body1 text-text-subtler">떠오르는 경험을 자유롭게 작성해 주세요. AI가 이력서에 적합한 STAR 구조로 정리해 드려요.</DialogDescription>
        </DialogHeader>
        <Textarea label="경험내용" placeholder="텍스트를 입력해주세요." maxLength={null} value={content} onChange={(e) => setContent(e.target.value)} />
        <Button variant="primary" size="xl" className="w-full" onClick={handleSubmit} disabled={isPending}>
          경험 추출하기
        </Button>
      </DialogContent>
    </Dialog>
  )
}

interface ExperienceListCardProps {
  experience: ExperienceListItem
  selected?: boolean
  onClick?: () => void
}
const ExperienceListCard = ({ experience, selected = false, onClick }: ExperienceListCardProps) => {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      onClick?.()
    }
  }

  return (
    <div
      role="button"
      tabIndex={0}
      aria-pressed={selected}
      onClick={() => onClick?.()}
      onKeyDown={handleKeyDown}
      className={cn(
        'group flex cursor-pointer flex-col gap-3 rounded-lg p-4 text-left ring transition-colors ring-inset',
        selected ? 'bg-element-primary-lighter ring-border-primary shadow-1' : 'bg-element-white ring-border-subtler shadow-1 hover:bg-element-gray-lighter hover:shadow-none hover:ring-transparent'
      )}
    >
      <Text variant="headline2" color="text-basic">
        {experience.title}
      </Text>
      <Flex direction="column" gap="3">
        <Flex align="center" gap="4">
          <Text variant="label2" color="text-subtler" className="w-16 shrink-0">
            역할 및 기간
          </Text>
          <Flex align="center" gap="6px">
            <Text variant="label2" color="text-bolder">
              {experience.role || '-'}
            </Text>
            <span className="bg-border-subtle h-3 w-px shrink-0 rounded-full" />
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
              <Chip key={index} size="sm" className={cn('group-hover:bg-element-white', selected && 'bg-element-white')}>
                {tag}
              </Chip>
            ))}
          </Flex>
        </Flex>
      </Flex>
    </div>
  )
}
