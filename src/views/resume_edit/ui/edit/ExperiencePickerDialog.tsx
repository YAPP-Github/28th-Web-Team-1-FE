'use client'

import { Suspense, useState, type ReactNode } from 'react'
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
  defaultSelectedExperiences?: ProjectExperience[]
  onComplete: (experiences: ProjectExperience[]) => void
} & ProjectExperienceListParams

const MAX_SELECT = 5

export const ExperiencePickerDialog = ({ isOpen, onOpenChange, onComplete, defaultSelectedExperiences = [], ...listParams }: Props) => {
  const workspaceId = useWorkspaceId()
  const [activeProjectId, setActiveProjectId] = useState<string | null>(defaultSelectedExperiences[0]?.project?.projectId ?? null)
  const [selectedExperiences, setSelectedExperiences] = useState<ProjectExperience[]>(defaultSelectedExperiences)

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

        <Suspense fallback={<ExperiencePickerBodySkeleton />}>
          <ProjectExperiencesBody
            workspaceId={workspaceId}
            activeProjectId={activeProjectId}
            listParams={listParams}
            selectedExperienceIds={selectedExperienceIds}
            onToggle={toggleExperience}
            onReset={() => setSelectedExperiences([])}
            onSelect={setActiveProjectId}
          />
        </Suspense>

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

interface ProjectExperiencesBodyProps {
  workspaceId: string
  activeProjectId: string | null
  listParams: ProjectExperienceListParams
  selectedExperienceIds: string[]
  onToggle: (experience: ProjectExperience) => void
  onReset: () => void
  onSelect: (projectId: string) => void
}

/** 다이얼로그 본문 프레임(테두리 박스). 프로젝트 pane과 경험 pane을 가로로 담는다. */
const BodyFrame = ({ children }: { children: ReactNode }) => <Flex className={'border-border-subtler min-h-0 flex-1 overflow-hidden rounded-md border'}>{children}</Flex>

/** 프로젝트 선택 pane. 제목과 프로젝트 목록(또는 스켈레톤)을 세로로 담는다. */
const ProjectPane = ({ children }: { children: ReactNode }) => (
  <Flex direction={'column'} className={'bg-element-gray-lighter w-58 p-4'}>
    <Text variant={'label1'} color={'text-subtler'}>
      프로젝트
    </Text>
    <Spacing size={12} />
    {children}
  </Flex>
)

/**
 * 프로젝트 목록 pane과 경험 목록 pane을 함께 렌더한다. 두 pane이 같은 프로젝트 목록 쿼리를
 * 필요로 하므로(경험 pane은 프로젝트명 표시) 여기서 한 번만 구독해 내려준다.
 * 프로젝트 목록 로딩은 이 컴포넌트를 감싼 Suspense가, 경험 목록 로딩은 내부 Suspense가 처리한다.
 */
const ProjectExperiencesBody = ({ workspaceId, activeProjectId, listParams, selectedExperienceIds, onToggle, onReset, onSelect }: ProjectExperiencesBodyProps) => {
  const { projects } = useProjectList(workspaceId)
  const projectTitle = projects.find((project) => project.projectId === activeProjectId)?.name ?? '프로젝트'

  return (
    <BodyFrame>
      <ProjectPane>
        <ProjectList projects={projects} activeProjectId={activeProjectId} hasSelection={selectedExperienceIds.length > 0} onSelect={onSelect} />
      </ProjectPane>

      {activeProjectId ? (
        <ExperienceList
          key={activeProjectId}
          workspaceId={workspaceId}
          projectId={activeProjectId}
          projectTitle={projectTitle}
          params={listParams}
          selectedExperienceIds={selectedExperienceIds}
          onToggle={onToggle}
          onReset={onReset}
        />
      ) : (
        <Flex className={'min-w-0 flex-1'}>
          <Flex direction={'column'} gap={'4'} className={'min-h-0 w-90 flex-1 overflow-hidden px-5 py-4'}>
            <Heading variant={'heading2'} className={'line-clamp-1'}>
              프로젝트명
            </Heading>
            <Divider color={'gray-10'} />

            <Text variant={'label2'} color={'text-subtler'} className={'my-auto text-center'}>
              프로젝트를 선택하면 경험 목록을 볼 수 있어요
            </Text>
          </Flex>

          <Divider orientation={'vertical'} color={'gray-10'} />

          <ExperiencePreviewPane />
        </Flex>
      )}
    </BodyFrame>
  )
}

const ProjectList = ({
  projects,
  activeProjectId,
  hasSelection,
  onSelect
}: {
  projects: ReturnType<typeof useProjectList>['projects']
  activeProjectId: string | null
  hasSelection: boolean
  onSelect: (projectId: string) => void
}) => {
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
              activeProjectId === project.projectId && 'bg-element-white shadow-2'
            )}
          >
            <Text variant={'label1'} truncate className={cn('line-clamp-1', activeProjectId === project.projectId && 'text-text-primary-basic')}>
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
  projectTitle: string
  params: ProjectExperienceListParams
  selectedExperienceIds: string[]
  onToggle: (experience: ProjectExperience) => void
  onReset: () => void
}

