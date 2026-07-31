import { toast } from 'sonner'
import { useState } from 'react'
import { ChevronDown, ChevronLeft, Plus } from 'lucide-react'
import { Flex } from '@radix-ui/themes'
import { useProjectOptions, type CreateProjectInput } from '@entities/project'
import type { CreateExperienceInput } from '@entities/experience'
import { useWorkspaceId } from '@entities/user'
import { Button, Text } from '@shared/ui'
import { Textarea } from '@shared/ui/textarea'
import { DialogHeader, DialogTitle, DialogDescription } from '@shared/ui/dialog'
import { cn } from '@shared/lib/cn'
import { Popover, PopoverContent, PopoverTrigger } from '@shared/ui/popover'
import { Input } from '@shared/ui/input'

/** 선택 목록에 쓰는 프로젝트 하나. 서버 프로젝트는 `projectId`를, 아직 생성 전인 초안은 `local:이름`을 id로 쓴다. */
interface ProjectOption {
  id: string
  name: string
}

export const AddProjectManualView = ({
  onBack,
  onExtract,
  onAddExperience
}: {
  onBack: () => void
  onExtract: (input: CreateProjectInput) => void
  onAddExperience: (input: CreateExperienceInput) => void
}) => {
  const [selectedId, setSelectedId] = useState('')
  const [content, setContent] = useState('')
  const [createdProjects, setCreatedProjects] = useState<ProjectOption[]>([])
  const workspaceId = useWorkspaceId()

  // 서버의 기존 프로젝트 목록 + 화면에서 새로 추가한 이름(아직 생성 전)을 합쳐 선택지로 보여준다.
  // 이름이 아니라 id로 구분한다 — 서버 프로젝트는 이름이 같아도 projectId가 다른 별개 프로젝트일 수 있다.
  const serverProjects: ProjectOption[] = useProjectOptions(workspaceId).map((project) => ({ id: project.projectId, name: project.name }))
  const projects = [...createdProjects, ...serverProjects]

  // 명시적으로 고르지 않았으면 목록 첫 번째 프로젝트를 기본 선택으로 사용한다.
  const selectedProject = projects.find((project) => project.id === selectedId) ?? projects[0] ?? null

  const handleCreateProject = (name: string) => {
    const id = `local:${name}`
    setCreatedProjects((prev) => (prev.some((project) => project.id === id) ? prev : [{ id, name }, ...prev]))
    setSelectedId(id)
  }

  const handleExtract = () => {
    if (!selectedProject) {
      toast.warning('프로젝트 이름을 입력해 주세요.', { id: 'project-required', position: 'top-center' })
      return
    }
    if (!content.trim()) {
      toast.warning('경험 내용을 입력해 주세요.', { id: 'content-required', position: 'top-center' })
      return
    }

    // 새로 추가한 프로젝트 이름을 고른 경우: 프로젝트 생성 + AI STAR 추출
    if (selectedProject.id.startsWith('local:')) {
      onExtract({ name: selectedProject.name, summary: content })
      return
    }

    // 기존 프로젝트를 고른 경우: 그 프로젝트에 경험만 추가
    // title은 빈값을 보내고, AI가 생성한다.
    onAddExperience({ projectId: selectedProject.id, title: '', contents: { type: 'FREE', free: { content } } })
  }

  return (
    <>
      <DialogHeader>
        <Flex direction="row" align="center" className="gap-2">
          <button onClick={() => onBack()} aria-label="이전으로" className="text-icon-gray">
            <ChevronLeft size={24} />
          </button>
          <DialogTitle className="text-title3 text-text-basic font-bold">직접 입력하기</DialogTitle>
        </Flex>
        <DialogDescription className="text-body1 text-text-subtler">떠오르는 경험을 자유롭게 작성해 주세요. AI가 이력서에 적합한 STAR 구조로 정리해 드려요.</DialogDescription>
      </DialogHeader>
      <Flex direction="column" className="max-h-[60vh] gap-6 overflow-y-auto">
        <Flex className="gap-2">
          {projects.length > 0 && <ProjectSelectPopover projects={projects} selectedName={selectedProject?.name ?? ''} onSelect={setSelectedId} />}
          <ProjectCreatePopover projects={projects} onCreate={handleCreateProject} />
        </Flex>
        <Textarea label="경험내용" placeholder="텍스트를 입력해주세요." maxLength={null} value={content} onChange={(e) => setContent(e.target.value)} />
      </Flex>
      <Button variant="primary" size="xl" className="w-full" onClick={handleExtract}>
        경험 추출하기
      </Button>
    </>
  )
}

