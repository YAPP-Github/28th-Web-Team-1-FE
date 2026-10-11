'use client'

import { Suspense, useState } from 'react'
import { Flex, Skeleton } from '@radix-ui/themes'
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader } from '@shared/ui/dialog'
import { Divider, Spacing, Text, Heading, Button } from '@shared/ui'
import { cn, formatDate } from '@shared/lib'
import { useProjectList } from '@entities/project'
import { useProjectExperiences, type ProjectExperience, type ProjectExperienceListParams } from '@entities/experience'
import { useWorkspaceId } from '@entities/user'
import { Checkbox } from '@shared/ui/checkbox'
import { RefreshCcw } from 'lucide-react'

type Props = {
  isOpen: boolean
  onOpenChange?: (isOpen: boolean) => void
  onComplete: (experiences: ProjectExperience[]) => void
} & ProjectExperienceListParams

const MAX_SELECT = 5

export const ExperiencePickerDialog = (props: Props) => {
  const { isOpen, onOpenChange, onComplete } = props
  const workspaceId = useWorkspaceId()
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null)
  const [selectedExperiences, setSelectedExperiences] = useState<ProjectExperience[]>([])

  const listParams: ProjectExperienceListParams = props.tab === 'AI_RECOMMENDATION' ? { tab: props.tab, jdId: props.jdId, questionRoomId: props.questionRoomId } : { tab: props.tab, jdId: props.jdId }
  const selectedExperienceIds = selectedExperiences.map((experience) => experience.experienceId)

  const toggleExperience = (experience: ProjectExperience) => {
    setSelectedExperiences((prev) => {
      if (prev.some((item) => item.experienceId === experience.experienceId)) return prev.filter((item) => item.experienceId !== experience.experienceId)
      if (prev.length >= MAX_SELECT) return prev
      return [...prev, experience]
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className={'bg-bg-white flex h-150 w-240 flex-col p-6'}>
        <DialogHeader className={'gap-1'}>
          <Heading variant={'heading1'}>내 경험 불러오기</Heading>
          <Text variant={'label2'} color={'text-subtler'}>
            한 프로젝트 안에서 최대 5개까지 함께 고를 수 있어요.
          </Text>
        </DialogHeader>

        <Flex className={'border-border-subtler min-h-0 flex-1 overflow-hidden rounded-md border'}>
          <Flex direction={'column'} className={'bg-element-gray-lighter w-58 p-4'}>
            <Text variant={'label1'} color={'text-subtler'}>
              프로젝트
            </Text>
            <Spacing size={12} />
            <Suspense fallback={<ProjectListSkeleton />}>
              <ProjectList workspaceId={workspaceId} activeProjectId={activeProjectId} hasSelection={selectedExperienceIds.length > 0} onSelect={setActiveProjectId} />
            </Suspense>
          </Flex>

          {activeProjectId ? (
            <Suspense fallback={<ExperienceListSkeleton />}>
              <ExperienceList
                key={activeProjectId}
                workspaceId={workspaceId}
                projectId={activeProjectId}
                params={listParams}
                selectedExperienceIds={selectedExperienceIds}
                onToggle={toggleExperience}
                onReset={() => setSelectedExperiences([])}
              />
            </Suspense>
          ) : (
            <Flex align={'center'} justify={'center'} className={'flex-1'}>
              <Text variant={'label1'} color={'text-subtler'}>
                프로젝트를 선택하면 경험 목록이 표시돼요
              </Text>
            </Flex>
          )}
        </Flex>

        <DialogFooter className={'flex gap-1'}>
          <DialogClose asChild>
            <Button variant={'tertiary'} size={'md'} className={'text-center'}>
              취소
            </Button>
          </DialogClose>
          <Button disabled={selectedExperiences.length === 0} size={'md'} onClick={() => onComplete(selectedExperiences)}>
            선택 완료
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

const ProjectList = ({
  workspaceId,
  activeProjectId,
  hasSelection,
  onSelect
}: {
  workspaceId: string
  activeProjectId: string | null
  hasSelection: boolean
  onSelect: (projectId: string) => void
}) => {
  const { projects } = useProjectList(workspaceId)

  if (projects.length === 0) {
    return (
      <Text variant={'label1'} color={'text-subtler'}>
        등록된 프로젝트가 없어요
      </Text>
    )
  }

  return (
    <Flex direction={'column'} gap={'2'} className={'overflow-y-auto'}>
      {projects.map((project) => {
        const disabled = hasSelection && project.projectId !== activeProjectId

        return (
          <button
            key={project.projectId}
            type={'button'}
            disabled={disabled}
            onClick={() => onSelect(project.projectId)}
            className={cn(
              'hover:bg-element-white hover:shadow-2 flex flex-col gap-0.5 rounded-md px-3 py-2 text-left disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent',
              activeProjectId === project.projectId && 'bg-element-gray-lighter'
            )}
          >
            <Text variant={'label1'} truncate className={'line'}>
              {project.name}
            </Text>
            <Text variant={'label2'} color={'text-subtler'} truncate>
              {formatDate(project.period?.startAt, 'YYYY.MM')} - {formatDate(project.period?.endAt, 'YYYY.MM')} · 경험 {project.experienceCount}개
            </Text>
          </button>
        )
      })}
    </Flex>
  )
}

interface ExperienceListProps {
  workspaceId: string
  projectId: string
  params: ProjectExperienceListParams
  selectedExperienceIds: string[]
  onToggle: (experience: ProjectExperience) => void
  onReset: () => void
}

const ExperienceList = ({ workspaceId, projectId, params, selectedExperienceIds, onToggle, onReset }: ExperienceListProps) => {
  const { experiences } = useProjectExperiences(workspaceId, projectId, params)
  const [activeExperience, setActiveExperience] = useState<ProjectExperience | null>(null)

  if (experiences.length === 0) {
    return (
      <Text variant={'label1'} color={'text-subtler'}>
        프로젝트에 등록된 경험이 없어요
      </Text>
    )
  }

  return (
    <Flex className={'min-w-0 flex-1'}>
      <Flex direction={'column'} gap={'4'} className={'min-h-0 w-90 flex-1 overflow-y-auto px-5 py-4'}>
        <Flex justify={'between'} align={'center'}>
          <Heading variant={'heading2'} className={'line-clamp-1'}>
            {experiences[0].project?.name}
          </Heading>

          <Button variant={'text'} size={'xs'} className={'text-text-subtle'} onClick={onReset}>
            <RefreshCcw size={12} data-icon="inline-start" />
            선택 초기화
          </Button>
        </Flex>

        <Divider color={'gray-10'} />

        {experiences.map((experience) => {
          const isChecked = selectedExperienceIds.includes(experience.experienceId)
          const isDisabled = !isChecked && selectedExperienceIds.length >= MAX_SELECT

          return (
            <Flex
              key={experience.experienceId}
              align={'center'}
              gap={'3'}
              className={'hover:bg-element-gray-lighter cursor-pointer rounded-md px-3 py-2.5'}
              onMouseOver={() => setActiveExperience(experience)}
              asChild
            >
              <label>
                <Checkbox checked={isChecked} disabled={isDisabled} onCheckedChange={() => onToggle(experience)} />
                <Text variant={'label1'}>{experience.title}</Text>

                <Text variant={'label1'} color={'text-primary-basic'} className={'ml-auto'}>
                  {experience.matchRate}%
                </Text>
              </label>
            </Flex>
          )
        })}
      </Flex>

      <Divider orientation={'vertical'} color={'gray-10'} />

      <Flex direction={'column'} className={'w-75 overflow-y-auto px-5 py-4'}>
        <Text variant={'label1'} color={'text-subtler'}>
          경험 원문
        </Text>
        <Spacing size={20} />

        <Text variant={'headline2'}>{activeExperience?.title ?? '경험명'}</Text>
        <Spacing size={16} />

        <FormatExperienceContents contents={activeExperience?.contents} />
      </Flex>
    </Flex>
  )
}

const FormatExperienceContents = ({ contents }: { contents?: ProjectExperience['contents'] }) => {
  if (contents?.type === 'FREE') {
    return (
      <Text variant={'caption1'} className={'whitespace-pre-wrap'} color={'text-subtler'}>
        {contents.free?.content || '-'}
      </Text>
    )
  }

  const { situation, task, action, result } = contents?.star ?? {}
  const rows: Array<{ label: string; value?: string | null }> = [
    { label: 'Situation (상황)', value: situation },
    { label: 'Task (과업)', value: task },
    { label: 'Action (행동)', value: action },
    { label: 'Result (결과)', value: result }
  ]

  return (
    <Flex direction={'column'} gap={'3'}>
      {rows.map(({ label, value }) => (
        <Flex key={label} direction={'column'}>
          <Text variant={'caption1'} color={'text-subtler'}>
            {label}
          </Text>
          <Text variant={'caption1'} className={'whitespace-pre-wrap'} color={'text-subtler'}>
            {value || '-'}
          </Text>
        </Flex>
      ))}
    </Flex>
  )
}

const ProjectListSkeleton = () => (
  <Flex direction={'column'} gap={'1'}>
    {[0, 1, 2, 3].map((i) => (
      <Skeleton key={i} height={'32px'} width={'100%'} />
    ))}
  </Flex>
)

const ExperienceListSkeleton = () => (
  <Flex className={'min-w-0 flex-1'}>
    <Flex direction={'column'} gap={'4'} className={'min-h-0 w-90 flex-1 overflow-hidden px-5 py-4'}>
      <Skeleton height={'28px'} width={'40%'} />
      {[0, 1, 2, 3, 4].map((i) => (
        <Skeleton key={i} height={'22px'} width={'100%'} />
      ))}
    </Flex>

    <Divider orientation={'vertical'} color={'gray-10'} />

    <Flex direction={'column'} gap={'4'} className={'w-75 px-5 py-4'}>
      <Skeleton height={'16px'} width={'30%'} />
      <Skeleton height={'24px'} width={'60%'} />
      {[0, 1, 2, 3].map((i) => (
        <Skeleton key={i} height={'32px'} width={'100%'} />
      ))}
    </Flex>
  </Flex>
)