const ExperienceList = ({ workspaceId, projectId, projectTitle, params, selectedExperienceIds, onToggle, onReset }: ExperienceListProps) => {
  const [activeExperience, setActiveExperience] = useState<ProjectExperience | null>(null)

  return (
    <Flex className={'min-w-0 flex-1'}>
      <Flex direction={'column'} gap={'4'} className={'min-h-0 w-90 flex-1 overflow-y-auto px-5 py-4'}>
        <Flex justify={'between'} align={'center'}>
          <Heading variant={'heading2'} className={'line-clamp-1'}>
            {projectTitle}
          </Heading>

          <Button variant={'text'} size={'xs'} className={'text-text-subtle'} onClick={onReset}>
            <RefreshCcw size={12} data-icon="inline-start" />
            선택 초기화
          </Button>
        </Flex>

        <Divider color={'gray-10'} />

        <Suspense fallback={<ExperienceItemsSkeleton />}>
          <ExperienceItemsBody workspaceId={workspaceId} projectId={projectId} params={params} selectedExperienceIds={selectedExperienceIds} onToggle={onToggle} onHover={setActiveExperience} />
        </Suspense>
      </Flex>

      <Divider orientation={'vertical'} color={'gray-10'} />

      <ExperiencePreviewPane experience={activeExperience} />
    </Flex>
  )
}

interface ExperienceItemsBodyProps {
  workspaceId: string
  projectId: string
  params: ProjectExperienceListParams
  selectedExperienceIds: string[]
  onToggle: (experience: ProjectExperience) => void
  onHover: (experience: ProjectExperience) => void
}

/** 경험 목록 아이템 영역. 경험 쿼리를 소유해 이 영역만 로딩되고, 제목·원문 pane은 먼저 렌더된다. */
const ExperienceItemsBody = ({ workspaceId, projectId, params, selectedExperienceIds, onToggle, onHover }: ExperienceItemsBodyProps) => {
  const { experiences } = useProjectExperiences(workspaceId, projectId, params)

  if (experiences.length === 0) {
    return (
      <Flex direction={'column'} align={'center'} justify={'center'} className={'flex-1'}>
        <Text variant={'label1'} color={'text-subtle'}>
          아직 등록된 경험이 없어요
        </Text>
        <Text variant={'caption1'} color={'text-subtler'}>
          프로젝트와 관련된 경험을 추가해 주세요
        </Text>
      </Flex>
    )
  }

  return (
    <>
      {experiences.map((experience) => {
        const isChecked = selectedExperienceIds.includes(experience.experienceId)
        const isDisabled = !isChecked && selectedExperienceIds.length >= MAX_SELECT

        return (
          <Flex
            key={experience.experienceId}
            align={'center'}
            gap={'3'}
            className={'hover:bg-element-gray-lighter cursor-pointer rounded-md px-3 py-2.5'}
            onMouseOver={() => onHover(experience)}
            asChild
          >
            <label>
              <Checkbox checked={isChecked} disabled={isDisabled} onCheckedChange={() => onToggle(experience)} />
              <Text variant={'label1'}>{experience.title}</Text>

              {experience.matchRate !== null && (
                <Text variant={'label1'} color={'text-primary-basic'} className={'ml-auto'}>
                  {experience.matchRate}%
                </Text>
              )}
            </label>
          </Flex>
        )
      })}
    </>
  )
}

/** '경험 원문' 미리보기 pane. 선택된 경험이 없으면 빈 상태(경험명·'-')를 보여준다. */
const ExperiencePreviewPane = ({ experience = null }: { experience?: ProjectExperience | null }) => (
  <Flex direction={'column'} className={'w-75 overflow-y-auto px-5 py-4'}>
    <Text variant={'label1'} color={'text-subtler'}>
      경험 원문
    </Text>
    <Spacing size={20} />

    <Text variant={'headline2'}>{experience?.title ?? '경험명'}</Text>
    <Spacing size={16} />

    <FormatExperienceContents contents={experience?.contents} />
  </Flex>
)

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

/** 경험 아이템 영역만 가리는 스켈레톤. 제목·원문 pane은 그대로 두고 목록 자리만 채운다. */
const ExperienceItemsSkeleton = () => (
  <Flex direction={'column'} gap={'4'}>
    {[0, 1, 2, 3, 4].map((i) => (
      <Skeleton key={i} height={'22px'} width={'100%'} />
    ))}
  </Flex>
)

const ExperienceListSkeleton = () => (
  <Flex className={'min-w-0 flex-1'}>
    <Flex direction={'column'} gap={'4'} className={'min-h-0 w-90 flex-1 overflow-hidden px-5 py-4'}>
      <Skeleton height={'28px'} width={'40%'} />
      <ExperienceItemsSkeleton />
    </Flex>

    <Divider orientation={'vertical'} color={'gray-10'} />

    <ExperiencePreviewPane />
  </Flex>
)

const ExperiencePickerBodySkeleton = () => (
  <BodyFrame>
    <ProjectPane>
      <ProjectListSkeleton />
    </ProjectPane>
    <ExperienceListSkeleton />
  </BodyFrame>
)