interface ProjectCreatePopoverProps {
  projects: ProjectOption[]
  onCreate: (name: string) => void
}
const ProjectCreatePopover = ({ projects, onCreate }: ProjectCreatePopoverProps) => {
  const MAX_LENGTH = 20
  const [isOpen, setIsOpen] = useState(false)
  const [text, setText] = useState('')

  const handleChange = (value: string) => {
    if (value.length > MAX_LENGTH) {
      // 같은 id로 재사용해 연타 시 토스트가 쌓이지 않도록 함
      toast.warning(`프로젝트 명은 ${MAX_LENGTH}자까지 입력할 수 있어요.`, { id: 'project-name-max', position: 'top-center' })
      return
    }
    setText(value)
  }

  const handleCreate = () => {
    onCreate(text)
    setText('')
    setIsOpen(false)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // 텍스트가 비어 있으면 "직접 추가" 버튼 자체가 렌더되지 않는 것과 동일하게, 제출도 무시한다.
    if (!text) return
    handleCreate()
  }

  return (
    <Popover open={isOpen} onOpenChange={(open) => setIsOpen(open)}>
      <PopoverTrigger asChild>
        {projects.length === 0 ? (
          <Button
            variant="secondary"
            size="md"
            className={cn(
              'bg-btn-tertiary-fill text-icon-gray border-transparent',
              // open
              'data-[state=open]:bg-btn-secondary-fill-pressed data-[state=open]:text-text-primary-bolder data-[state=open]:border-btn-secondary-border-pressed'
            )}
          >
            <Plus size={18} />
            신규 프로젝트 생성
          </Button>
        ) : (
          <Button
            variant="secondary"
            size="icon-md"
            className={cn(
              'bg-btn-tertiary-fill text-icon-gray border-transparent',
              // open
              'data-[state=open]:bg-btn-secondary-fill-pressed data-[state=open]:text-text-primary-bolder data-[state=open]:border-btn-secondary-border-pressed'
            )}
          >
            <Plus size={18} />
          </Button>
        )}
      </PopoverTrigger>
      <PopoverContent sideOffset={10} align="start" className="shadow-1 w-max max-w-lg min-w-80 overflow-hidden rounded-sm">
        <form onSubmit={handleSubmit}>
          <div className="bg-bg-gray-subtler px-2.5 py-2.5">
            <Input placeholder="프로젝트 명을 직접 입력해서 추가할 수 있어요." value={text} onChange={(e) => handleChange(e.target.value)} />
          </div>
          {text && (
            <div className="bg-bg-gray-subtler border-btn-outline-border border-t px-2.5 py-2.5">
              <button
                type="submit"
                className={cn(
                  'border-btn-secondary-border bg-btn-secondary-fill text-text-primary-basic text-body2 flex w-full items-center gap-1 rounded-lg border border-dashed px-4 py-3 whitespace-nowrap',
                  //hover
                  'hover:bg-btn-secondary-fill-hovered hover:font-semibold'
                )}
              >
                <Plus size={18} />`{text}` 직접 추가
              </button>
            </div>
          )}
        </form>
      </PopoverContent>
    </Popover>
  )
}

interface ProjectSelectPopoverProps {
  projects: ProjectOption[]
  selectedName: string
  onSelect: (id: string) => void
}
const ProjectSelectPopover = ({ projects, selectedName, onSelect }: ProjectSelectPopoverProps) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Popover open={isOpen} onOpenChange={(open) => setIsOpen(open)}>
      <PopoverTrigger asChild>
        <Button
          variant="secondary"
          size="md"
          className={cn(
            'bg-btn-tertiary-fill text-icon-gray max-w-50 border-transparent',
            // open
            'data-[state=open]:bg-btn-secondary-fill-pressed data-[state=open]:text-text-primary-bolder data-[state=open]:border-btn-secondary-border-pressed'
          )}
        >
          <span className="min-w-0 truncate">{selectedName}</span>
          <ChevronDown className="shrink-0" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        sideOffset={10}
        align="start"
        className="shadow-1 bg-element-gray-lighter max-h-[min(--spacing(60),var(--radix-popover-content-available-height))] max-w-60 overflow-x-hidden overflow-y-auto rounded-sm"
        // Dialog 안에 중첩된 Popover라 react-remove-scroll이 document 캡처 단계에서 wheel을 먼저 막아버림 → scrollTop을 직접 옮겨 우회
        onWheel={(e) => {
          e.currentTarget.scrollTop += e.deltaY
        }}
      >
        {projects.map((project) => (
          <button
            key={project.id}
            type="button"
            onClick={() => {
              onSelect(project.id)
              setIsOpen(false)
            }}
            className="text-text-subtle hover:text-text-basic hover:bg-element-gray-light px-3 py-2.5 text-start"
          >
            <Text variant="body2">{project.name}</Text>
          </button>
        ))}
      </PopoverContent>
    </Popover>
  )
}
